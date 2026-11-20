


// import { useState, useEffect, useMemo } from "react";
// import axios from "axios";

// const API_BASE = "http://demo.onlineserp.com/serp_dev/app/integration/poss_new/exe_realese.php";

// export default function TargetReleasePage({ versions = [], onPublish }) {
//   const [categories, setCategories] = useState([]);
//   const [companyList, setCompanyList] = useState([]);
//   const [branchList, setBranchList] = useState([]);
//   const [terminalList, setTerminalList] = useState([]); // Master Terminals
  
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [versionId, setVersionId] = useState("");
  
//   const [company, setCompany] = useState("");
//   const [branch, setBranch] = useState("ALL");
//   const [terminal, setTerminal] = useState("ALL");
//   const [isMandatory, setIsMandatory] = useState(false);
  
//   const [activeDeployments, setActiveDeployments] = useState([]);
//   const [loadingDeployments, setLoadingDeployments] = useState(true);

//   useEffect(() => {
//     fetchInitialMasterData();
//     fetchActiveDeployments();
//   }, []);

//   async function fetchInitialMasterData() {
//     try {
//       const [catRes, compRes, branchRes, termRes] = await Promise.all([
//         axios.get(`${API_BASE}?action=get_all_release_categories`),
//         axios.get(`${API_BASE}?action=get_all_companies`),
//         axios.get(`${API_BASE}?action=get_all_branches`),
//         axios.get(`${API_BASE}?action=get_all_terminals`)
//       ]);

//       if (catRes.data?.status === "success" && Array.isArray(catRes.data.data)) {
//         const cats = catRes.data.data.map(c => c.display_name);
//         setCategories(cats);
//         if (cats.length > 0) setSelectedCategory(cats[0]);
//       } else {
//         setCategories([]);
//       }

//       if (compRes.data?.status === "success" && Array.isArray(compRes.data.data)) {
//         setCompanyList(compRes.data.data);
//       } else {
//         setCompanyList([]);
//       }

//       if (branchRes.data?.status === "success" && Array.isArray(branchRes.data.data)) {
//         setBranchList(branchRes.data.data);
//       } else {
//         setBranchList([]);
//       }

//       if (termRes.data?.status === "success" && Array.isArray(termRes.data.data)) {
//         setTerminalList(termRes.data.data);
//       } else {
//         setTerminalList([]);
//       }
//     } catch (error) {
//       console.error("Error fetching master dropdowns:", error);
//     }
//   }

//   const fetchActiveDeployments = async () => {
//     setLoadingDeployments(true);
//     try {
//       const response = await axios.get(`${API_BASE}?action=get_target_deployments`);
//       if (response.data?.status === "success" && Array.isArray(response.data.data)) {
//         setActiveDeployments(response.data.data);
//       } else {
//         setActiveDeployments([]);
//       }
//     } catch (error) {
//       console.error("Error fetching target deployments:", error);
//       setActiveDeployments([]);
//     } finally {
//       setLoadingDeployments(false);
//     }
//   };

//   // 💡 තෝරාගත් Company එකට අදාළ Branches පමණක් Filter කිරීම
//   const filteredBranches = useMemo(() => {
//     if (!company || company === "") return branchList;
//     return branchList.filter(b => String(b.company_index) === String(company));
//   }, [branchList, company]);

//   // 💡 තෝරාගත් Company සහ Branch එකට අදාළ Terminals පමණක් Filter කිරීම
//   const filteredTerminals = useMemo(() => {
//     let list = terminalList;
//     if (company && company !== "") {
//       list = list.filter(t => String(t.company_index) === String(company));
//     }
//     if (branch && branch !== "") {
//       list = list.filter(t => String(t.branch_index) === String(branch));
//     }
//     return list;
//   }, [terminalList, company, branch]);

//   const categoryVersions = useMemo(() => {
//     if (!selectedCategory || !Array.isArray(versions)) return [];
//     return versions.filter(
//       (v) => v.systemType === selectedCategory || v.category === selectedCategory
//     );
//   }, [versions, selectedCategory]);

//   const handleSelectDeployment = (item) => {
//     if (!item) return;

