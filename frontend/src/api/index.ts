import axios from "axios";
import {
  LoginCredentials,
  LoginResponse,
  RegisterData,
  User,
  Lead,
  Event,
  DashboardStats,
  AgentConfig,
  AgentConfigUpdate,
} from "@/types";

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    console.log(`Adding token to request: ${config.url}`);
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.log(`No token found for request: ${config.url}`);
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Add detailed logging
    console.error("API Error:", error);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
      console.error("Request URL:", error.config.url);
      console.error("Request method:", error.config.method);
    }

    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized access, redirecting to login", error);

      // Clear token from localStorage
      localStorage.removeItem("token");

      // Only redirect if we're not already on the login page
      const currentPath = window.location.pathname;
      if (currentPath !== "/login") {
        // Redirect to login page
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const formData = new FormData();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);

    const response = await api.post<LoginResponse>("/auth/token", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  register: async (data: RegisterData): Promise<User> => {
    const response = await api.post<User>("/auth/register", data);
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get<User>("/users/me");
    return response.data;
  },
};

// Leads API
export const leadsAPI = {
  getLeads: async (): Promise<Lead[]> => {
    const response = await api.get<Lead[]>("/leads");
    return response.data;
  },

  getLead: async (id: number): Promise<Lead> => {
    const response = await api.get<Lead>(`/leads/${id}`);
    return response.data;
  },

  retryCRM: async (id: number): Promise<Lead> => {
    const response = await api.post<Lead>(`/leads/${id}/retry-crm`);
    return response.data;
  },
};

// Events API
export const eventsAPI = {
  getEvents: async (): Promise<Event[]> => {
    const response = await api.get<Event[]>("/events");
    return response.data;
  },

  getEvent: async (id: string): Promise<Event> => {
    const response = await api.get<Event>(`/events/${id}`);
    return response.data;
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>("/dashboard/stats");
    return response.data;
  },
};

// Webhook API (for demo purposes)
export const webhookAPI = {
  sendMessage: async (message: string): Promise<any> => {
    try {
      console.log("Sending webhook message:", message);

      // Check if we have a token before making the request
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        throw new Error("You need to be logged in to use this feature");
      }

      const response = await api.post("/webhook/", { message });
      console.log("Webhook response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Webhook API error:", error);
      console.error(
        "Error details:",
        error.response?.data || "No response data"
      );
      // Re-throw the error so it can be handled by the component
      throw error;
    }
  },
};

// Config API
export const configAPI = {
  getConfig: async (): Promise<AgentConfig> => {
    const response = await api.get<AgentConfig>("/config");
    return response.data;
  },

  updateConfig: async (config: AgentConfigUpdate): Promise<AgentConfig> => {
    const response = await api.post<AgentConfig>("/config/update", config);
    return response.data;
  },
};

export default api;
