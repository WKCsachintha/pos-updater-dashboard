// import { useState, useEffect, useRef } from "react";
// import ThemeToggle from "../common/ThemeToggle";
// import MachineDetailsModal from "../modals/MachineDetailsModal";
// import { deploymentApi } from "../../services/api";

// const TITLES = {
//   overview: ["Dashboard Overview", "Real-time telemetry and version status across all deployments"],
//   release: ["Release Manager", "Upload new package builds and manage registered versions"],
//   publish: ["Target Release", "Configure target parameters and push builds to terminals"],
//   monitor: ["Deployment Monitor", "Live heartbeat, client machines, and installation audit"],
//   logs: ["Update Logs", "Historical event audit trail from POS ClientUpdateLogs"],
//   master_settings: ["Master Data Settings", "Configure release categories, companies, branches, and terminals"],
// };

// export default function Header({ view }) {
//   const [title, subtitle] = TITLES[view] || ["Console", "POS Deployment System"];

//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [isSearching, setIsSearching] = useState(false);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [selectedMachine, setSelectedMachine] = useState(null);
//   const searchRef = useRef(null);

//   // Debounced search over live deployments
//   useEffect(() => {
//     const delayDebounce = setTimeout(async () => {
//       if (!searchQuery.trim()) {
//         setSearchResults([]);
//         setShowDropdown(false);
//         return;
//       }

//       setIsSearching(true);
//       setShowDropdown(true);

//       try {
//         const response = await deploymentApi.getDeployments();

//         if (response && response.status === "success" && Array.isArray(response.data)) {
//           const q = searchQuery.toLowerCase();
//           const filtered = response.data.filter(
//             (item) =>
//               (item.machineId && item.machineId.toLowerCase().includes(q)) ||
//               (item.company && item.company.toLowerCase().includes(q)) ||
//               (item.branch && String(item.branch).toLowerCase().includes(q))
//           );
//           setSearchResults(filtered);
//         } else {
//           setSearchResults([]);
//         }
//       } catch (error) {
//         console.error("Search error in Header:", error);
//         setSearchResults([]);
//       } finally {
//         setIsSearching(false);
//       }
//     }, 350);

//     return () => clearTimeout(delayDebounce);
//   }, [searchQuery]);

