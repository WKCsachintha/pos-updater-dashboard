import { useMemo, useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Overview from "./components/Overview";
import ReleaseManager from "./components/ReleaseManager";
import DeploymentMonitor from "./components/DeploymentMonitor";
import UpdateLogs from "./components/UpdateLogs";
import ErrorModal from "./components/ErrorModal";
import ActiveReleaseModal from "./components/ActiveReleaseModal";
import TargetReleasePage from "./components/TargetReleasePage";
import axios from "axios";

const API_BASE = "http://demo.onlineserp.com/serp_dev/app/integration/poss_new/exe_realese.php";

export default function App() {
  const [view, setView] = useState("overview");
  const [versions, setVersions] = useState([]);
  const [monitorData, setMonitorData] = useState([]);
  const [errorRow, setErrorRow] = useState(null);
  const [showActiveDetails, setShowActiveDetails] = useState(false);
 
  // 1. ඇප් එක Load වන විට සැබෑ API එකෙන් දත්ත ලබා ගැනීම (Fetch Data)
  useEffect(() => {
    fetchRealData();
  }, []);

  async function fetchRealData() {
    try {
      // මෙහිදී ඔබේ backend/database එකෙන් versions සහ monitor දත්ත ලබාගැනීමට අදාළ API call එක දෙන්න.
      // උදාහරණයක් ලෙස get_version හෝ custom endpoint එකක් භාවිත කළ හැක.
      const response = await fetch(`${API_BASE}?action=get_version`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company_name: "delmo", branch_index: 1, app_version: "1.0.2" })
      });
      const result = await response.json();
      
      // API එකෙන් ලැබෙන ප්‍රතිඵල අනුව state එක update කිරීම
      if (result && result.data) {
        // උදාහරණ formatted data structure එකක් ලබා දීම
        setVersions([
          {
            versionId: 1,
            versionNumber: result.data.Version_NO || "1.0.2",
            systemType: "Supermarket POS",
            releaseNotes: result.message || "Active release from server",
            createdDate: new Date().toISOString().slice(0, 10),
            status: "Active",
            releases: [{ releaseId: 1, companyName: "delmo", branchName: "Colombo", isMandatory: true }]
          }
        ]);
      }
    } catch (error) {
      console.error("API connection error:", error);
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

  // 2. අලුත් Release එකක් Publish කළ විට API එකට යැවීම
  async function handlePublish(newReleaseData) {
    try {
      const response = await fetch(`${API_BASE}?action=update_logs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: newReleaseData.company || "delmo",
          branch_index: 1,
          app_version: newReleaseData.versionNumber || newReleaseData.releaseName,
          status: "success"
        }),
      });

      const result = await response.json();
      if (result.status === "success") {
        fetchRealData(); // දත්ත යාවත්කාලීන වූ පසු නැවත fetch කරයි
        setView("release");
      }
    } catch (error) {
      console.error("Error publishing via API:", error);
    }
  }

  async function handlePublish(formDataObj) {
    try {
      const formData = new FormData();
      formData.append("versionNumber", formDataObj.versionNumber);
      formData.append("releaseNotes", formDataObj.releaseNotes || "");
      formData.append("companyName", "ALL"); // අවශ්‍ය නම් මෙතැනට Company නමක් දෙන්න පුළුවන්
      formData.append("branchName", "ALL");
      formData.append("isMandatory", 0);
      
      if (formDataObj.file) {
        formData.append("zipFile", formDataObj.file);
      }

      console.log("Uploading file...", formDataObj.file.name);

      const response = await axios.post(`${"http://demo.onlineserp.com/serp_dev/app/integration/poss_new/exe_realese.php"}?action=upload_release`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Upload Response:", response.data);

      if (response.data.status === "success") {
        alert("Release uploaded and published successfully!");
        fetchDashboardData();
        setView("release");
      } else {
        alert("Failed to publish: " + (response.data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Publish Error:", error);
      alert("Error uploading release. Check console (F12) for details.");
    }
  }

  // 3. Target Release Page එකෙන් submit වන විට
  async function handleTargetPublish(targetData) {
    await handlePublish(targetData);
  }

  // 4. Release එකක් Delete කිරීම
  async function handleDeleteRelease(versionId) {
    setVersions((prev) => prev.filter((v) => v.versionId !== versionId));
  }

  return (
    <div className="flex min-h-screen font-body text-slate-200 antialiased">
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
            <TargetReleasePage onPublish={handleTargetPublish} />
          )}
          {view === "monitor" && <DeploymentMonitor data={monitorData} onViewError={setErrorRow} />}
          {view === "logs" && <UpdateLogs data={monitorData} onViewError={setErrorRow} />}
        </main>
      </div>

      <ErrorModal row={errorRow} onClose={() => setErrorRow(null)} />
      {showActiveDetails && (
        <ActiveReleaseModal version={activeVersion} monitorData={monitorData} onClose={() => setShowActiveDetails(false)} />
      )}
    </div>
  );
}