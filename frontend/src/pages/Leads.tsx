import { useState, useEffect } from "react";
import { leadsAPI } from "@/api";
import { Lead } from "@/types";

const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [retryingCRM, setRetryingCRM] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await leadsAPI.getLeads();
      setLeads(data);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching leads:", err);
      let errorMsg = "Failed to load leads";

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

  const handleRetryCRM = async (leadId: number) => {
    try {
      setRetryingCRM(true);
      const updatedLead = await leadsAPI.retryCRM(leadId);

      // Update the lead in the list
      setLeads(leads.map((lead) => (lead.id === leadId ? updatedLead : lead)));

      // If this is the selected lead, update it
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead(updatedLead);
      }

      setError(null);
    } catch (err) {
      setError("Failed to retry CRM save");
      console.error(err);
    } finally {
      setRetryingCRM(false);
    }
  };

  const getCRMStatus = (lead: Lead) => {
    if (!lead.crm_attempts || lead.crm_attempts.length === 0) {
      return <span className="text-gray-500">No attempts</span>;
    }

    // Get the latest attempt
    const latestAttempt = lead.crm_attempts.reduce((latest, current) =>
      latest.attempt_number > current.attempt_number ? latest : current
    );

    if (latestAttempt.success) {
      return <span className="text-green-600">Success</span>;
    } else {
      return <span className="text-red-600">Failed</span>;
    }
  };

  if (loading && leads.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Leads</h2>
        <button
          onClick={fetchLeads}
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {leads.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No leads found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leads List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow">
            <ul className="divide-y divide-gray-200">
              {leads.map((lead) => (
                <li
                  key={lead.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                    selectedLead?.id === lead.id ? "bg-primary-50" : ""
                  }`}
                  onClick={() => setSelectedLead(lead)}
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {lead.name}
                      </h3>
                      <p className="text-sm text-gray-500">{lead.email}</p>
                      <p className="text-xs text-gray-500">{lead.company}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </p>
                      <div>{getCRMStatus(lead)}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Lead Details */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            {selectedLead ? (
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedLead.name}
                    </h2>
                    <p className="text-gray-600">{selectedLead.email}</p>
                    <p className="text-gray-600">{selectedLead.company}</p>
                  </div>

                  <button
                    onClick={() => handleRetryCRM(selectedLead.id)}
                    disabled={
                      retryingCRM ||
                      selectedLead.crm_attempts.some((a) => a.success)
                    }
                    className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      retryingCRM ||
                      selectedLead.crm_attempts.some((a) => a.success)
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    }`}
                  >
                    {retryingCRM ? "Retrying..." : "Retry CRM Save"}
                  </button>
                </div>

                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-900 mb-2">
                    Original Message
                  </h3>
                  <div className="bg-gray-50 p-4 rounded border border-gray-200 text-sm text-gray-700">
                    {selectedLead.raw_message}
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-2">
                    CRM Attempts
                  </h3>
                  {selectedLead.crm_attempts.length === 0 ? (
                    <p className="text-gray-500">No attempts yet</p>
                  ) : (
                    <div className="space-y-3">
                      {selectedLead.crm_attempts.map((attempt) => (
                        <div
                          key={attempt.id}
                          className={`p-3 rounded border ${
                            attempt.success
                              ? "border-green-200 bg-green-50"
                              : "border-red-200 bg-red-50"
                          }`}
                        >
                          <div className="flex justify-between">
                            <div>
                              <p
                                className={`font-medium ${
                                  attempt.success
                                    ? "text-green-700"
                                    : "text-red-700"
                                }`}
                              >
                                Attempt #{attempt.attempt_number}:{" "}
                                {attempt.success ? "Success" : "Failed"}
                              </p>
                              {attempt.error_message && (
                                <p className="text-sm text-red-600 mt-1">
                                  {attempt.error_message}
                                </p>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">
                              {new Date(attempt.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">Select a lead to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
