import { useState, useEffect } from "react";
import axios from "axios";

const APP_CATEGORIES = [
  "Supermarket POS",
  "Restaurant POS",
  "Windows Service",
  "Backoffice",
  "Mobile POS",
];

const companyOptions = ["ALL Companies", "delmo", "Keells", "Cargills", "Arpico", "Laughfs"];
const branchOptions = ["ALL", "Colombo 03", "Kandy", "Galle", "Negombo", "Kurunegala"];

// අලුතින් versions prop එක ලබාගැනීම
export default function TargetReleasePage({ versions = [], onPublish }) {
  const [selectedCategory, setSelectedCategory] = useState(APP_CATEGORIES[0]);
  const [releaseName, setReleaseName] = useState("");
  const [showVersionDropdown, setShowVersionDropdown] = useState(false);
  const [company, setCompany] = useState(companyOptions[0]);
  const [branch, setBranch] = useState(branchOptions[0]);
  const [isMandatory, setIsMandatory] = useState(false);
  
  const [activeDeployments, setActiveDeployments] = useState([]);

  const fetchActiveDeployments = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL || "http://demo.onlineserp.com/serp_dev/app/integration/poss_new/exe_realese.php";
      const response = await axios.get(`${API_URL}?action=get_target_deployments`);
      if (response.data && response.data.status === "success") {
        setActiveDeployments(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching target deployments:", error);
    }
  };

  useEffect(() => {
    fetchActiveDeployments();
  }, []);

  // Database එකෙන් එන සැබෑ Versions පමණක් Dropdown එකට ලබා ගැනීම
  const availableVersions = versions.map((v) => v.versionNumber);
  const filteredVersions = availableVersions.filter((v) =>
    v.toLowerCase().includes(releaseName.toLowerCase())
  );

  async function handleSubmit(e) {
    e.preventDefault();
    if (!releaseName.trim()) return;

    const targetData = {
      category: selectedCategory,
      releaseName: releaseName.replace('v', ''), // 'v' අකුර අයින් කර යැවීම
      company: company === "ALL Companies" ? "ALL" : company,
      branch,
      isMandatory,
    };

    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL || "http://demo.onlineserp.com/serp_dev/app/integration/poss_new/exe_realese.php";
      
      const response = await axios.post(`${API_URL}?action=publish_target`, targetData);

      if (response.data && response.data.status === "success") {
        alert("Target release published successfully!");
        
        if (onPublish) onPublish(targetData);
        fetchActiveDeployments();
        
        setReleaseName("");
        setIsMandatory(false);
      } else {
        alert("Error: " + (response.data.message || "Could not publish."));
      }
    } catch (error) {
      console.error("Failed to publish target release:", error);
      alert("Error publishing release. Please check backend connection.");
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
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Application Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-base border border-line rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-accent"
              >
                {APP_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

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
                className="w-full bg-base border border-line rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-accent"
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
                      className="px-3 py-2 text-xs text-slate-300 hover:bg-accent/20 hover:text-white cursor-pointer transition-colors"
                    >
                      v{v}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Target Company</label>
              <select
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-base border border-line rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-accent"
              >
                {companyOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Target Branch</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full bg-base border border-line rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-accent"
              >
                {branchOptions.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

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

        {/* Right Side: Deployments Panel */}
        <div className="xl:col-span-2 bg-card border border-line rounded-lg p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-display font-semibold text-white text-base mb-1">Active Target Deployments</h3>
            <p className="text-xs text-slate-500 mb-4">Current targeted versions published per application.</p>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {activeDeployments.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">No active target deployments found.</p>
              ) : (
                activeDeployments.map((item) => (
                  <div key={item.id} className="p-3 bg-base/60 border border-line/70 rounded-md space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white font-mono">{item.version}</span>
                      <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded border border-accent/20 font-medium">
                        {item.category}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Target: <strong className="text-slate-200">{item.company}</strong> ({item.branch})</span>
                      {item.mandatory && <span className="text-amber-400 font-medium">Mandatory</span>}
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
            <p className="text-[11px] text-slate-400 mt-1">Publishing a target pushes update notifications instantly.</p>
          </div>
        </div>

      </div>
    </section>
  );
}