
// import { useState, useEffect } from "react";
// import axios from "axios";

// // සැබෑ සර්වර් API එකේ URL එක
// const API_BASE = "http://demo.onlineserp.com/serp_dev/app/integration/poss_new/exe_realese.php";

// export default function MasterSettingsPage() {
//   const [activeTab, setActiveTab] = useState("categories"); // categories, companies, branches, terminals
//   const [dataList, setDataList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   // Form input states
//   const [formData, setFormData] = useState({
//     display_name: "", folder_name: "",
//     company_name: "", company_display_name: "",
//     branch_name: "", branch_code: "", company_index: "",
//     terminal_number: "", branch_index: ""
//   });

//   // Dropdown lists
//   const [companiesList, setCompaniesList] = useState([]);
//   const [branchesList, setBranchesList] = useState([]);

//   useEffect(() => {
//     fetchTabData();
//     if (activeTab === "branches" || activeTab === "terminals") {
//       fetchCompanies();
//     }
//     if (activeTab === "terminals") {
//       fetchBranches();
//     }
//   }, [activeTab]);

//   // 1. සර්වර් එකෙන් ඩේටා Fetch කරගැනීම (GET Actions)
//   async function fetchTabData() {
//     setLoading(true);
//     try {
//       let actionName = "";
//       if (activeTab === "categories") actionName = "get_all_release_categories";
//       else if (activeTab === "companies") actionName = "get_all_companies";
//       else if (activeTab === "branches") actionName = "get_all_branches";
//       else if (activeTab === "terminals") actionName = "get_all_terminals";

//       const res = await axios.get(`${API_BASE}?action=${actionName}`);
//       if (res.data.status === "success") {
//         setDataList(res.data.data || []);
//       } else {
//         setDataList([]);
//       }
//     } catch (err) {
//       console.error("Error fetching master data:", err);
//       setDataList([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function fetchCompanies() {
//     try {
//       const res = await axios.get(`${API_BASE}?action=get_all_companies`);
//       if (res.data.status === "success") setCompaniesList(res.data.data || []);
//     } catch (err) {
//       console.error("Error fetching companies:", err);
//     }
//   }

//   async function fetchBranches() {
//     try {
//       const res = await axios.get(`${API_BASE}?action=get_all_branches`);
//       if (res.data.status === "success") setBranchesList(res.data.data || []);
//     } catch (err) {
//       console.error("Error fetching branches:", err);
//     }
//   }

//   // 2. Status එක Toggle කිරීම (Active / Inactive)
//   async function handleToggleActive(indexField, indexVal, currentStatus) {
//     try {
//       let actionName = "";
//       if (activeTab === "categories") actionName = "toggle_release_category_active";
//       else if (activeTab === "companies") actionName = "toggle_company_active";
//       else if (activeTab === "branches") actionName = "toggle_branch_active";
//       else if (activeTab === "terminals") actionName = "toggle_terminal_active";

//       const payload = {
//         [indexField]: parseInt (indexVal),
//         is_active: currentStatus ? 0 : 1
//       };

//       const res = await axios.post(`${API_BASE}?action=${actionName}`, payload);
//       if (res.data.status === "success") {
//         fetchTabData();
//       } else {
//         alert("Failed to update status: " + (res.data.message || "Unknown error"));
//       }
//     } catch (err) {
//       console.error("Toggle error:", err);
//     }
//   }

//   // 3. අලුතින් ඩේටා Add කිරීම (POST Actions)
//   async function handleAddNew(e) {
//     e.preventDefault();
//     e.stopPropagation(); // Event bubbling නතර කිරීමට

//     if (submitting) return; // දැනටමත් Submit වෙනවා නම් නවත්වන්න

//     let actionName = "";
//     let payload = {};

