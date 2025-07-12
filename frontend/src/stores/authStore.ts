import { create } from "zustand";
import { authAPI } from "@/api";
import { User } from "@/types";

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
  setUser: (user: User) => void;
  clearUser: () => void;
  setError: (error: string | null) => void;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  fetchUser: () => Promise<User | void>;
}

// Initialize token from localStorage
const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem("token");
  } catch (error) {
    console.error("Error accessing localStorage:", error);
    return null;
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  token: getStoredToken(),
  user: null,
  loading: false,
  error: null,

  setToken: (token: string) => {
    localStorage.setItem("token", token);
    set({ token });
  },

  clearToken: () => {
    localStorage.removeItem("token");
    set({ token: null });
  },

  setUser: (user: User) => set({ user }),

  clearUser: () => set({ user: null }),

  setError: (error: string | null) => set({ error }),

  login: async (username: string, password: string) => {
    set({ loading: true, error: null });
    try {
      console.log(`Attempting to login with username: ${username}`);
      const response = await authAPI.login({ username, password });
      console.log("Login successful, token received");
      get().setToken(response.access_token);
      await get().fetchUser();
      return true; // Indicate successful login
    } catch (error: any) {
      let errorMessage = "Failed to login";

      console.error("Login error:", error);

      // Check if it's an API error with a response
      if (error.response && error.response.data) {
        // Extract the error message from the API response
        errorMessage = error.response.data.detail || "Authentication failed";
        console.error("API error details:", error.response.data);
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      // Add more specific instructions for common errors
      if (errorMessage.includes("Incorrect username or password")) {
        errorMessage =
          "Incorrect username or password. Please use username 'demo' and password 'password'.";
      } else if (!error.response) {
        errorMessage =
          "Network error - please check if the backend server is running.";
      }

      set({ error: errorMessage });
      return false; // Indicate failed login
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    get().clearToken();
    get().clearUser();
  },

  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      console.log("Fetching user data...");
      const token = get().token;
      if (!token) {
        console.log("No token available, cannot fetch user");
        throw new Error("No authentication token");
      }

      const user = await authAPI.getMe();
      console.log("User data fetched successfully:", user);
      set({ user });
      return user;
    } catch (error: any) {
      console.error("Error in fetchUser:", error);

      // Check if the error is a 401 Unauthorized
      if (error.response && error.response.status === 401) {
        // Token has expired or is invalid
        const errorMessage = "Your session has expired. Please login again.";
        console.error(errorMessage);
        set({ error: errorMessage });
        // Clear authentication state
        get().logout();
      } else {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch user";
        set({ error: errorMessage });
      }
      throw error; // Re-throw to allow handling in components
    } finally {
      set({ loading: false });
    }
  },
}));