//     if (item.category) {
//       setSelectedCategory(item.category);
//     }
//     setTimeout(() => {
//       setVersionId(item.versionId || "");
//     }, 50);
    
//     setCompany(item.company_index || item.company || "");
//     setBranch(item.branch ? String(item.branch) : "ALL");
//     setTerminal(item.terminal || "ALL");
//     setIsMandatory(Boolean(item.mandatory));
//   };

//   async function handleSubmit(e) {
//     e.preventDefault();

//     if (!versionId) {
//       alert("Please select a Release Version from the dropdown.");
//       return;
//     }

//     if (!company) {
//       alert("Please select a Target Company.");
//       return;
//     }

//     const targetData = {
//       versionId: parseInt(versionId, 10),
//       company: parseInt(company, 10),
//       branch: branch,
//       terminal: terminal || "ALL",
//       isMandatory: isMandatory ? 1 : 0,
//     };

//     try {
//       const response = await axios.post(`${API_BASE}?action=publish_target`, targetData);

//       if (response.data && response.data.status === "success") {
//         alert("Target release published successfully!");
//         if (onPublish) onPublish(targetData);
//         fetchActiveDeployments();
        
//         // Reset Form
//         setVersionId("");
//         setCompany("");
//         setBranch("ALL");
//         setTerminal("ALL");
//         setIsMandatory(false);
//       } else {
//         alert("Error: " + (response.data.message || "Could not publish target."));
//       }
//     } catch (error) {
//       console.error("Failed to publish target release:", error);
//       alert("Error connecting to server.");
//     }
//   }

//   return (
//     <section className="space-y-6 fade-in">
//       <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        
//         {/* Left Side: Target Release Form */}
//         <div className="xl:col-span-3 bg-card border border-line rounded-lg p-6 space-y-6">
//           <div>
//             <h2 className="font-display font-semibold text-white text-lg">Target Release Settings</h2>
//             <p className="text-xs text-slate-500 mt-1">Assign deployment target parameters for existing builds.</p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
            
//             {/* Category Dropdown */}
//             <div>
//               <label className="block text-xs font-medium text-slate-400 mb-1.5">Application Category</label>
//               <select
//                 value={selectedCategory}
//                 onChange={(e) => {
//                   setSelectedCategory(e.target.value);
//                   setVersionId(""); 
//                 }}
//                 className="w-full bg-base border border-line rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-accent"
//               >
//                 {categories.length === 0 ? (
//                   <option value="">Loading Categories...</option>
//                 ) :
//                 (
                  
//                   categories.map((cat, idx) => (
//                     <option key={`cat-${idx}`} value={cat}>{cat}</option>
//                   ))
//                 )}
//               </select>
//             </div>