//     // Form Data වල සැබෑ අගයන් තිබේදැයි පරීක්ෂා කිරීම
//     if (activeTab === "categories") {
//       if (!formData.display_name.trim() || !formData.folder_name.trim()) return;
//       actionName = "add_release_category";
//       payload = { display_name: formData.display_name, folder_name: formData.folder_name };
//     } else if (activeTab === "companies") {
//       if (!formData.company_name.trim() || !formData.company_display_name.trim()) return;
//       actionName = "add_company";
//       payload = { company_name: formData.company_name, company_display_name: formData.company_display_name };
//     } else if (activeTab === "branches") {
//       if (!formData.branch_name.trim() || !formData.company_index) return;
//       actionName = "add_branch";
//       payload = { branch_name: formData.branch_name, branch_code: formData.branch_code, company_index: parseInt(formData.company_index, 10) };
//     } else if (activeTab === "terminals") {
//       if (!formData.company_index || !formData.branch_index || !formData.terminal_number) return;
//       actionName = "add_terminal";
//       payload = { 
//         company_index: parseInt(formData.company_index, 10), 
//         branch_index: parseInt(formData.branch_index, 10), 
//         terminal_number: parseInt(formData.terminal_number, 10) 
//       };
//     }

//     setSubmitting(true);

//     try {
//       const res = await axios.post(`${API_BASE}?action=${actionName}`, payload);
//       if (res.data.status === "success") {
//         alert("Record added successfully!");
//         setFormData({ display_name: "", folder_name: "", company_name: "", company_display_name: "", branch_name: "", branch_code: "", company_index: "", terminal_number: "", branch_index: "" });
//         fetchTabData();
//       } else {
//         alert("Error: " + (res.data.message || "Failed to add record"));
//       }
//     } catch (err) {
//       console.error("Add record error:", err);
//       alert("Server error while adding record.");
//     } finally {
//       setSubmitting(false); // Request එක ඉවර වූ පසු නිදහස් කිරීම
//     }
//   }

//   // 💡 Table එකට පෙන්වන ඩේටා ෆිල්ටර් කිරීම (Company & Branch අනුව)
//   let filteredDataList = dataList;

//   if (activeTab === "branches" && formData.company_index) {
//     filteredDataList = dataList.filter(item => String(item.company_index) === String(formData.company_index));
//   } else if (activeTab === "terminals" && formData.company_index) {
//     filteredDataList = dataList.filter(item => String(item.company_index) === String(formData.company_index));
    
//     if (formData.branch_index) {
//       filteredDataList = filteredDataList.filter(item => String(item.branch_index) === String(formData.branch_index));
//     }
//   }
  
//   return (
//     <section className="space-y-6 fade-in">
//       {/* Header & Tabs */}
//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-card border border-line p-5 rounded-lg">
//         <div>
//           <h2 className="font-display font-semibold text-white text-base">Master Data Management</h2>
//           <p className="text-xs text-slate-400 mt-0.5">Manage release categories, companies, branches, and POS terminals.</p>
//         </div>

//         <div className="flex flex-wrap items-center gap-1.5 bg-base p-1 rounded-md border border-line">
//           {["categories", "companies", "branches", "terminals"].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => {
//                 setActiveTab(tab);
//                 setFormData({ display_name: "", folder_name: "", company_name: "", company_display_name: "", branch_name: "", branch_code: "", company_index: "", terminal_number: "", branch_index: "" });
//               }}
//               className={`px-3 py-1.5 text-xs font-medium rounded capitalize transition-colors ${
//                 activeTab === tab ? "bg-accent text-white" : "text-slate-400 hover:text-slate-200"
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
//         {/* Left Side: Add Form */}
//         <div className="bg-card border border-line p-5 rounded-lg h-fit space-y-4">
//           <h3 className="font-display font-semibold text-white text-sm capitalize">Add New {activeTab.slice(0, -1)}</h3>
          
//           <form onSubmit={handleAddNew} className="space-y-3.5">
//             {activeTab === "categories" && (
//               <>
//                 <div>
//                   <label className="block text-[11px] text-slate-400 mb-1">Display Name</label>
//                   <input type="text" required value={formData.display_name} onChange={(e) => setFormData({...formData, display_name: e.target.value})} placeholder="e.g. Supermarket POS" className="w-full bg-base border border-line rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-accent" />
//                 </div>
//                 <div>
//                   <label className="block text-[11px] text-slate-400 mb-1">Folder Name</label>
//                   <input type="text" required value={formData.folder_name} onChange={(e) => setFormData({...formData, folder_name: e.target.value})} placeholder="e.g. supermarket_pos" className="w-full bg-base border border-line rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-accent" />
//                 </div>
//               </>
//             )}