//   // Click outside listener for dropdown
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (searchRef.current && !searchRef.current.contains(event.target)) {
//         setShowDropdown(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <>
//       <header className="h-16 border-b border-line bg-card/85 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6 shrink-0 transition-colors duration-200">
//         <div>
//           <h1 className="font-display font-bold text-heading text-lg leading-tight tracking-tight">
//             {title}
//           </h1>
//           <p className="text-xs text-muted font-normal mt-0.5">{subtitle}</p>
//         </div>

//         <div className="flex items-center gap-3.5">
//           {/* Live Search Container */}
//           <div className="relative hidden md:block" ref={searchRef}>
//             <svg
//               className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="m21 21-4.35-4.35M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
//               />
//             </svg>
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               onFocus={() => {
//                 if (searchQuery.trim()) setShowDropdown(true);
//               }}
//               placeholder="Search machine ID, company, branch…"
//               className="w-72 bg-base border border-line rounded-xl pl-9 pr-8 py-2 text-xs text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
//             />

//             {/* Spinner */}
//             {isSearching && (
//               <div className="absolute right-3 top-1/2 -translate-y-1/2">
//                 <div className="w-3.5 h-3.5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
//               </div>
//             )}

//             {/* Search Dropdown */}
//             {showDropdown && (
//               <div className="absolute top-full right-0 mt-2 w-[420px] bg-card border border-line rounded-xl shadow-2xl overflow-hidden z-50 fade-in">
//                 <div className="p-2.5 border-b border-line bg-base/50 text-[10px] uppercase font-bold text-muted tracking-wider flex items-center justify-between">
//                   <span>Search Results</span>
//                   <span className="font-mono text-[10px]">{searchResults.length} matches</span>
//                 </div>

//                 <div className="max-h-[340px] overflow-y-auto custom-scrollbar divide-y divide-line">
//                   {searchResults.length === 0 && !isSearching ? (
//                     <div className="p-6 text-center text-xs text-muted">
//                       No matching registered machines found.
//                     </div>
//                   ) : (
//                     searchResults.map((item, idx) => (
//                       <div
//                         key={item.machineId || idx}
//                         onClick={() => {
//                           setSelectedMachine(item);
//                           setShowDropdown(false);
//                           setSearchQuery("");
//                         }}
//                         className="p-3 hover:bg-cardhover cursor-pointer transition-colors flex items-center justify-between"
//                       >
//                         <div>
//                           <p className="text-xs font-bold text-heading font-mono">
//                             {item.machineId}
//                           </p>
//                           <p className="text-[11px] text-muted mt-0.5">
//                             {item.company} <span className="text-muted/60 px-1">•</span> Branch #{item.branch}
//                           </p>
//                         </div>
//                         <div className="text-right">
//                           <span
//                             className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
//                               item.status?.toUpperCase() === "SUCCESS"
//                                 ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
//                                 : item.status?.toUpperCase() === "PENDING"
//                                 ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
//                                 : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
//                             }`}
//                           >
//                             {item.status || "UNKNOWN"}
//                           </span>
//                           <p className="text-[10px] text-muted mt-1 font-mono">
//                             v{item.installed}
//                           </p>
//                         </div>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Theme Switcher Button */}
//           <ThemeToggle />

//           {/* User Profile Pill */}
//           <div className="flex items-center gap-2.5 pl-3 border-l border-line">
//             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-blue-800 flex items-center justify-center text-xs font-bold text-white shadow-xs">
//               CS
//             </div>
//             <div className="hidden lg:block leading-tight">
//               <p className="text-xs text-heading font-semibold">Chavindu Sachintha</p>
//               <p className="text-[10px] text-muted">Release Admin</p>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Machine Details Modal */}
//       {selectedMachine && (
//         <MachineDetailsModal
//           machine={selectedMachine}
//           onClose={() => setSelectedMachine(null)}
//         />
//       )}
//     </>
//   );
// }


import { useState, useEffect, useRef } from "react";
import ThemeToggle from "../common/ThemeToggle";
import MachineDetailsModal from "../modals/MachineDetailsModal";
import { deploymentApi } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const TITLES = {
  overview: ["Dashboard Overview", "Real-time telemetry and version status across all deployments"],
  release: ["Release Manager", "Upload new package builds and manage registered versions"],
  publish: ["Target Release", "Configure target parameters and push builds to terminals"],
  monitor: ["Deployment Monitor", "Live heartbeat, client machines, and installation audit"],
  logs: ["Update Logs", "Historical event audit trail from POS ClientUpdateLogs"],
  master_settings: ["Master Data Settings", "Configure release categories, companies, branches, and terminals"],
};

// User Type අංකය අනුව Role නම ලබාගැනීමේ Helper
function getRoleName(userType) {
  switch (userType) {
    case 1: return "Super Admin";
    case 2: return "Administrator";
    case 3: return "Operator";
    case 4: return "Viewer";
    default: return "User";
  }
}

// නමේ මුලකුරු දෙක ලබාගැනීමේ Helper (Avatar එක සඳහා)
function getInitials(fullName) {
  if (!fullName) return "U";
  const parts = fullName.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return fullName.substring(0, 2).toUpperCase();
}

export default function Header({ view }) {
  const [title, subtitle] = TITLES[view] || ["Console", "POS Deployment System"];

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const searchRef = useRef(null);

  // 💡 AuthContext මඟින් ගතිකව පරිශීලක දත්ත ලබා ගැනීම
  const { user } = useAuth();
  
  const userName = user?.full_name || "Guest User";
  const userRole = getRoleName(user?.user_type);
  const initials = getInitials(userName);

  // Live Deployments ඔස්සේ Search කිරීම සඳහා Debounced Logic
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
        const response = await deploymentApi.getDeployments();

        if (response && response.status === "success" && Array.isArray(response.data)) {
          const q = searchQuery.toLowerCase();
          const filtered = response.data.filter(
            (item) =>
              (item.machineId && item.machineId.toLowerCase().includes(q)) ||
              (item.company && item.company.toLowerCase().includes(q)) ||
              (item.branch && String(item.branch).toLowerCase().includes(q))
          );
          setSearchResults(filtered);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Search error in Header:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Dropdown එකෙන් පිටත Click කළ විට එය වැසීම (Click Outside Listener)
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
      <header className="h-16 border-b border-line bg-card/85 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6 shrink-0 transition-colors duration-200">
        <div>
          <h1 className="font-display font-bold text-heading text-lg leading-tight tracking-tight">
            {title}
          </h1>
          <p className="text-xs text-muted font-normal mt-0.5">{subtitle}</p>
        </div>

        <div className="flex items-center gap-3.5">
          {/* Live Search Container */}
          <div className="relative hidden md:block" ref={searchRef}>
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchQuery.trim()) setShowDropdown(true);
              }}
              placeholder="Search machine ID, company, branch…"
              className="w-72 bg-base border border-line rounded-xl pl-9 pr-8 py-2 text-xs text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
            />

            {/* Spinner */}
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-3.5 h-3.5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* Search Dropdown */}
            {showDropdown && (
              <div className="absolute top-full right-0 mt-2 w-[420px] bg-card border border-line rounded-xl shadow-2xl overflow-hidden z-50 fade-in">
                <div className="p-2.5 border-b border-line bg-base/50 text-[10px] uppercase font-bold text-muted tracking-wider flex items-center justify-between">
                  <span>Search Results</span>
                  <span className="font-mono text-[10px]">{searchResults.length} matches</span>
                </div>

                <div className="max-h-[340px] overflow-y-auto custom-scrollbar divide-y divide-line">
                  {searchResults.length === 0 && !isSearching ? (
                    <div className="p-6 text-center text-xs text-muted">
                      No matching registered machines found.
                    </div>
                  ) : (
                    searchResults.map((item, idx) => (
                      <div
                        key={item.machineId || idx}
                        onClick={() => {
                          setSelectedMachine(item);
                          setShowDropdown(false);
                          setSearchQuery("");
                        }}
                        className="p-3 hover:bg-cardhover cursor-pointer transition-colors flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold text-heading font-mono">
                            {item.machineId}
                          </p>
                          <p className="text-[11px] text-muted mt-0.5">
                            {item.company} <span className="text-muted/60 px-1">•</span> Branch #{item.branch}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                              item.status?.toUpperCase() === "SUCCESS"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                : item.status?.toUpperCase() === "PENDING"
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                            }`}
                          >
                            {item.status || "UNKNOWN"}
                          </span>
                          <p className="text-[10px] text-muted mt-1 font-mono">
                            v{item.installed}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme Switcher Button */}
          <ThemeToggle />

          {/* 💡 User Profile Pill - ගතිකව දත්ත යාවත්කාලීන වේ */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-line">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-blue-800 flex items-center justify-center text-xs font-bold text-white shadow-xs">
              {initials}
            </div>
            <div className="hidden lg:block leading-tight">
              <p className="text-xs text-heading font-semibold">{userName}</p>
              <p className="text-[10px] text-muted">{userRole}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Machine Details Modal */}
      {selectedMachine && (
        <MachineDetailsModal
          machine={selectedMachine}
          onClose={() => setSelectedMachine(null)}
        />
      )}
    </>
  );
}