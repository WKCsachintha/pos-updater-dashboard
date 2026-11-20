import { useState, useEffect, useRef } from "react";
import axios from "axios";

const API_BASE = "handleToggleActive://demo.onlineserp.com/serp_dev/app/integration/poss_new/exe_realese.php";

const TITLES = {
  overview: ["Dashboard Overview", "Live status across all company deployments"],
  release: ["Release Manager", "Publish a new build and target companies or branches"],
  publish: ["Target Release", "Upload build file and assign target deployment parameters"],
  monitor: ["Deployment Monitor", "Real-time status of every registered client"],
  logs: ["Update Logs", "Full audit trail from ClientUpdateLogs"],
};

export default function Header({ view }) {
  const [title, subtitle] = TITLES[view] || ["Console", "POS Deployment System"];
  
  // Search Bar සඳහා අවශ්‍ය State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const searchRef = useRef(null);

  // User Type කරන විට දත්ත Search කිරීම (Debounce ක්‍රමයට)
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }
      
      setIsSearching(true);
      setShowDropdown(true);

      try {
        // DB එකේ ඇති සියලුම යාවත්කාලීන වාර්තා ලබාගැනීම
        const response = await axios.get(`${API_BASE}?action=get_deployments`);
        
        if (response.data.status === "success" && response.data.data) {
          const q = searchQuery.toLowerCase();
          
          // Company, Branch, හෝ Machine ID එකෙන් Filter කිරීම
          const filtered = response.data.data.filter(item => 
            (item.machineId && item.machineId.toLowerCase().includes(q)) ||
            (item.company && item.company.toLowerCase().includes(q)) ||
            (item.branch && String(item.branch).toLowerCase().includes(q))
          );
          
          setSearchResults(filtered);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    }, 400); // 400ms delay එකක් දේ (Type කර අවසන් වනතුරු)

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Dropdown එකෙන් පිට Click කළ විට එය වැසී යාම
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="h-16 border-b border-line bg-base/95 backdrop-blur sticky top-0 z-30 flex items-center justify-between px-6 shrink-0">
        <div>
          <h1 className="font-display font-semibold text-white text-lg leading-none">{title}</h1>
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        </div>
        
        <div className="flex items-center gap-4">
          
          {/* Search Bar Container */}
          <div className="relative hidden md:block" ref={searchRef}>
            <svg className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { if (searchQuery.trim()) setShowDropdown(true); }}
              placeholder="Search company, branch, machine ID…"
              className="w-72 bg-card border border-line rounded-md pl-9 pr-8 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
            />
            
            {/* Loading Spinner in Search bar */}
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-3.5 h-3.5 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {/* Search Results Dropdown */}
            {showDropdown && (
              <div className="absolute top-full right-0 mt-2 w-[400px] bg-card border border-line rounded-lg shadow-xl shadow-black/40 overflow-hidden z-50">
                <div className="p-2 border-b border-line/50 bg-base/50 text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                  Search Results
                </div>
                
                <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                  {searchResults.length === 0 && !isSearching ? (
                    <div className="p-6 text-center text-sm text-slate-500">
                      No matching machines found.
                    </div>
                  ) : (
                    searchResults.map((item, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => {
                          setSelectedMachine(item);
                          setShowDropdown(false);
                          setSearchQuery("");
                        }}
                        className="p-3 border-b border-line/30 hover:bg-accent/10 cursor-pointer transition-colors flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm font-semibold text-white font-mono">{item.machineId}</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {item.company} <span className="text-slate-600 px-1">•</span> Branch {item.branch}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                            item.status?.toUpperCase() === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            item.status?.toUpperCase() === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                            {item.status || "UNKNOWN"}
                          </span>
                          <p className="text-[10px] text-slate-500 mt-1 font-mono">v{item.installed}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2.5 pl-4 border-l border-line">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-blue-800 flex items-center justify-center text-sm font-semibold text-white shadow-sm">CS</div>
            <div className="hidden lg:block leading-tight">
              <p className="text-sm text-slate-200 font-medium">Chavindu Sachintha</p>
              <p className="text-[11px] text-slate-500">Release Administrator</p>
            </div>
          </div>
        </div>
      </header>

      {/* Machine Details Popup Modal */}
      {selectedMachine && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 fade-in">
          <div className="bg-card border border-line rounded-xl w-full max-w-lg shadow-2xl overflow-hidden relative">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-line/60 flex items-center justify-between bg-base/40">
              <h3 className="font-display text-lg font-semibold text-white">Machine Details</h3>
              <button 
                onClick={() => setSelectedMachine(null)}
                className="text-slate-500 hover:text-white p-1 rounded-md transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              
              <div className="flex items-center justify-between bg-base/50 p-4 rounded-lg border border-line/50">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-500 font-medium mb-1">Machine ID</p>
                  <p className="text-xl font-mono font-semibold text-accent">{selectedMachine.machineId}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    selectedMachine.status?.toUpperCase() === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    selectedMachine.status?.toUpperCase() === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {selectedMachine.status || "UNKNOWN"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-base/30 p-3 rounded-lg border border-line/40">
                  <p className="text-xs text-slate-500 mb-0.5">Company</p>
                  <p className="text-sm font-medium text-white">{selectedMachine.company}</p>
                </div>
                <div className="bg-base/30 p-3 rounded-lg border border-line/40">
                  <p className="text-xs text-slate-500 mb-0.5">Branch</p>
                  <p className="text-sm font-medium text-white">{selectedMachine.branch}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-base/30 p-3 rounded-lg border border-line/40">
                  <p className="text-xs text-slate-500 mb-0.5">Installed Version</p>
                  <p className="text-base font-mono font-medium text-white">v{selectedMachine.installed}</p>
                </div>
                <div className="bg-base/30 p-3 rounded-lg border border-line/40">
                  <p className="text-xs text-slate-500 mb-0.5">Last Status Update</p>
                  <p className="text-sm font-medium text-slate-300">{selectedMachine.updatedAt}</p>
                </div>
              </div>

              {selectedMachine.errorMessage && selectedMachine.status?.toUpperCase() === 'FAILED' && (
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                  <p className="text-xs font-semibold text-red-400 mb-1">Error Details:</p>
                  <p className="text-xs text-red-300/80 font-mono leading-relaxed">{selectedMachine.errorMessage}</p>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}