import { useMemo, useState, useEffect } from "react";
import RolloutDonutChart from "../components/charts/RolloutDonutChart";
import { dashboardApi } from "../services/api";

export default function OverviewPage({ versions = [], onOpenActiveDetails, setView }) {
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({ updated: 0, pending: 0, failed: 0, total: 0, pct: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  async function fetchDashboardStats() {
    setLoading(true);
    try {
      const response = await dashboardApi.getDashboardStats();
      if (response && response.status === "success") {
        setCategories(response.categories || []);
        setStats(response.stats || { updated: 0, pending: 0, failed: 0, total: 0, pct: 0 });
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  }

  // Count active unique categories
  const activeSystemsCount = useMemo(() => {
    const activeCats = new Set();
    versions.forEach((v) => {
      if (v.systemType) {
        activeCats.add(v.systemType);
      }
    });
    return activeCats.size;
  }, [versions]);

  // Find latest active version per category
  const latestCategoryVersions = useMemo(() => {
    return categories.map((category) => {
      const match = versions.find((v) => v.systemType === category);
      return {
        category,
        versionNumber: match ? match.versionNumber : "N/A",
        status: match ? "Active" : "Inactive",
      };
    });
  }, [versions, categories]);

  return (
    <section className="space-y-6 fade-in">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* 1. Active System Categories Count */}
        <button
          onClick={onOpenActiveDetails}
          className="text-left bg-card border border-line rounded-xl p-5 hover:border-accent/50 hover:shadow-md transition-all duration-200 cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-muted">Active System Categories</p>
              <p className="font-display text-3xl font-bold text-heading mt-2">
                {activeSystemsCount}{" "}
                <span className="text-sm font-normal text-muted">
                  / {categories.length || 0}
                </span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:scale-105 transition-transform">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0C20.25 4.097 16.556 2.25 12 2.25S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-accent mt-3 flex items-center gap-1 font-medium">
            View active package breakdown →
          </p>
        </button>

        {/* 2. Fully Updated Terminals */}
        <div className="bg-card border border-line rounded-xl p-5 shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-muted">Fully Updated Terminals</p>
              <p className="font-display text-3xl font-bold text-heading mt-2">
                {stats.updated}{" "}
                <span className="text-sm font-normal text-muted">/ {stats.total}</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-muted mt-3">
            Overall Terminals on latest builds ({stats.pct}%)
          </p>
        </div>

        {/* 3. Pending / Outdated */}
        <div className="bg-card border border-line rounded-xl p-5 shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-muted">Pending / Outdated</p>
              <p className="font-display text-3xl font-bold text-heading mt-2">
                {stats.pending}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-muted mt-3">Awaiting sync or update cycle</p>
        </div>

        {/* 4. Failed Updates */}
        <div className="bg-card border border-line rounded-xl p-5 shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-muted">Failed Updates</p>
              <p className="font-display text-3xl font-bold text-heading mt-2">
                {stats.failed}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-600 dark:text-red-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-muted mt-3">Client reported errors today</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Rollout Status Donut Chart Component */}
        <div className="xl:col-span-2">
          <RolloutDonutChart stats={stats} />
        </div>

        {/* System Category Active Versions Card */}
        <div className="bg-card border border-line rounded-xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-display font-semibold text-heading text-base mb-1">
              Active Category Releases
            </h3>
            <p className="text-xs text-muted mb-4">
              Registered versions assigned across systems
            </p>

            <div className="space-y-3">
              {categories.length === 0 ? (
                <p className="text-xs text-muted py-6 text-center">
                  No categories registered in Master Settings.
                </p>
              ) : (
                latestCategoryVersions.map((item) => (
                  <div
                    key={item.category}
                    className="flex items-center justify-between text-sm py-2 border-b border-line/60 last:border-0"
                  >
                    <div>
                      <p className="text-heading text-xs font-semibold">{item.category}</p>
                      <p className="text-[11px] text-muted font-mono">
                        {item.versionNumber !== "N/A"
                          ? `v${item.versionNumber}`
                          : "No Active Build"}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium border ${
                        item.status === "Active"
                          ? "bg-accent/10 text-accent border-accent/20"
                          : "bg-base text-muted border-line"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => setView("publish")}
            className="w-full mt-5 pt-3 border-t border-line text-xs font-semibold text-accent hover:text-accentdeep text-left flex items-center justify-between group cursor-pointer"
          >
            <span>Assign target build parameters</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}

