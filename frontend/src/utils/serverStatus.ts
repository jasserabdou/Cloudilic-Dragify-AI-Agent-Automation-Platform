import axios from "axios";

export const checkBackendStatus = async (): Promise<{
  isRunning: boolean;
  message: string;
}> => {
  try {
    // Try to connect to the backend server with a timeout
    await axios.get("http://localhost:8000/api/v1/health", {
      timeout: 5000, // 5 seconds timeout
    });
    return {
      isRunning: true,
      message: "Backend server is running",
    };
  } catch (error: any) {
    console.error("Backend server check failed:", error);

    if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
      return {
        isRunning: false,
        message:
          "Backend server is not running. Please start the backend server.",
      };
    }

    if (error.response) {
      // Server responded with a status other than 2xx
      return {
        isRunning: true, // Server is running but returned an error
        message: `Backend server error: ${error.response.status} ${error.response.statusText}`,
      };
    }

    return {
      isRunning: false,
      message:
        "Unable to connect to backend server. Please check if it's running.",
    };
  }
};
