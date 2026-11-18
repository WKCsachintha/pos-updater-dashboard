import Sidebar from "./Sidebar";
import Header from "./Header";

export default function MainLayout({ view, setView, onLogout, children }) {
  return (
    <div className="flex min-h-screen font-body text-bodytext antialiased bg-base transition-colors duration-200">
      {/* Fixed Left Navigation Panel */}
      <Sidebar view={view} setView={setView} onLogout={onLogout} />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Sticky Top Header */}
        <Header view={view} />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

