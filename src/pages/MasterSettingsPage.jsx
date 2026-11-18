import { useState, useEffect } from "react";
import Button from "../components/common/Button";
import { masterApi } from "../services/api";

export default function MasterSettingsPage() {
  const [activeTab, setActiveTab] = useState("categories");
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    display_name: "",
    folder_name: "",
    company_name: "",
    company_display_name: "",
    branch_name: "",
    branch_code: "",
    company_index: "",
    terminal_number: "",
    branch_index: "",
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

  // Fetch data for the active tab
  async function fetchTabData() {
    setLoading(true);
    try {
      let actionName = "";
      if (activeTab === "categories") actionName = "get_all_release_categories";
      else if (activeTab === "companies") actionName = "get_all_companies";
      else if (activeTab === "branches") actionName = "get_all_branches";
      else if (activeTab === "terminals") actionName = "get_all_terminals";

      let res;
      if (activeTab === "categories") res = await masterApi.getCategories();
      else if (activeTab === "companies") res = await masterApi.getCompanies();
      else if (activeTab === "branches") res = await masterApi.getBranches();
      else if (activeTab === "terminals") res = await masterApi.getTerminals();

      if (res && res.status === "success") {
        setDataList(res.data || []);
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
      const res = await masterApi.getCompanies();
      if (res && res.status === "success") setCompaniesList(res.data || []);
    } catch (err) {
      console.error("Error fetching companies:", err);
    }
  }

  async function fetchBranches() {
    try {
      const res = await masterApi.getBranches();
      if (res && res.status === "success") setBranchesList(res.data || []);
    } catch (err) {
      console.error("Error fetching branches:", err);
    }
  }

  // Toggle Status (Active / Inactive)
  async function handleToggleActive(indexField, indexVal, currentStatus) {
    try {
      let actionName = "";
      if (activeTab === "categories") actionName = "toggle_release_category_active";
      else if (activeTab === "companies") actionName = "toggle_company_active";
      else if (activeTab === "branches") actionName = "toggle_branch_active";
      else if (activeTab === "terminals") actionName = "toggle_terminal_active";

      const payload = {
        [indexField]: parseInt(indexVal, 10),
        is_active: currentStatus ? 0 : 1,
      };

      const res = await masterApi.toggleStatus(actionName, payload);
      if (res && res.status === "success") {
        fetchTabData();
      } else {
        alert("Failed to update status: " + (res?.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Toggle error:", err);
    }
  }

  // Add New Record
  async function handleAddNew(e) {
    e.preventDefault();
    e.stopPropagation();

    if (submitting) return;

    let actionName = "";
    let payload = {};

    if (activeTab === "categories") {
      if (!formData.display_name.trim() || !formData.folder_name.trim()) return;
      actionName = "add_release_category";
      payload = { display_name: formData.display_name.trim(), folder_name: formData.folder_name.trim() };
    } else if (activeTab === "companies") {
      if (!formData.company_name.trim() || !formData.company_display_name.trim()) return;
      actionName = "add_company";
      payload = {
        company_name: formData.company_name.trim(),
        company_display_name: formData.company_display_name.trim(),
      };
    } else if (activeTab === "branches") {
      if (!formData.branch_name.trim() || !formData.company_index) return;
      actionName = "add_branch";
      payload = {
        branch_name: formData.branch_name.trim(),
        branch_code: formData.branch_code.trim(),
        company_index: parseInt(formData.company_index, 10),
      };
    } else if (activeTab === "terminals") {
      if (!formData.company_index || !formData.branch_index || !formData.terminal_number) return;
      actionName = "add_terminal";
      payload = {
        company_index: parseInt(formData.company_index, 10),
        branch_index: parseInt(formData.branch_index, 10),
        terminal_number: parseInt(formData.terminal_number, 10),
      };
    }

    setSubmitting(true);

    try {
      const res = await masterApi.addRecord(actionName, payload);
      if (res && res.status === "success") {
        alert("Record added successfully!");
        setFormData({
          display_name: "",
          folder_name: "",
          company_name: "",
          company_display_name: "",
          branch_name: "",
          branch_code: "",
          company_index: "",
          terminal_number: "",
          branch_index: "",
        });
        fetchTabData();
      } else {
        alert("Error: " + (res?.message || "Failed to add record"));
      }
    } catch (err) {
      console.error("Add record error:", err);
      alert("Server error while adding record.");
    } finally {
      setSubmitting(false);
    }
  }

  // Filter Table Data dynamically based on dropdown selections
  let filteredDataList = dataList;

  if (activeTab === "branches" && formData.company_index) {
    filteredDataList = dataList.filter(
      (item) => String(item.company_index) === String(formData.company_index)
    );
  } else if (activeTab === "terminals") {
    if (formData.company_index) {
      filteredDataList = dataList.filter(
        (item) => String(item.company_index) === String(formData.company_index)
      );
    }
    if (formData.branch_index) {
      filteredDataList = filteredDataList.filter(
        (item) => String(item.branch_index) === String(formData.branch_index)
      );
    }
  }

  return (
    <section className="space-y-6 fade-in">
      {/* Top Banner and Navigation Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-card border border-line p-5 rounded-xl shadow-xs">
        <div>
          <h2 className="font-display font-semibold text-heading text-lg">
            Master Data Management
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Configure system categories, registered client companies, retail branches, and POS terminals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-base p-1.5 rounded-xl border border-line">
          {["categories", "companies", "branches", "terminals"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setFormData({
                  display_name: "",
                  folder_name: "",
                  company_name: "",
                  company_display_name: "",
                  branch_name: "",
                  branch_code: "",
                  company_index: "",
                  terminal_number: "",
                  branch_index: "",
                });
              }}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-accent text-white shadow-xs"
                  : "text-muted hover:text-heading hover:bg-cardhover"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Form to Add New Record */}
        <div className="bg-card border border-line p-6 rounded-xl shadow-xs h-fit space-y-4">
          <h3 className="font-display font-semibold text-heading text-base capitalize">
            Add New {activeTab.slice(0, -1)}
          </h3>

          <form onSubmit={handleAddNew} className="space-y-4">
            {activeTab === "categories" && (
              <>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">Display Name</label>
                  <input
                    type="text"
                    required
                    value={formData.display_name}
                    onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                    placeholder="e.g. Supermarket POS"
                    className="w-full bg-base border border-line rounded-xl px-3.5 py-2 text-xs text-heading focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">Folder Name</label>
                  <input
                    type="text"
                    required
                    value={formData.folder_name}
                    onChange={(e) => setFormData({ ...formData, folder_name: e.target.value })}
                    placeholder="e.g. supermarket_pos"
                    className="w-full bg-base border border-line rounded-xl px-3.5 py-2 text-xs text-heading font-mono focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
              </>
            )}

            {activeTab === "companies" && (
              <>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">Company Code / Key</label>
                  <input
                    type="text"
                    required
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    placeholder="e.g. delmo"
                    className="w-full bg-base border border-line rounded-xl px-3.5 py-2 text-xs text-heading font-mono focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">Company Display Name</label>
                  <input
                    type="text"
                    required
                    value={formData.company_display_name}
                    onChange={(e) => setFormData({ ...formData, company_display_name: e.target.value })}
                    placeholder="e.g. Delmo Foods"
                    className="w-full bg-base border border-line rounded-xl px-3.5 py-2 text-xs text-heading focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
              </>
            )}

            {activeTab === "branches" && (
              <>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">Select Company (Filters Table)</label>
                  <select
                    required
                    value={formData.company_index}
                    onChange={(e) => setFormData({ ...formData, company_index: e.target.value })}
                    className="w-full bg-base border border-line rounded-xl px-3.5 py-2 text-xs text-heading focus:outline-none focus:ring-2 focus:ring-accent/40"
                  >
                    <option value="">Select Company...</option>
                    {companiesList.map((c) => (
                      <option key={c.company_index} value={c.company_index}>
                        {c.company_display_name || c.company_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">Branch Name</label>
                  <input
                    type="text"
                    required
                    value={formData.branch_name}
                    onChange={(e) => setFormData({ ...formData, branch_name: e.target.value })}
                    placeholder="e.g. Colombo Branch"
                    className="w-full bg-base border border-line rounded-xl px-3.5 py-2 text-xs text-heading focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">Branch Code</label>
                  <input
                    type="text"
                    required
                    value={formData.branch_code}
                    onChange={(e) => setFormData({ ...formData, branch_code: e.target.value })}
                    placeholder="e.g. CMB"
                    className="w-full bg-base border border-line rounded-xl px-3.5 py-2 text-xs text-heading font-mono focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
              </>
            )}

            {activeTab === "terminals" && (
              <>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">Select Company</label>
                  <select
                    required
                    value={formData.company_index}
                    onChange={(e) =>
                      setFormData({ ...formData, company_index: e.target.value, branch_index: "" })
                    }
                    className="w-full bg-base border border-line rounded-xl px-3.5 py-2 text-xs text-heading focus:outline-none focus:ring-2 focus:ring-accent/40"
                  >
                    <option value="">Select Company...</option>
                    {companiesList.map((c) => (
                      <option key={c.company_index} value={c.company_index}>
                        {c.company_display_name || c.company_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">Select Branch</label>
                  <select
                    required
                    value={formData.branch_index}
                    onChange={(e) => setFormData({ ...formData, branch_index: e.target.value })}
                    className="w-full bg-base border border-line rounded-xl px-3.5 py-2 text-xs text-heading focus:outline-none focus:ring-2 focus:ring-accent/40"
                  >
                    <option value="">Select Branch...</option>
                    {branchesList
                      .filter(
                        (b) =>
                          !formData.company_index ||
                          String(b.company_index) === String(formData.company_index)
                      )
                      .map((b) => (
                        <option key={b.branch_index} value={b.branch_index}>
                          {b.branch_name} ({b.branch_code})
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">Terminal Number</label>
                  <input
                    type="number"
                    required
                    value={formData.terminal_number}
                    onChange={(e) => setFormData({ ...formData, terminal_number: e.target.value })}
                    placeholder="e.g. 1"
                    className="w-full bg-base border border-line rounded-xl px-3.5 py-2 text-xs text-heading font-mono focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
              </>
            )}

            <Button
              type="submit"
              disabled={submitting}
              loading={submitting}
              className="w-full mt-2"
            >
              Save Record
            </Button>
          </form>
        </div>

        {/* Table of Records */}
        <div className="xl:col-span-2 bg-card border border-line rounded-xl overflow-hidden shadow-xs flex flex-col">
          {loading ? (
            <div className="py-20 text-center text-muted text-xs flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              Loading {activeTab}...
            </div>
          ) : (
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-line bg-base/50 text-[11px] font-semibold text-muted uppercase tracking-wider">
                    {activeTab === "categories" && (
                      <>
                        <th className="p-3.5">Index</th>
                        <th className="p-3.5">Display Name</th>
                        <th className="p-3.5">Folder Name</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Action</th>
                      </>
                    )}
                    {activeTab === "companies" && (
                      <>
                        <th className="p-3.5">Index</th>
                        <th className="p-3.5">Company Key</th>
                        <th className="p-3.5">Display Name</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Action</th>
                      </>
                    )}
                    {activeTab === "branches" && (
                      <>
                        <th className="p-3.5">ID</th>
                        <th className="p-3.5">Branch Index</th>
                        <th className="p-3.5">Branch Name</th>
                        <th className="p-3.5">Code</th>
                        <th className="p-3.5">Company</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Action</th>
                      </>
                    )}
                    {activeTab === "terminals" && (
                      <>
                        <th className="p-3.5">Index</th>
                        <th className="p-3.5">Terminal ID</th>
                        <th className="p-3.5">Number</th>
                        <th className="p-3.5">Company / Branch</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Action</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line text-bodytext">
                  {filteredDataList.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-muted">
                        No records found for the selected filter.
                      </td>
                    </tr>
                  ) : (
                    filteredDataList.map((item, mapIndex) => {
                      const fieldKey =
                        activeTab === "categories"
                          ? "category_index"
                          : activeTab === "companies"
                          ? "company_index"
                          : activeTab === "branches"
                          ? "branch_index"
                          : "terminal_index";

                      const idx = item[fieldKey] || mapIndex;

                      return (
                        <tr
                          key={`${activeTab}-${idx}`}
                          className="hover:bg-cardhover/50 transition-colors"
                        >
                          {activeTab === "categories" && (
                            <>
                              <td className="p-3.5 font-mono text-muted">#{item.category_index}</td>
                              <td className="p-3.5 font-semibold text-heading">{item.display_name}</td>
                              <td className="p-3.5 font-mono text-muted">{item.folder_name}</td>
                              <td className="p-3.5">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                                    item.is_active
                                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                      : "bg-base text-muted border-line"
                                  }`}
                                >
                                  {item.is_active ? "Active" : "Inactive"}
                                </span>
                              </td>
                              <td className="p-3.5 text-right">
                                <button
                                  onClick={() => handleToggleActive(fieldKey, idx, item.is_active)}
                                  className="px-2.5 py-1 bg-base border border-line rounded-lg text-[11px] font-medium text-bodytext hover:text-heading hover:border-accent transition-colors cursor-pointer"
                                >
                                  {item.is_active ? "Deactivate" : "Activate"}
                                </button>
                              </td>
                            </>
                          )}

                          {activeTab === "companies" && (
                            <>
                              <td className="p-3.5 font-mono text-muted">#{item.company_index}</td>
                              <td className="p-3.5 font-semibold text-heading font-mono">{item.company_name}</td>
                              <td className="p-3.5 text-bodytext">{item.company_display_name}</td>
                              <td className="p-3.5">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                                    item.is_active
                                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                      : "bg-base text-muted border-line"
                                  }`}
                                >
                                  {item.is_active ? "Active" : "Inactive"}
                                </span>
                              </td>
                              <td className="p-3.5 text-right">
                                <button
                                  onClick={() => handleToggleActive(fieldKey, idx, item.is_active)}
                                  className="px-2.5 py-1 bg-base border border-line rounded-lg text-[11px] font-medium text-bodytext hover:text-heading hover:border-accent transition-colors cursor-pointer"
                                >
                                  {item.is_active ? "Deactivate" : "Activate"}
                                </button>
                              </td>
                            </>
                          )}

                          {activeTab === "branches" && (
                            <>
                              <td className="p-3.5 font-mono text-muted">#{item.index}</td>
                              <td className="p-3.5 font-mono text-muted">{item.branch_index}</td>
                              <td className="p-3.5 font-semibold text-heading">{item.branch_name}</td>
                              <td className="p-3.5 font-mono text-muted">{item.branch_code}</td>
                              <td className="p-3.5 font-mono text-muted">C: #{item.company_index}</td>
                              <td className="p-3.5">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                                    item.is_active
                                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                      : "bg-base text-muted border-line"
                                  }`}
                                >
                                  {item.is_active ? "Active" : "Inactive"}
                                </span>
                              </td>
                              <td className="p-3.5 text-right">
                                <button
                                  onClick={() => handleToggleActive("index", item.index, item.is_active)}
                                  className="px-2.5 py-1 bg-base border border-line rounded-lg text-[11px] font-medium text-bodytext hover:text-heading hover:border-accent transition-colors cursor-pointer"
                                >
                                  {item.is_active ? "Deactivate" : "Activate"}
                                </button>
                              </td>
                            </>
                          )}

                          {activeTab === "terminals" && (
                            <>
                              <td className="p-3.5 font-mono text-muted">#{item.terminal_index}</td>
                              <td className="p-3.5 font-mono font-bold text-accent">{item.terminal_id}</td>
                              <td className="p-3.5 font-mono">#{item.terminal_number}</td>
                              <td className="p-3.5 font-mono text-muted">
                                C: {item.company_index} | B: {item.branch_index}
                              </td>
                              <td className="p-3.5">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                                    item.is_active
                                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                      : "bg-base text-muted border-line"
                                  }`}
                                >
                                  {item.is_active ? "Active" : "Inactive"}
                                </span>
                              </td>
                              <td className="p-3.5 text-right">
                                <button
                                  onClick={() => handleToggleActive(fieldKey, idx, item.is_active)}
                                  className="px-2.5 py-1 bg-base border border-line rounded-lg text-[11px] font-medium text-bodytext hover:text-heading hover:border-accent transition-colors cursor-pointer"
                                >
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

