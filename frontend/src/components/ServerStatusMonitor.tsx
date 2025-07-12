import { useEffect, useState } from "react";
import { checkBackendStatus } from "@/utils/serverStatus";

const ServerStatusMonitor = () => {
  const [status, setStatus] = useState<{
    isRunning: boolean;
    message: string;
  } | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      setChecking(true);
      try {
        const result = await checkBackendStatus();
        setStatus(result);
      } catch (error) {
        console.error("Error checking server status:", error);
        setStatus({
          isRunning: false,
          message: "Failed to check backend server status.",
        });
      } finally {
        setChecking(false);
      }
    };

    // Check status immediately
    checkStatus();

    // Then check every 30 seconds
    const interval = setInterval(checkStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  if (checking || !status) {
    return null;
  }

  if (status.isRunning) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-3 rounded-md shadow-lg z-50 max-w-md">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium">Backend Server Error</h3>
          <div className="mt-1 text-sm">{status.message}</div>
          <div className="mt-2 text-sm">
            Please start the backend server by running{" "}
            <code className="bg-red-700 px-1 rounded">run_backend.bat</code> in
            the project folder.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerStatusMonitor;
