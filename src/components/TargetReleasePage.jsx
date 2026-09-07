import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://demo.onlineserp.com/serp_dev/app/integration/poss_new/exe_realese.php";

export default function TargetReleasePage({ versions = [], onPublish }) {
  const [categories, setCategories] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  
  const [selectedCategory, setSelectedCategory] = useState("");
  const [releaseName, setReleaseName] = useState("");
  const [showVersionDropdown, setShowVersionDropdown] = useState(false);
  const [company, setCompany] = useState("ALL");
  const [branch, setBranch] = useState("0");
  const [isMandatory, setIsMandatory] = useState(false);
  
  const [activeDeployments, setActiveDeployments] = useState([]);
  const [loadingDeployments, setLoadingDeployments] = useState(true);

  useEffect(() => {
    fetchInitialMasterData();
    fetchActiveDeployments();
  }, []);

  // 1. Database එකෙන් Master Data Fetch කිරීම (Categories, Companies, Branches)
  async function fetchInitialMasterData() {
    try {
      const [catRes, compRes, branchRes] = await Promise.all([
        axios.get(`${API_BASE}?action=get_all_release_categories`),
        axios.get(`${API_BASE}?action=get_all_companies`),
        axios.get(`${API_BASE}?action=get_all_branches`)
      ]);

      if (catRes.data?.status === "success") {
        const cats = catRes.data.data.map(c => c.display_name);
        setCategories(cats);
        if (cats.length > 0) setSelectedCategory(cats[0]);
      }

      if (compRes.data?.status === "success") {
        setCompanyList(compRes.data.data || []);
      }

      if (branchRes.data?.status === "success") {
        setBranchList(branchRes.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching master dropdowns:", error);
    }
  }

  // 2. Active Target Deployments Fetch කිරීම
  const fetchActiveDeployments = async () => {
    setLoadingDeployments(true);
    try {
      const response = await axios.get(`${API_BASE}?action=get_target_deployments`);
      if (response.data && response.data.status === "success") {
        setActiveDeployments(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching target deployments:", error);
    } finally {
      setLoadingDeployments(false);
    }
  };

  // Database Versions Filter කිරීම
  const filteredVersions = versions
    .map((v) => v.versionNumber)
    .filter((v) => v.toLowerCase().includes(releaseName.toLowerCase()));

  // 3. Active Deployment Card එකක් Click කළ විට Form එකට Auto-fill වීම
  const handleSelectDeployment = (item) => {
    setReleaseName(item.version || "");
    if (item.category) setSelectedCategory(item.category);
    setCompany(item.company || "ALL");
    setBranch(item.branch ? String(item.branch) : "0");
    setIsMandatory(Boolean(item.mandatory));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!releaseName.trim()) {
      alert("Please select or enter a Release Version.");
      return;
    }

    const targetData = {
      releaseName: releaseName.replace(/^v/i, ''),
      category: selectedCategory,
      company: company,
      branch: branch,
      isMandatory: isMandatory ? 1 : 0,
    };

    try {
      const response = await axios.post(`${API_BASE}?action=publish_target`, targetData);

      if (response.data && response.data.status === "success") {
        alert("Target release published successfully!");
        if (onPublish) onPublish(targetData);
        fetchActiveDeployments();
        setReleaseName("");
        setIsMandatory(false);
      } else {
        alert("Error: " + (response.data.message || "Could not publish target."));
      }
    } catch (error) {
      console.error("Failed to publish target release:", error);
      alert("Error connecting to server.");
    }
  }

  return (
    <section className="space-y-6 fade-in">
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        
        {/* Left Side: Target Release Form */}
        <div className="xl:col-span-3 bg-card border border-line rounded-lg p-6 space-y-6">
          <div>
            <h2 className="font-display font-semibold text-white text-lg">Target Release Settings</h2>
            <p className="text-xs text-slate-500 mt-1">Assign deployment target parameters for existing builds.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category Dropdown */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Application Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-base border border-line rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-accent"
              >
                {categories.length === 0 ? (
                  <option value="">Loading Categories...</option>
                ) : (
                  categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))
                )}
              </select>
            </div>

            {/* Release Version Autocomplete */}
            <div className="relative">
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Release Version (Search/Type)</label>
              <input
                type="text"
                required
                value={releaseName}
                onChange={(e) => {
                  setReleaseName(e.target.value);
                  setShowVersionDropdown(true);
                }}
                onFocus={() => setShowVersionDropdown(true)}
                onBlur={() => setTimeout(() => setShowVersionDropdown(false), 200)}
                placeholder="Search database versions (e.g. 1.0.6)"
                className="w-full bg-base border border-line rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-accent font-mono"
              />

              {showVersionDropdown && filteredVersions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-card border border-line rounded-md shadow-lg max-h-40 overflow-y-auto">
                  {filteredVersions.map((v) => (
                    <div
                      key={v}
                      onClick={() => {
                        setReleaseName(v);
                        setShowVersionDropdown(false);
                      }}
                      className="px-3 py-2 text-xs text-slate-300 hover:bg-accent/20 hover:text-white cursor-pointer transition-colors font-mono"
                    >
                      v{v}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Target Company Dropdown */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Target Company</label>
              <select
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-base border border-line rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="ALL">ALL Companies</option>
                {companyList.map((c) => (
                  <option key={c.company_index} value={c.company_name}>
                    {c.company_display_name || c.company_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Branch Dropdown */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Target Branch</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full bg-base border border-line rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="0">ALL Branches</option>
                {branchList.map((b) => (
                  <option key={b.branch_index} value={b.branch_index}>
                    {b.branch_name} ({b.branch_code || `Index: ${b.branch_index}`})
                  </option>
                ))}
              </select>
            </div>

            {/* Mandatory Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={isMandatory}
                onChange={(e) => setIsMandatory(e.target.checked)}
                className="w-4 h-4 rounded bg-base border-line text-accent focus:ring-0"
              />
              <span className="text-xs text-slate-300">Mark as mandatory update</span>
            </label>

            <button type="submit" className="w-full py-2.5 bg-accent hover:bg-accentdeep text-white text-sm font-medium rounded-md transition-colors mt-2">
              Publish Release
            </button>
          </form>
        </div>

        {/* Right Side: Active Deployments Panel */}
        <div className="xl:col-span-2 bg-card border border-line rounded-lg p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-display font-semibold text-white text-base">Active Target Deployments</h3>
              <button 
                onClick={fetchActiveDeployments} 
                className="text-[11px] text-accent hover:underline"
              >
                Refresh
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">Click any deployment to select and edit parameters.</p>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {loadingDeployments ? (
                <div className="text-center py-8 text-xs text-slate-400 flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                  Loading deployments...
                </div>
              ) : activeDeployments.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">No active target deployments found.</p>
              ) : (
                activeDeployments.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectDeployment(item)}
                    className="p-3 bg-base/60 border border-line/70 hover:border-accent/60 rounded-md space-y-1.5 cursor-pointer transition-all hover:bg-base"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white font-mono">v{item.version}</span>
                      <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded border border-accent/20 font-medium">
                        {item.category || "General"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Target: <strong className="text-slate-200">{item.company}</strong> (Branch: {item.branch})</span>
                      {item.mandatory === 1 && <span className="text-amber-400 font-medium">Mandatory</span>}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono text-right pt-0.5">
                      {item.date}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 p-3 bg-accent/5 border border-accent/20 rounded-md">
            <p className="text-xs text-accent font-medium">Deployment Rule</p>
            <p className="text-[11px] text-slate-400 mt-1">Publishing a target pushes update notifications instantly to matching client terminals.</p>
          </div>
        </div>

      </div>
    </section>
  );
}