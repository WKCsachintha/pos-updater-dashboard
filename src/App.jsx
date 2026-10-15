

import { useMemo, useState, useEffect } from "react";
import axios from "axios";

// Components
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Overview from "./components/Overview";
import ReleaseManager from "./components/ReleaseManager";
import DeploymentMonitor from "./components/DeploymentMonitor";
import UpdateLogs from "./components/UpdateLogs";
import ErrorModal from "./components/ErrorModal";
import ActiveReleaseModal from "./components/ActiveReleaseModal";
import TargetReleasePage from "./components/TargetReleasePage";
import MasterSettingsPage from "./components/MasterSettingsPage";
import LoginPage from "./components/LoginPage";

// Backend API URL
const API_BASE = "https://demo.onlineserp.com/serp/app/integration/poss_new/exe_realese.php";

export default function App() {
  // Login Status එක SessionStorage මඟින් පාලනය කිරීම
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("pos_auth") === "true";
  });

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
      const response = await axios.get(`${API_BASE}?action=get_all_versions`);

      if (response.data.status === "success" && response.data.data) {
        const formattedVersions = response.data.data.map((ver, index) => ({
          versionId: ver.versionId,
          versionNumber: ver.versionNumber,
          systemType: ver.systemType || "General POS",
          releaseNotes: ver.releaseNotes || "No release notes provided.",
          fileName: ver.fileUrl ? ver.fileUrl.split('/').pop() : "Package.zip",
          createdDate: ver.createdDate,
          status: index === 0 ? "Active" : "Archived"
        }));

        setVersions(formattedVersions);
      } else {
        setVersions([]);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }

  const stats = useMemo(() => {
    const updated = monitorData.filter((r) => r.status === "SUCCESS").length;
    const pending = monitorData.filter((r) => r.status === "PENDING").length;
    const failed = monitorData.filter((r) => r.status === "FAILED").length;
    const total = monitorData.length;
    return { updated, pending, failed, total, pct: total ? Math.round((updated / total) * 1000) / 10 : 0 };
  }, [monitorData]);

  const activeVersion = versions.find((v) => v.status === "Active");

  // 1. Release Manager එකෙන් ZIP Upload කිරීම
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
      formData.append("systemType", formDataObj.systemTypeId || formDataObj.systemType || "1");
      formData.append("zipFile", formDataObj.file);

      console.log("Uploading package...", formDataObj.file.name);

      const response = await axios.post(
        `${API_BASE}?action=upload_release`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload Response:", response.data);

      if (response.data && response.data.status === "success") {
        alert("Release uploaded and published successfully!");
        if (typeof fetchDashboardData === "function") fetchDashboardData();
        if (typeof setView === "function") setView("overview");
      } else {
        alert("Failed to upload: " + (response.data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Publish Error:", error);
      const errorMsg = error.response?.data?.message || "Error uploading release. Check console for details.";
      alert("Upload Error: " + errorMsg);
    }
  }

  // 2. Target Release Page එකෙන් Target Assign කිරීම (handleTargetPublish එක දැන් මෙහි නිවැරදිව ඇත)
  async function handleTargetPublish(targetData) {
  console.log("Target successfully published from child component:", targetData);
    
    // API Call එක TargetReleasePage එකෙන් දැනටමත් කර ඇති නිසා, මෙතනින් කරන්නේ Dashboard ඩේටා අලුත් කර View එක Monitor එකට මාරු කිරීම පමණි.
    fetchDashboardData();
    setView("monitor");
  }

  async function handleDeleteRelease(versionId) {
    setVersions((prev) => prev.filter((v) => v.versionId !== versionId));
  }

  // Auth Guard: Login වී නැත්නම් LoginPage එක පෙන්වීම
  if (!isAuthenticated) {
    return (
      <LoginPage
        onLoginSuccess={() => {
          sessionStorage.setItem("pos_auth", "true");
          setIsAuthenticated(true);
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 bg-[#0f172a] font-display">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p>Connecting to Database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen font-body text-slate-200 antialiased bg-[#0f172a]">
      <Sidebar view={view} setView={setView} />

      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Header view={view} />

        <main className="flex-1 p-6">
          {view === "overview" && (
            <Overview versions={versions} stats={stats} setView={setView} onOpenActiveDetails={() => setShowActiveDetails(true)} />
          )}
          {view === "release" && (
            <ReleaseManager
              versions={versions}
              onPublish={handlePublish}
              onDeleteRelease={handleDeleteRelease}
            />
          )}
          {view === "publish" && (
            <TargetReleasePage versions={versions} onPublish={handleTargetPublish} />
          )}
          {view === "monitor" && <DeploymentMonitor data={monitorData} onViewError={setErrorRow} />}
          {view === "logs" && <UpdateLogs data={monitorData} onViewError={setErrorRow} />}
          {view === "master_settings" && <MasterSettingsPage />}
        </main>
      </div>

      <ErrorModal row={errorRow} onClose={() => setErrorRow(null)} />
      {showActiveDetails && (
        <ActiveReleaseModal version={activeVersion} monitorData={monitorData} onClose={() => setShowActiveDetails(false)} />
      )}
    </div>
  );
}