//             {/* Release Version Dropdown */}
//             <div>
//               <label className="block text-xs font-medium text-slate-400 mb-1.5">Release Version</label>
//               <select
//                 value={versionId}
//                 onChange={(e) => setVersionId(e.target.value)}
//                 required
//                 className="w-full bg-base border border-line rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-accent font-mono"
//               >
//                 <option value="" disabled>-- Select Version --</option>
//                 {categoryVersions.length === 0 ? (
//                   <option value="" disabled>No versions found for this category</option>
//                 ) : (
//                   categoryVersions.map((v, idx) => (
//                     <option key={`ver-${v.versionId || idx}`} value={v.versionId}>
//                       v{v.versionNumber} {v.releaseNotes ? ` - ${v.releaseNotes.substring(0, 30)}...` : ""}
//                     </option>
//                   ))
//                 )}
//               </select>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               {/* Target Company Dropdown */}
//               <div>
//                 <label className="block text-xs font-medium text-slate-400 mb-1.5">
//                   Target Company <span className="text-red-400">*</span>
//                 </label>
//                 <select
//                   value={company}
//                   onChange={(e) => {
//                     setCompany(e.target.value);
//                     setBranch("ALL"); // Company වෙනස් කරද්දී Branch, Terminal reset කරයි
//                     setTerminal("ALL");
//                   }}
//                   required
//                   className="w-full bg-base border border-line rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-accent"
//                 >
//                   <option value="" disabled>-- Select Company --</option>
//                   {companyList.map((c, idx) => (
//                     <option key={`comp-${c.company_index || idx}`} value={c.company_index}>
//                       {c.company_display_name || c.company_name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Target Branch Dropdown */}
//               <div>
//                 <label className="block text-xs font-medium text-slate-400 mb-1.5">Target Branch</label>
//                 <select
//                   value={branch}
//                   onChange={(e) => {
//                     setBranch(e.target.value);
//                     setTerminal("ALL"); // Branch වෙනස් කරද්දී Terminal reset කරයි
//                   }}
//                   className="w-full bg-base border border-line rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-accent"
//                 >
//                   <option value="ALL">ALL Branches</option>
//                   {filteredBranches.map((b, idx) => (
//                     <option key={`branch-${b.branch_index || idx}`} value={b.branch_index}>
//                       {b.branch_name} ({b.branch_code || `Index: ${b.branch_index}`})
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* Target Terminal Dropdown */}
//             <div>
//               <label className="block text-xs font-medium text-slate-400 mb-1.5">Target Terminal / Machine ID</label>
//               <select
//                 value={terminal}
//                 onChange={(e) => setTerminal(e.target.value)}
//                 className="w-full bg-base border border-line rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-accent font-mono"
//               >
//                 <option value="ALL">ALL Terminals</option>
//                 {filteredTerminals.map((t, idx) => (
//                   <option key={`term-${t.terminal_index || idx}`} value={t.terminal_id || t.terminal_number}>
//                     {t.terminal_id ? `${t.terminal_id} (No: ${t.terminal_number})` : `Terminal #${t.terminal_number}`}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Mandatory Checkbox */}
//             <label className="flex items-center gap-2 cursor-pointer pt-2">
//               <input
//                 type="checkbox"
//                 checked={isMandatory}
//                 onChange={(e) => setIsMandatory(e.target.checked)}
//                 className="w-4 h-4 rounded bg-base border-line text-accent focus:ring-0"
//               />
//               <span className="text-xs text-slate-300">Mark as mandatory update</span>
//             </label>

//             <button type="submit" className="w-full py-2.5 bg-accent hover:bg-accentdeep text-white text-sm font-medium rounded-md transition-colors mt-2">
//               Publish Release
//             </button>
//           </form>
//         </div>

//         {/* Right Side: Active Deployments Panel */}
//         <div className="xl:col-span-2 bg-card border border-line rounded-lg p-6 flex flex-col justify-between">
//           <div>
//             <div className="flex items-center justify-between mb-1">
//               <h3 className="font-display font-semibold text-white text-base">Active Target Deployments</h3>
//               <button 
//                 onClick={fetchActiveDeployments} 
//                 className="text-[11px] text-accent hover:underline"
//               >
//                 Refresh
//               </button>
//             </div>
//             <p className="text-xs text-slate-500 mb-4">Click any deployment to select and edit parameters.</p>

//             <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
//               {loadingDeployments ? (
//                 <div className="text-center py-8 text-xs text-slate-400 flex items-center justify-center gap-2">
//                   <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
//                   Loading deployments...
//                 </div>
//               ) : activeDeployments.length === 0 ? (
//                 <p className="text-xs text-slate-500 text-center py-6">No active target deployments found.</p>
//               ) : (
//                 activeDeployments.map((item, idx) => (
//                   <div
//                     key={`dep-${item.id || idx}`}
//                     onClick={() => handleSelectDeployment(item)}
//                     className="p-3 bg-base/60 border border-line/70 hover:border-accent/60 rounded-md space-y-1.5 cursor-pointer transition-all hover:bg-base"
//                   >
//                     <div className="flex items-center justify-between">
//                       <span className="text-xs font-semibold text-white font-mono">v{item.version}</span>
//                       <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded border border-accent/20 font-medium">
//                         {item.category || "General"}
//                       </span>
//                     </div>
//                     <div className="flex items-center justify-between text-[11px] text-slate-400">
//                       <span>Target: <strong className="text-slate-200">{item.company}</strong> (Branch: {item.branch})</span>
//                       {item.mandatory === 1 && <span className="text-amber-400 font-medium">Mandatory</span>}
//                     </div>
//                     <div className="text-[10px] text-slate-500 font-mono text-right pt-0.5">
//                       {item.date}
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>