//             {activeTab === "companies" && (
//               <>
//                 <div>
//                   <label className="block text-[11px] text-slate-400 mb-1">Company Code/Name</label>
//                   <input type="text" required value={formData.company_name} onChange={(e) => setFormData({...formData, company_name: e.target.value})} placeholder="e.g. delmo" className="w-full bg-base border border-line rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-accent" />
//                 </div>
//                 <div>
//                   <label className="block text-[11px] text-slate-400 mb-1">Company Display Name</label>
//                   <input type="text" required value={formData.company_display_name} onChange={(e) => setFormData({...formData, company_display_name: e.target.value})} placeholder="e.g. Delmo Foods" className="w-full bg-base border border-line rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-accent" />
//                 </div>
//               </>
//             )}

//             {activeTab === "branches" && (
//               <>
//                 <div>
//                   <label className="block text-[11px] text-slate-400 mb-1">Select Company</label>
//                   <select required value={formData.company_index} onChange={(e) => setFormData({...formData, company_index: e.target.value})} className="w-full bg-base border border-line rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-accent">
//                     <option value="">Select Company...</option>
//                     {companiesList.map((c) => (
//                       <option key={c.company_index} value={c.company_index}>{c.company_display_name || c.company_name}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-[11px] text-slate-400 mb-1">Branch Name</label>
//                   <input type="text" required value={formData.branch_name} onChange={(e) => setFormData({...formData, branch_name: e.target.value})} placeholder="e.g. Colombo Branch" className="w-full bg-base border border-line rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-accent" />
//                 </div>
//                 <div>
//                   <label className="block text-[11px] text-slate-400 mb-1">Branch Code</label>
//                   <input type="text" required value={formData.branch_code} onChange={(e) => setFormData({...formData, branch_code: e.target.value})} placeholder="e.g. CMB" className="w-full bg-base border border-line rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-accent" />
//                 </div>
//               </>
//             )}

//             {activeTab === "terminals" && (
//               <>
//                 <div>
//                   <label className="block text-[11px] text-slate-400 mb-1">Select Company</label>
//                   <select required value={formData.company_index} onChange={(e) => setFormData({...formData, company_index: e.target.value, branch_index: ""})} className="w-full bg-base border border-line rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-accent">
//                     <option value="">Select Company...</option>
//                     {companiesList.map((c) => (
//                       <option key={c.company_index} value={c.company_index}>{c.company_display_name || c.company_name}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-[11px] text-slate-400 mb-1">Select Branch</label>
//                   <select required value={formData.branch_index} onChange={(e) => setFormData({...formData, branch_index: e.target.value})} className="w-full bg-base border border-line rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-accent">
//                     <option value="">Select Branch...</option>
//                     {branchesList.filter(b => !formData.company_index || String(b.company_index) === String(formData.company_index)).map((b) => (
//                       <option key={b.branch_index} value={b.branch_index}>{b.branch_name} ({b.branch_code})</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-[11px] text-slate-400 mb-1">Terminal Number</label>
//                   <input type="number" required value={formData.terminal_number} onChange={(e) => setFormData({...formData, terminal_number: e.target.value})} placeholder="e.g. 1" className="w-full bg-base border border-line rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-accent" />
//                 </div>
//               </>
//             )}

//             <button type="submit" className="w-full py-2 bg-accent hover:bg-accentdeep text-white text-xs font-medium rounded transition-colors mt-2">
//               Save Record
//             </button>
//           </form>
//         </div>

