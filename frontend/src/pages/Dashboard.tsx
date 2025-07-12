import { useState, useEffect } from "react";
import { dashboardAPI, webhookAPI } from "@/api";
import { DashboardStats } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  // API key is now hardcoded and always configured

  useEffect(() => {
    fetchStats();
    // No need to check API key config anymore as it's hardcoded
  }, []);

  // No need for checkApiKeyConfig as API key is hardcoded

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardAPI.getStats();
      setStats(data);
    } catch (err: any) {
      // Check if it's an API error with a response
      if (err.response && err.response.status) {
        if (err.response.status === 401) {
          setError("Authentication error. Please log in again.");
        } else {
          setError(
            `Failed to load dashboard data: ${
              err.response.data?.detail || "Server error"
            }`
          );
        }
      } else {
        setError("Failed to load dashboard data. Please try again later.");
      }
      console.error("Dashboard stats error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      setError("Please enter a message");
      return;
    }

    try {
      setSendingMessage(true);
      setError(null);

      console.log("Preparing to send webhook message");

      try {
        await webhookAPI.sendMessage(message);
        setSuccessMessage("Message sent successfully");
        setMessage("");

        // Refresh stats after a short delay
        setTimeout(() => {
          fetchStats();
        }, 2000);
      } catch (apiErr: any) {
        // Check if this is an API response error with a specific detail message
        console.error("Full API error object:", apiErr);

        if (
          apiErr.response &&
          apiErr.response.data &&
          apiErr.response.data.detail
        ) {
          setError(`Error: ${apiErr.response.data.detail}`);
          console.error("API error detail:", apiErr.response.data.detail);
        } else if (
          apiErr.message === "You need to be logged in to use this feature"
        ) {
          setError(
            "You need to be logged in to use this feature. Please log in first."
          );
        } else {
          setError(
            `Network error: ${apiErr.message || "Failed to connect to server"}`
          );
          console.error("Network error:", apiErr);
        }
      }
    } catch (err: any) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to send message";
      setError(`Error: ${errorMessage}`);
      console.error("General error:", err);
    } finally {
      setSendingMessage(false);
    }
  };

  // Transform leads per time data for chart
  const leadsTimeData = stats
    ? Object.entries(stats.leads_per_time).map(([time, count]) => ({
        time,
        count,
      }))
    : [];

  // Transform event type data for pie chart
  const eventTypeData = stats
    ? Object.entries(stats.events_per_type).map(([type, count]) => ({
        name: type,
        value: count,
      }))
    : [];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-medium text-gray-200 text-high-contrast">
            Total Leads
          </h3>
          <p className="mt-2 text-3xl font-bold text-primary-400">
            {stats?.total_leads || 0}
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-medium text-gray-200 text-high-contrast">
            CRM Success Rate
          </h3>
          <p className="mt-2 text-3xl font-bold text-green-400">
            {stats
              ? Math.round(
                  (stats.successful_crm_saves /
                    (stats.successful_crm_saves + stats.failed_crm_saves ||
                      1)) *
                    100
                )
              : 0}
            %
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-medium text-gray-200 text-high-contrast">
            Failed CRM Saves
          </h3>
          <p className="mt-2 text-3xl font-bold text-red-400">
            {stats?.failed_crm_saves || 0}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-medium text-gray-200 text-high-contrast mb-4">
            Leads Over Time
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={leadsTimeData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="time" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#333",
                    border: "1px solid #555",
                    color: "#fff",
                  }}
                />
                <Legend wrapperStyle={{ color: "#aaa" }} />
                <Bar dataKey="count" name="Leads" fill="#38bdf8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-medium text-gray-200 text-high-contrast mb-4">
            Events by Type
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={eventTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {eventTypeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}-${entry.name}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#333",
                    border: "1px solid #555",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Test Form */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-medium text-gray-200 text-high-contrast mb-4">
          Test Webhook
        </h3>
        <p className="text-gray-400 mb-4">
          Send a test message to trigger the AI Agent and see the results.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 text-red-200 rounded border border-red-700">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-green-900/50 text-green-200 rounded border border-green-700">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSendMessage} className="space-y-4">
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-200"
            >
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi there, just following up on our previous conversation. I'm Ahmed Bassyouni, co-founder of Cloudilic. We're exploring AI solutions to automate our lead capture and onboarding process. You can reach me at ahmed@cloudilic.com. Looking forward to connecting further."
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-primary-500 focus:border-primary-400"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={sendingMessage}
              className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-primary-500"
            >
              {sendingMessage ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
