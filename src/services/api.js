
import axios from "axios";

/**
 * API Base URL Strategy:
 *
 * DEV  → Vite dev server proxies `/api` → real PHP backend.
 *        This avoids CORS entirely because the browser talks to localhost.
 *
 * PROD → Use the full remote URL from .env (VITE_API_BASE_URL).
 *        In production the server must have CORS headers, or you deploy
 *        behind a reverse proxy that adds them.
 */
const IS_DEV = import.meta.env.DEV;

export const API_BASE_URL = IS_DEV
  ? "/api"
  : (import.meta.env.VITE_API_BASE_URL ||
     "https://demo.onlineserp.com/serp_dev/app/integration/poss_new/exe_realese_v2.php");

// Alias for backwards compatibility
export const API_BASE = API_BASE_URL;

/**
 * Configured Axios client instance.
 * PHP backend reads: json_decode(file_get_contents("php://input"), true)
 * So we must send application/json — the server already has CORS headers.
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach Bearer Token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("pos_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent error extraction
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Service Error Details:", {
      message: error.message,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

/**
 * Dashboard & Version Management Endpoints
 */
export const dashboardApi = {
  getDashboardStats: async () => {
    const res = await apiClient.get("", { params: { action: "get_dashboard_stats" } });
    return res.data;
  },
  getAllVersions: async () => {
    const res = await apiClient.get("", { params: { action: "get_all_versions" } });
    return res.data;
  },
  uploadRelease: async (formData) => {
    // File uploads must stay as multipart/form-data
    const res = await apiClient.post("", formData, {
      params: { action: "upload_release" },
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};

/**
 * Deployments & Target Releases Endpoints
 */
export const deploymentApi = {
  getDeployments: async () => {
    const res = await apiClient.get("", { params: { action: "get_deployments" } });
    return res.data;
  },
  getTargetDeployments: async () => {
    const res = await apiClient.get("", { params: { action: "get_target_deployments" } });
    return res.data;
  },
  publishTarget: async (targetData) => {
    // 💡 toFormBody ඉවත් කර කෙලින්ම targetData JSON ලෙස යැවීම
    const res = await apiClient.post("", targetData, {
      params: { action: "publish_target" },
    });
    return res.data;
  },
};

/**
 * Update Logs Endpoints
 */
export const logsApi = {
  getUpdateLogs: async () => {
    const res = await apiClient.get("", { params: { action: "get_update_logs" } });
    return res.data;
  },
};

/**
 * Master Data Settings Endpoints
 */
export const masterApi = {
  getCategories: async () => {
    const res = await apiClient.get("", { params: { action: "get_all_release_categories" } });
    return res.data;
  },
  getCompanies: async () => {
    const res = await apiClient.get("", { params: { action: "get_all_companies" } });
    return res.data;
  },
  getBranches: async () => {
    const res = await apiClient.get("", { params: { action: "get_all_branches" } });
    return res.data;
  },
  getTerminals: async () => {
    const res = await apiClient.get("", { params: { action: "get_all_terminals" } });
    return res.data;
  },
  toggleStatus: async (actionName, payload) => {
    // 💡 toFormBody ඉවත් කර කෙලින්ම payload JSON ලෙස යැවීම
    const res = await apiClient.post("", payload, {
      params: { action: actionName },
    });
    return res.data;
  },
  addRecord: async (actionName, payload) => {
    // 💡 toFormBody ඉවත් කර කෙලින්ම payload JSON ලෙස යැවීම
    const res = await apiClient.post("", payload, {
      params: { action: actionName },
    });
    return res.data;
  },
};

/**
 * Authentication Endpoints
 */
export const authApi = {
  /**
   * POST ?action=user_login
   * body: { username, password }
   */
  login: async ({ username, password }) => {
    const res = await apiClient.post("", { username, password }, {
      params: { action: "user_login" },
    });
    return res.data;
  },

  /**
   * POST ?action=user_signup
   * body: { full_name, username, password }
   */
  signup: async ({ full_name, username, password }) => {
    const res = await apiClient.post("", { full_name, username, password }, {
      params: { action: "user_signup" },
    });
    return res.data;
  },
};

export default apiClient;