//         {/* Right Side: Data Table */}
//         <div className="xl:col-span-2 bg-card border border-line rounded-lg overflow-hidden flex flex-col">
//           {loading ? (
//             <div className="py-20 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
//               <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
//               Loading {activeTab}...
//             </div>
//           ) : (
//             <div className="overflow-x-auto flex-1">
//               <table className="w-full text-left border-collapse">
//                 <thead>
//                   <tr className="border-b border-line bg-base/50 text-[11px] font-medium text-slate-400">
//                     {activeTab === "categories" && (
//                       <>
//                         <th className="p-3">Index</th>
//                         <th className="p-3">Display Name</th>
//                         <th className="p-3">Folder Name</th>
//                         <th className="p-3">Status</th>
//                         <th className="p-3 text-right">Action</th>
//                       </>
//                     )}
//                     {activeTab === "companies" && (
//                       <>
//                         <th className="p-3">Index</th>
//                         <th className="p-3">Company Name</th>
//                         <th className="p-3">Display Name</th>
//                         <th className="p-3">Status</th>
//                         <th className="p-3 text-right">Action</th>
//                       </>
//                     )}
//                     {activeTab === "branches" && (
//                       <>
//                         <th className="p-3">Index</th>
//                         <th className="p-3">Branch Number</th>
//                         <th className="p-3">Branch Name</th>
//                         <th className="p-3">Code</th>
//                         <th className="p-3">Company Index</th>
//                         <th className="p-3">Status</th>
//                         <th className="p-3 text-right">Action</th>
//                       </>
//                     )}
//                     {activeTab === "terminals" && (
//                       <>
//                         <th className="p-3">Index</th>
//                         <th className="p-3">Terminal ID</th>
//                         <th className="p-3">Number</th>
//                         <th className="p-3">Company/Branch Index</th>
//                         <th className="p-3">Status</th>
//                         <th className="p-3 text-right">Action</th>
//                       </>
//                     )}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-line text-xs text-slate-300">
//                   {filteredDataList.length === 0 ? (
//                     <tr><td colSpan="6" className="p-6 text-center text-slate-500">No records found.</td></tr>
//                   ) : (
//                     filteredDataList.map((item, mapIndex) => {
//                       // 💡 1. නිවැරදි Primary Key එක තේරීම
//                       const fieldKey = activeTab === "categories" ? "category_index" 
//                                      : activeTab === "companies" ? "company_index" 
//                                      : activeTab === "branches" ? "branch_index"
//                                      : "terminal_index";
                      
//                       // 💡 2. ඒ ඒ ටැබ් එකට ආවේණික වූ Index එක ලබා ගැනීම
//                       const idx = item[fieldKey] || mapIndex; 
                      
//                       return (
//                         // 💡 3. Key එක Unique වීමට ActiveTab එකත් එක්කම Key එක සෑදීම
//                         <tr key={`${activeTab}-${idx}`} className="hover:bg-base/30 transition-colors">
//                           {activeTab === "categories" && (
//                             <>
//                               <td className="p-3 font-mono">#{item.category_index}</td>
//                               <td className="p-3 font-medium text-white">{item.display_name}</td>
//                               <td className="p-3 font-mono text-slate-400">{item.folder_name}</td>
//                               <td className="p-3">
//                                 <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${item.is_active ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-500/15 text-slate-400"}`}>
//                                   {item.is_active ? "Active" : "Inactive"}
//                                 </span>
//                               </td>
//                               <td className="p-3 text-right">
//                                 <button onClick={() => handleToggleActive(fieldKey, idx, item.is_active)} className="px-2.5 py-1 bg-base border border-line rounded text-[11px] text-slate-300 hover:text-white hover:border-accent transition-colors">
//                                   {item.is_active ? "Deactivate" : "Activate"}
//                                 </button>
//                               </td>
//                             </>
//                           )}

//                           {activeTab === "companies" && (
//                             <>
//                               <td className="p-3 font-mono">#{item.company_index}</td>
//                               <td className="p-3 font-medium text-white">{item.company_name}</td>
//                               <td className="p-3 text-slate-400">{item.company_display_name}</td>
//                               <td className="p-3">
//                                 <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${item.is_active ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-500/15 text-slate-400"}`}>
//                                   {item.is_active ? "Active" : "Inactive"}
//                                 </span>
//                               </td>
//                               <td className="p-3 text-right">
//                                 <button onClick={() => handleToggleActive(fieldKey, idx, item.is_active)} className="px-2.5 py-1 bg-base border border-line rounded text-[11px] text-slate-300 hover:text-white hover:border-accent transition-colors">
//                                   {item.is_active ? "Deactivate" : "Activate"}
//                                 </button>
//                               </td>
//                             </>
//                           )}

//                           {activeTab === "branches" && (
//                             <>
//                               <td className="p-3 font-mono">#{item.index}</td>
//                               <td className="p-3 font-mono">{item.branch_index}</td>
                              
