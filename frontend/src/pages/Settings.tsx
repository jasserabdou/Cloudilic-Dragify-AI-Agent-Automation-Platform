import { useState, useEffect } from "react";
import { configAPI } from "@/api";
import { AgentConfig } from "@/types";

const Settings = () => {
  const [config, setConfig] = useState<AgentConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [crmMaxRetries, setCrmMaxRetries] = useState<number>(3);
  const [crmRetryDelay, setCrmRetryDelay] = useState<number>(2);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const data = await configAPI.getConfig();
      setConfig(data);
      setCrmMaxRetries(data.crm_max_retries);
      setCrmRetryDelay(data.crm_retry_delay);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching configuration:", err);
      let errorMsg = "Failed to load configuration";

      // If we have more specific error details, show them
      if (err.response && err.response.data && err.response.data.detail) {
        errorMsg += `: ${err.response.data.detail}`;
      } else if (err.message) {
        errorMsg += `: ${err.message}`;
      }

      if (!err.response) {
        errorMsg += " - Backend server may not be running";
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setSuccess(null);
      setError(null);

      // Only include fields that have changed or are set
      const updateData = {
        ...(crmMaxRetries !== config?.crm_max_retries
          ? { crm_max_retries: crmMaxRetries }
          : {}),
        ...(crmRetryDelay !== config?.crm_retry_delay
          ? { crm_retry_delay: crmRetryDelay }
          : {}),
      };

      const updatedConfig = await configAPI.updateConfig(updateData);
      setConfig(updatedConfig);
      setSuccess("Configuration updated successfully");
    } catch (err) {
      setError("Failed to update configuration");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading && !config) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Agent Settings</h2>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {success && (
        <div className="p-4 bg-green-100 text-green-700 rounded">{success}</div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              CRM Configuration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="crm-max-retries"
                  className="block text-sm font-medium text-gray-700"
                >
                  Max Retries
                </label>
                <input
                  type="number"
                  id="crm-max-retries"
                  min="1"
                  max="10"
                  value={crmMaxRetries}
                  onChange={(e) => setCrmMaxRetries(parseInt(e.target.value))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Number of times to retry CRM operations before giving up
                </p>
              </div>

              <div>
                <label
                  htmlFor="crm-retry-delay"
                  className="block text-sm font-medium text-gray-700"
                >
                  Retry Delay (seconds)
                </label>
                <input
                  type="number"
                  id="crm-retry-delay"
                  min="1"
                  max="30"
                  value={crmRetryDelay}
                  onChange={(e) => setCrmRetryDelay(parseInt(e.target.value))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Delay between retry attempts in seconds
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