//           <div className="mt-4 p-3 bg-accent/5 border border-accent/20 rounded-md">
//             <p className="text-xs text-accent font-medium">Deployment Rule</p>
//             <p className="text-[11px] text-slate-400 mt-1">Publishing a target pushes update notifications instantly to matching client terminals.</p>
//           </div>
//         </div>

//       </div>
//     </section>
//   );
// }



import { useState, useEffect, useMemo } from "react";
import axios from "axios";

const API_BASE = "https://demo.onlineserp.com/serp_dev/app/integration/poss_new/exe_realese.php";

export default function TargetReleasePage({ versions = [], onPublish }) {
  const [categories, setCategories] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [terminalList, setTerminalList] = useState([]); 
  
  const [selectedCategory, setSelectedCategory] = useState("");
  const [versionId, setVersionId] = useState("");
  
  const [company, setCompany] = useState("");
  const [branch, setBranch] = useState(""); // 💡 මුල් අගය හිස් කර ඇත
  const [terminal, setTerminal] = useState(""); // 💡 මුල් අගය හිස් කර ඇත
  const [isMandatory, setIsMandatory] = useState(false);
  
  const [activeDeployments, setActiveDeployments] = useState([]);
  const [loadingDeployments, setLoadingDeployments] = useState(true);

  useEffect(() => {
    fetchInitialMasterData();
    fetchActiveDeployments();
  }, []);

  async function fetchInitialMasterData() {
    try {
      const [catRes, compRes, branchRes, termRes] = await Promise.all([
        axios.get(`${API_BASE}?action=get_all_release_categories`),
        axios.get(`${API_BASE}?action=get_all_companies`),
        axios.get(`${API_BASE}?action=get_all_branches`),
        axios.get(`${API_BASE}?action=get_all_terminals`)
      ]);

      if (catRes.data?.status === "success" && Array.isArray(catRes.data.data)) {
        const cats = catRes.data.data.map(c => c.display_name);
        setCategories(cats);
        if (cats.length > 0) setSelectedCategory(cats[0]);
      } else {
        setCategories([]);
      }

      if (compRes.data?.status === "success" && Array.isArray(compRes.data.data)) {
        setCompanyList(compRes.data.data);
      } else {
        setCompanyList([]);
      }

      if (branchRes.data?.status === "success" && Array.isArray(branchRes.data.data)) {
        setBranchList(branchRes.data.data);
      } else {
        setBranchList([]);
      }

      if (termRes.data?.status === "success" && Array.isArray(termRes.data.data)) {
        setTerminalList(termRes.data.data);
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
      const response = await axios.get(`${API_BASE}?action=get_target_deployments`);
      if (response.data?.status === "success" && Array.isArray(response.data.data)) {
        setActiveDeployments(response.data.data);
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

  // 💡 තෝරාගත් Company එකට අදාළ Branches පමණක් Filter කිරීම
  const filteredBranches = useMemo(() => {
    if (!company) return []; // Company එකක් තෝරා නොමැතිනම් හිස්ව තබයි
    return branchList.filter(b => String(b.company_index) === String(company));
  }, [branchList, company]);

  // 💡 තෝරාගත් Company සහ Branch එකට අදාළ Terminals පමණක් Filter කිරීම
  const filteredTerminals = useMemo(() => {
    if (!company || !branch) return []; // Branch එක තෝරන තුරු හිස්ව තබයි
    let list = terminalList.filter(t => String(t.company_index) === String(company));
    
    if (branch !== "ALL") {
      list = list.filter(t => String(t.branch_index) === String(branch));
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

    // ෆෝම් එක Clear කිරීම
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

    try {
      const response = await axios.post(`${API_BASE}?action=publish_target`, targetData);

      if (response.data && response.data.status === "success") {
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
        alert("Error: " + (response.data.message || "Could not publish target."));
      }
    } catch (error) {
      console.error("Failed to publish target release:", error);
      alert("Error connecting to server.");
    }
  }

  // 💡 Submit Button එක Enable වීමේ Logic එක (සියලුම පියවර සම්පූර්ණ කළ යුතුමයි)
  const isFormValid = selectedCategory && versionId && company && branch && terminal;

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
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Application Category <span className="text-red-400">*</span></label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setVersionId(""); 
                }}
                className="w-full bg-base border border-line rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="" disabled>-- Select Category --</option>
                {categories.map((cat, idx) => (
                  <option key={`cat-${idx}`} value={cat}>{cat}
                    {/* {cat.display_name} */}
                  </option>
                ))}
              </select>
            </div>

            {/* Release Version Dropdown */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Release Version <span className="text-red-400">*</span></label>
              <select
                value={versionId}
                onChange={(e) => setVersionId(e.target.value)}
                required
                className="w-full bg-base border border-line rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-accent font-mono"
              >
                <option value="" disabled>-- Select Version --</option>
                {categoryVersions.map((v, idx) => (
                  <option key={`ver-${v.versionId || idx}`} value={v.versionId}>
                    v{v.versionNumber} {v.releaseNotes ? ` - ${v.releaseNotes.substring(0, 30)}...` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Target Company Dropdown */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Target Company <span className="text-red-400">*</span>
                </label>
                <select
                  value={company}
                  onChange={(e) => {
                    setCompany(e.target.value);
                    setBranch(""); // Company වෙනස් කරද්දී Branch හිස් කරයි
                    setTerminal(""); // Terminal හිස් කරයි
                  }}
                  required
                  className="w-full bg-base border border-line rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  <option value="" disabled>-- Select Company --</option>
                  {companyList.map((c, idx) => (
                    <option key={`comp-${c.company_index || idx}`} value={c.company_index}>
                      {c.company_display_name || c.company_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Branch Dropdown */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Target Branch <span className="text-red-400">*</span>
                </label>
                <select
                  value={branch}
                  onChange={(e) => {
                    setBranch(e.target.value);
                    setTerminal(""); // Branch වෙනස් කරද්දී Terminal හිස් කරයි
                  }}
                  required
                  disabled={!company}
                  className={`w-full bg-base border border-line rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-accent ${!company && "opacity-50 cursor-not-allowed"}`}
                >
                  <option value="" disabled>-- Select Branch --</option>
                  {company && <option value="ALL">ALL Branches</option>}
                  {filteredBranches.map((b, idx) => (
                    <option key={`branch-${b.branch_index || idx}`} value={b.branch_index}>
                      {b.branch_name} ({b.branch_code || `Index: ${b.branch_index}`})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Target Terminal Dropdown */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Target Terminal / Machine ID <span className="text-red-400">*</span>
              </label>
              <select
                value={terminal}
                onChange={(e) => setTerminal(e.target.value)}
                required
                disabled={!branch}
                className={`w-full bg-base border border-line rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-accent font-mono ${!branch && "opacity-50 cursor-not-allowed"}`}
              >
                <option value="" disabled>-- Select Terminal --</option>
                {branch && filteredTerminals.length === 0 ? (
                  <option disabled>No Terminals Found</option>
                ) : (
                  <>
                    {branch && <option value="ALL">ALL Terminals</option>}
                    {filteredTerminals.map((t, idx) => (
                      <option key={`term-${t.terminal_index || idx}`} value={t.terminal_id || t.terminal_number}>
                        {t.terminal_id ? `${t.terminal_id} (No: ${t.terminal_number})` : `Terminal #${t.terminal_number}`}
                      </option>
                    ))}
                  </>
                )}
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

            {/* 💡 Submit Button - Disable Logic applied */}
            <button 
              type="submit" 
              disabled={!isFormValid}
              className={`w-full py-2.5 text-white text-sm font-medium rounded-md transition-colors mt-2 ${
                isFormValid ? "bg-accent hover:bg-accentdeep" : "bg-slate-600 opacity-50 cursor-not-allowed"
              }`}
            >
              {isFormValid ? "Publish Release" : "Complete all fields to publish"}
            </button>
          </form>
        </div>

        {/* Right Side: Active Deployments Panel (Unchanged) */}
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
                activeDeployments.map((item, idx) => (
                  <div
                    key={`dep-${item.id || idx}`}
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