//                               <td className="p-3 font-medium text-white">{item.branch_name}</td>
//                               <td className="p-3 font-mono text-slate-400">{item.branch_code}</td>
//                               <td className="p-3 font-mono text-slate-400">{item.company_index}</td>
//                               <td className="p-3">
//                                 <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${item.is_active ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-500/15 text-slate-400"}`}>
//                                   {item.is_active ? "Active" : "Inactive"}
//                                 </span>
//                               </td>
//                               <td className="p-3 text-right">
//                                 <button onClick={() => handleToggleActive("index", item.index, item.is_active)} className="px-2.5 py-1 bg-base border border-line rounded text-[11px] text-slate-300 hover:text-white hover:border-accent transition-colors">
//                                   {item.is_active ? "Deactivate" : "Activate"}
//                                 </button>
//                               </td>
//                             </>
//                           )}

//                           {activeTab === "terminals" && (
//                             <>
//                               <td className="p-3 font-mono">#{item.terminal_index}</td>
//                               <td className="p-3 font-mono text-white">{item.terminal_id}</td>
//                               <td className="p-3 font-mono">{item.terminal_number}</td>
//                               <td className="p-3 font-mono text-slate-400">C: {item.company_index} | B: {item.branch_index}</td>
//                               <td className="p-3">
//                                 <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${item.is_active ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-500/15 text-slate-400"}`}>
//                                   {item.is_active ? "Active" : "Inactive"}
//                                 </span>
//                               </td>
//                               <td className="p-3 text-right">
//                                 <button onClick={() => handleToggleActive(fieldKey, idx, item.is_active)} className="px-2.5 py-1 bg-base border border-line rounded text-[11px] text-slate-300 hover:text-white hover:border-accent transition-colors">
//                                   {item.is_active ? "Deactivate" : "Activate"}
//                                 </button>
//                               </td>
//                             </>
//                           )}
//                         </tr>
//                       );
//                     })
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }




import { useState, useEffect } from "react";
import axios from "axios";

// සැබෑ සර්වර් API එකේ URL එක
const API_BASE = "http://demo.onlineserp.com/serp_dev/app/integration/poss_new/exe_realese.php";

