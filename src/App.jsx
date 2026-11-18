import { useMemo, useState, useEffect } from "react";

// Auth Context
import { useAuth } from "./context/AuthContext";

// Layout & Reusable Modals
import MainLayout from "./components/layout/MainLayout";
import ErrorModal from "./components/modals/ErrorModal";
import ActiveReleaseModal from "./components/modals/ActiveReleaseModal";

// Modular Pages
import OverviewPage from "./pages/OverviewPage";
import ReleaseManagerPage from "./pages/ReleaseManagerPage";
import TargetReleasePage from "./pages/TargetReleasePage";
import DeploymentMonitorPage from "./pages/DeploymentMonitorPage";
import UpdateLogsPage from "./pages/UpdateLogsPage";
import MasterSettingsPage from "./pages/MasterSettingsPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

// Centralized API Service
import { dashboardApi } from "./services/api";

export default function App() {
  const { isAuthenticated, logout } = useAuth();

  // "login" | "signup"
  const [authView, setAuthView] = useState("login");

  const [view, setView] = useState("overview");

  const [versions, setVersions] = useState([]);
  const [monitorData, setMonitorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorRow, setErrorRow] = useState(null);
  const [showActiveDetails, setShowActiveDetails] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  async function fetchDashboardData() {
    setLoading(true);
    try {
      const response = await dashboardApi.getAllVersions();

      if (response && response.status === "success" && Array.isArray(response.data)) {
        const formattedVersions = response.data.map((ver, index) => ({
          versionId: ver.versionId,
          versionNumber: ver.versionNumber,
          systemType: ver.systemType || "General POS",
          releaseNotes: ver.releaseNotes || "No release notes provided.",
          fileName: ver.fileUrl ? ver.fileUrl.split("/").pop() : "Package.zip",
          createdDate: ver.createdDate,
          status: index === 0 ? "Active" : "Archived",
        }));

        setVersions(formattedVersions);
      } else {
        setVersions([]);
      }
    } catch (error) {
      console.error("Error fetching dashboard versions:", error);
    } finally {
      setLoading(false);
    }
  }

  const stats = useMemo(() => {
    const updated = monitorData.filter((r) => r.status === "SUCCESS").length;
    const pending = monitorData.filter((r) => r.status === "PENDING").length;
    const failed = monitorData.filter((r) => r.status === "FAILED").length;
    const total = monitorData.length;
    return {
      updated,
      pending,
      failed,
      total,
      pct: total ? Math.round((updated / total) * 1000) / 10 : 0,
    };
  }, [monitorData]);

  const activeVersion = versions.find((v) => v.status === "Active");

  // Handle Publish ZIP Package Build
  async function handlePublish(formDataObj) {
    try {
      if (!formDataObj.file) {
        alert("Please select a ZIP file to upload.");
        return;
      }

      if (!formDataObj.versionNumber) {
        alert("Please enter a version number.");
        return;
      }

      const formData = new FormData();
      formData.append("versionNumber", formDataObj.versionNumber);
      formData.append("releaseNotes", formDataObj.releaseNotes || "");
      formData.append(
        "systemType",
        formDataObj.systemTypeId || formDataObj.systemType || "1"
      );
      formData.append("zipFile", formDataObj.file);

      const response = await dashboardApi.uploadRelease(formData);

      if (response && response.status === "success") {
        alert("Release uploaded and published successfully!");
        fetchDashboardData();
        setView("overview");
      } else {
        alert("Failed to upload: " + (response?.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Publish Error:", error);
      const errorMsg =
        error.response?.data?.message ||
        "Error uploading release. Check browser console for details.";
      alert("Upload Error: " + errorMsg);
    }
  }

  // Handle Target Assignment Confirmation
  async function handleTargetPublish(targetData) {
    fetchDashboardData();
    setView("monitor");
  }

  // Handle Deleting a Release
  async function handleDeleteRelease(versionId) {
    setVersions((prev) => prev.filter((v) => v.versionId !== versionId));
  }

  // Handle Logout
  const handleLogout = () => {
    logout();
  };

  // Auth Guard — show login or signup when not authenticated
  if (!isAuthenticated) {
    if (authView === "signup") {
      return <SignupPage onSwitchToLogin={() => setAuthView("login")} />;
    }
    return <LoginPage onSwitchToSignup={() => setAuthView("signup")} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted bg-base font-display transition-colors duration-200">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-3 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium tracking-wide">
            Connecting to POS UpdateHub Services...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MainLayout view={view} setView={setView} onLogout={handleLogout}>
        {view === "overview" && (
          <OverviewPage
            versions={versions}
            stats={stats}
            setView={setView}
            onOpenActiveDetails={() => setShowActiveDetails(true)}
          />
        )}
        {view === "release" && (
          <ReleaseManagerPage
            versions={versions}
            onPublish={handlePublish}
            onDeleteRelease={handleDeleteRelease}
          />
        )}
        {view === "publish" && (
          <TargetReleasePage
            versions={versions}
            onPublish={handleTargetPublish}
          />
        )}
        {view === "monitor" && (
          <DeploymentMonitorPage
            data={monitorData}
            onViewError={setErrorRow}
          />
        )}
        {view === "logs" && (
          <UpdateLogsPage
            data={monitorData}
            onViewError={setErrorRow}
          />
        )}
        {view === "master_settings" && <MasterSettingsPage />}
      </MainLayout>

      {/* Global Modals */}
      <ErrorModal row={errorRow} onClose={() => setErrorRow(null)} />
      {showActiveDetails && (
        <ActiveReleaseModal
          version={activeVersion}
          monitorData={monitorData}
          onClose={() => setShowActiveDetails(false)}
        />
      )}
    </>
  );
}