export default function MasterSettingsPage() {
  const [activeTab, setActiveTab] = useState("categories"); 
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    display_name: "", folder_name: "",
    company_name: "", company_display_name: "",
    branch_name: "", branch_code: "", company_index: "",
    terminal_number: "", branch_index: ""
  });

  const [companiesList, setCompaniesList] = useState([]);
  const [branchesList, setBranchesList] = useState([]);

  useEffect(() => {
    fetchTabData();
    if (activeTab === "branches" || activeTab === "terminals") {
      fetchCompanies();
    }
    if (activeTab === "terminals") {
      fetchBranches();
    }
  }, [activeTab]);

  // 1. Fetch All Data (සම්පූර්ණ දත්ත ගෙන්වා ගැනීම)
  async function fetchTabData() {
    setLoading(true);
    try {
      let actionName = "";
      if (activeTab === "categories") actionName = "get_all_release_categories";
      else if (activeTab === "companies") actionName = "get_all_companies";
      else if (activeTab === "branches") actionName = "get_all_branches";
      else if (activeTab === "terminals") actionName = "get_all_terminals";

      const res = await axios.get(`${API_BASE}?action=${actionName}`);
      if (res.data.status === "success") {
        setDataList(res.data.data || []);
      } else {
        setDataList([]);
      }
    } catch (err) {
      console.error("Error fetching master data:", err);
      setDataList([]);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCompanies() {
    try {
      const res = await axios.get(`${API_BASE}?action=get_all_companies`);
      if (res.data.status === "success") setCompaniesList(res.data.data || []);
    } catch (err) {
      console.error("Error fetching companies:", err);
    }
  }

  async function fetchBranches() {
    try {
      const res = await axios.get(`${API_BASE}?action=get_all_branches`);
      if (res.data.status === "success") setBranchesList(res.data.data || []);
    } catch (err) {
      console.error("Error fetching branches:", err);
    }
  }

  // 2. Toggle Status
  async function handleToggleActive(indexField, indexVal, currentStatus) {
    try {
      let actionName = "";
      if (activeTab === "categories") actionName = "toggle_release_category_active";
      else if (activeTab === "companies") actionName = "toggle_company_active";
      else if (activeTab === "branches") actionName = "toggle_branch_active";
      else if (activeTab === "terminals") actionName = "toggle_terminal_active";

      const payload = {
        [indexField]: parseInt(indexVal),
        is_active: currentStatus ? 0 : 1
      };

      const res = await axios.post(`${API_BASE}?action=${actionName}`, payload);
      if (res.data.status === "success") {
        fetchTabData();
      } else {
        alert("Failed to update status: " + (res.data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Toggle error:", err);
    }
  }

  // 3. Add New Data
  async function handleAddNew(e) {
    e.preventDefault();
    e.stopPropagation(); 

    if (submitting) return; 

    let actionName = "";
    let payload = {};

    if (activeTab === "categories") {
      if (!formData.display_name.trim() || !formData.folder_name.trim()) return;
      actionName = "add_release_category";
      payload = { display_name: formData.display_name, folder_name: formData.folder_name };
    } else if (activeTab === "companies") {
      if (!formData.company_name.trim() || !formData.company_display_name.trim()) return;
      actionName = "add_company";
      payload = { company_name: formData.company_name, company_display_name: formData.company_display_name };
    } else if (activeTab === "branches") {
      if (!formData.branch_name.trim() || !formData.company_index) return;
      actionName = "add_branch";
      payload = { branch_name: formData.branch_name, branch_code: formData.branch_code, company_index: parseInt(formData.company_index, 10) };
    } else if (activeTab === "terminals") {
      if (!formData.company_index || !formData.branch_index || !formData.terminal_number) return;
      actionName = "add_terminal";
      payload = { 
        company_index: parseInt(formData.company_index, 10), 
        branch_index: parseInt(formData.branch_index, 10), 
        terminal_number: parseInt(formData.terminal_number, 10) 
      };
    }

    setSubmitting(true);

    try {
      const res = await axios.post(`${API_BASE}?action=${actionName}`, payload);
      if (res.data.status === "success") {
        alert("Record added successfully!");
        setFormData({ display_name: "", folder_name: "", company_name: "", company_display_name: "", branch_name: "", branch_code: "", company_index: "", terminal_number: "", branch_index: "" });
        fetchTabData();
      } else {
        alert("Error: " + (res.data.message || "Failed to add record"));
      }
    } catch (err) {
      console.error("Add record error:", err);
      alert("Server error while adding record.");
    } finally {
      setSubmitting(false); 
    }
  }

  // 💡 Frontend Filtering Logic (Table එකට පෙන්වන ඩේටා ෆිල්ටර් කිරීම)
  let filteredDataList = dataList;

  if (activeTab === "branches" && formData.company_index) {
    // Branches ටැබ් එකේ Company එකක් තේරූ විට Table එක Filter වීම
    filteredDataList = dataList.filter(item => String(item.company_index) === String(formData.company_index));
  } else if (activeTab === "terminals") {
    // Terminals ටැබ් එකේ Company එකක් තේරූ විට Table එක Filter වීම
    if (formData.company_index) {
      filteredDataList = dataList.filter(item => String(item.company_index) === String(formData.company_index));
    }
    // ඉන්පසු Branch එකක් තේරූ විට තවත් දුරට Table එක Filter වීම
    if (formData.branch_index) {
      filteredDataList = filteredDataList.filter(item => String(item.branch_index) === String(formData.branch_index));
    }
  }

  return (
    <section className="space-y-6 fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-card border border-line p-5 rounded-lg">
        <div>
          <h2 className="font-display font-semibold text-white text-base">Master Data Management</h2>
          <p className="text-xs text-slate-400 mt-0.5">Manage release categories, companies, branches, and POS terminals.</p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-base p-1 rounded-md border border-line">
          {["categories", "companies", "branches", "terminals"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setFormData({ display_name: "", folder_name: "", company_name: "", company_display_name: "", branch_name: "", branch_code: "", company_index: "", terminal_number: "", branch_index: "" });
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded capitalize transition-colors ${
                activeTab === tab ? "bg-accent text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-card border border-line p-5 rounded-lg h-fit space-y-4">
          <h3 className="font-display font-semibold text-white text-sm capitalize">Add New {activeTab.slice(0, -1)}</h3>
          
          <form onSubmit={handleAddNew} className="space-y-3.5">
            {activeTab === "categories" && (
              <>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Display Name</label>
                  <input type="text" required value={formData.display_name} onChange={(e) => setFormData({...formData, display_name: e.target.value})} placeholder="e.g. Supermarket POS" className="w-full bg-base border border-line rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-accent" />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Folder Name</label>
                  <input type="text" required value={formData.folder_name} onChange={(e) => setFormData({...formData, folder_name: e.target.value})} placeholder="e.g. supermarket_pos" className="w-full bg-base border border-line rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-accent" />
                </div>
              </>
            )}

            {activeTab === "companies" && (
              <>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Company Code/Name</label>
                  <input type="text" required value={formData.company_name} onChange={(e) => setFormData({...formData, company_name: e.target.value})} placeholder="e.g. delmo" className="w-full bg-base border border-line rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-accent" />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Company Display Name</label>
                  <input type="text" required value={formData.company_display_name} onChange={(e) => setFormData({...formData, company_display_name: e.target.value})} placeholder="e.g. Delmo Foods" className="w-full bg-base border border-line rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-accent" />
                </div>
              </>
            )}

            {activeTab === "branches" && (
              <>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Select Company (Filters Table)</label>
                  <select required value={formData.company_index} onChange={(e) => setFormData({...formData, company_index: e.target.value})} className="w-full bg-base border border-line rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-accent">
                    <option value="">Select Company...</option>
                    {companiesList.map((c) => (
                      <option key={c.company_index} value={c.company_index}>{c.company_display_name || c.company_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Branch Name</label>
                  <input type="text" required value={formData.branch_name} onChange={(e) => setFormData({...formData, branch_name: e.target.value})} placeholder="e.g. Colombo Branch" className="w-full bg-base border border-line rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-accent" />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Branch Code</label>
                  <input type="text" required value={formData.branch_code} onChange={(e) => setFormData({...formData, branch_code: e.target.value})} placeholder="e.g. CMB" className="w-full bg-base border border-line rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-accent" />
                </div>
              </>
            )}

            {activeTab === "terminals" && (
              <>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Select Company (Filters Dropdown & Table)</label>
                  <select required value={formData.company_index} onChange={(e) => setFormData({...formData, company_index: e.target.value, branch_index: ""})} className="w-full bg-base border border-line rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-accent">
                    <option value="">Select Company...</option>
                    {companiesList.map((c) => (
                      <option key={c.company_index} value={c.company_index}>{c.company_display_name || c.company_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Select Branch (Filters Table)</label>
                  <select required value={formData.branch_index} onChange={(e) => setFormData({...formData, branch_index: e.target.value})} className="w-full bg-base border border-line rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-accent">
                    <option value="">Select Branch...</option>
                    {/* 💡 තේරූ Company එකට අදාළ Branches පමණක් මෙහි පෙන්වයි */}
                    {branchesList.filter(b => !formData.company_index || String(b.company_index) === String(formData.company_index)).map((b) => (
                      <option key={b.branch_index} value={b.branch_index}>{b.branch_name} ({b.branch_code})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Terminal Number</label>
                  <input type="number" required value={formData.terminal_number} onChange={(e) => setFormData({...formData, terminal_number: e.target.value})} placeholder="e.g. 1" className="w-full bg-base border border-line rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-accent" />
                </div>
              </>
            )}

            <button type="submit" className="w-full py-2 bg-accent hover:bg-accentdeep text-white text-xs font-medium rounded transition-colors mt-2">
              Save Record
            </button>
          </form>
        </div>

        <div className="xl:col-span-2 bg-card border border-line rounded-lg overflow-hidden flex flex-col">
          {loading ? (
            <div className="py-20 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
              Loading {activeTab}...
            </div>
          ) : (
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-line bg-base/50 text-[11px] font-medium text-slate-400">
                    {activeTab === "categories" && (
                      <>
                        <th className="p-3">Index</th>
                        <th className="p-3">Display Name</th>
                        <th className="p-3">Folder Name</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Action</th>
                      </>
                    )}
                    {activeTab === "companies" && (
                      <>
                        <th className="p-3">Index</th>
                        <th className="p-3">Company Name</th>
                        <th className="p-3">Display Name</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Action</th>
                      </>
                    )}
                    {activeTab === "branches" && (
                      <>
                        <th className="p-3">Index</th>
                        <th className="p-3">Branch Number</th>
                        <th className="p-3">Branch Name</th>
                        <th className="p-3">Code</th>
                        <th className="p-3">Company Index</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Action</th>
                      </>
                    )}
                    {activeTab === "terminals" && (
                      <>
                        <th className="p-3">Index</th>
                        <th className="p-3">Terminal ID</th>
                        <th className="p-3">Number</th>
                        <th className="p-3">Company/Branch Index</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Action</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line text-xs text-slate-300">
                  {/* 💡 මෙතන filteredDataList මඟින් තමයි ෆිල්ටර් වුණු ඩේටා ටික පෙන්වන්නේ */}
                  {filteredDataList.length === 0 ? (
                    <tr><td colSpan="7" className="p-6 text-center text-slate-500">No records found for the selected filter.</td></tr>
                  ) : (
                    filteredDataList.map((item, mapIndex) => {
                      const fieldKey = activeTab === "categories" ? "category_index" 
                                     : activeTab === "companies" ? "company_index" 
                                     : activeTab === "branches" ? "branch_index"
                                     : "terminal_index";
                      
                      const idx = item[fieldKey] || mapIndex; 
                      
                      return (
                        <tr key={`${activeTab}-${idx}`} className="hover:bg-base/30 transition-colors">
                          {activeTab === "categories" && (
                            <>
                              <td className="p-3 font-mono">#{item.category_index}</td>
                              <td className="p-3 font-medium text-white">{item.display_name}</td>
                              <td className="p-3 font-mono text-slate-400">{item.folder_name}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${item.is_active ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-500/15 text-slate-400"}`}>
                                  {item.is_active ? "Active" : "Inactive"}
                                </span>
                              </td>
                              <td className="p-3 text-right">
                                <button onClick={() => handleToggleActive(fieldKey, idx, item.is_active)} className="px-2.5 py-1 bg-base border border-line rounded text-[11px] text-slate-300 hover:text-white hover:border-accent transition-colors">
                                  {item.is_active ? "Deactivate" : "Activate"}
                                </button>
                              </td>
                            </>
                          )}

                          {activeTab === "companies" && (
                            <>
                              <td className="p-3 font-mono">#{item.company_index}</td>
                              <td className="p-3 font-medium text-white">{item.company_name}</td>
                              <td className="p-3 text-slate-400">{item.company_display_name}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${item.is_active ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-500/15 text-slate-400"}`}>
                                  {item.is_active ? "Active" : "Inactive"}
                                </span>
                              </td>
                              <td className="p-3 text-right">
                                <button onClick={() => handleToggleActive(fieldKey, idx, item.is_active)} className="px-2.5 py-1 bg-base border border-line rounded text-[11px] text-slate-300 hover:text-white hover:border-accent transition-colors">
                                  {item.is_active ? "Deactivate" : "Activate"}
                                </button>
                              </td>
                            </>
                          )}

                          {activeTab === "branches" && (
                            <>
                              <td className="p-3 font-mono">#{item.index}</td>
                              <td className="p-3 font-mono">{item.branch_index}</td>
                              <td className="p-3 font-medium text-white">{item.branch_name}</td>
                              <td className="p-3 font-mono text-slate-400">{item.branch_code}</td>
                              <td className="p-3 font-mono text-slate-400">{item.company_index}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${item.is_active ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-500/15 text-slate-400"}`}>
                                  {item.is_active ? "Active" : "Inactive"}
                                </span>
                              </td>
                              <td className="p-3 text-right">
                                <button onClick={() => handleToggleActive("index", item.index, item.is_active)} className="px-2.5 py-1 bg-base border border-line rounded text-[11px] text-slate-300 hover:text-white hover:border-accent transition-colors">
                                  {item.is_active ? "Deactivate" : "Activate"}
                                </button>
                              </td>
                            </>
                          )}

                          {activeTab === "terminals" && (
                            <>
                              <td className="p-3 font-mono">#{item.terminal_index}</td>
                              <td className="p-3 font-mono text-white">{item.terminal_id}</td>
                              <td className="p-3 font-mono">{item.terminal_number}</td>
                              <td className="p-3 font-mono text-slate-400">C: {item.company_index} | B: {item.branch_index}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${item.is_active ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-500/15 text-slate-400"}`}>
                                  {item.is_active ? "Active" : "Inactive"}
                                </span>
                              </td>
                              <td className="p-3 text-right">
                                <button onClick={() => handleToggleActive(fieldKey, idx, item.is_active)} className="px-2.5 py-1 bg-base border border-line rounded text-[11px] text-slate-300 hover:text-white hover:border-accent transition-colors">
                                  {item.is_active ? "Deactivate" : "Activate"}
                                </button>
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}