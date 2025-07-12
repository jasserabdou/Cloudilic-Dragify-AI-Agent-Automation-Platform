import { useState, useEffect } from "react";
import { eventsAPI } from "@/api";
import { Event } from "@/types";

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventsAPI.getEvents();
      setEvents(data);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching events:", err);
      let errorMsg = "Failed to load events";

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

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
            Success
          </span>
        );
      case "processing":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
            Processing
          </span>
        );
      case "failed":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
            Failed
          </span>
        );
      case "partial_success":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
            Partial Success
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  if (loading && events.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Event Log</h2>
        <button
          onClick={fetchEvents}
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {events.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No events found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Events List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow">
            <ul className="divide-y divide-gray-200">
              {events.map((event) => (
                <li
                  key={event.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                    selectedEvent?.id === event.id ? "bg-primary-50" : ""
                  }`}
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {event.event_type} event
                      </h3>
                      <p className="text-xs text-gray-500">
                        ID: {event.event_id}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">
                        {new Date(event.created_at).toLocaleString()}
                      </p>
                      {getStatusBadge(event.status)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Event Details */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            {selectedEvent ? (
              <div>
                <div className="mb-4">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedEvent.event_type} Event Details
                    </h2>
                    {getStatusBadge(selectedEvent.status)}
                  </div>
                  <p className="text-gray-600 mt-1">
                    Event ID: {selectedEvent.event_id}
                  </p>
                  <p className="text-gray-600">
                    Timestamp:{" "}
                    {new Date(selectedEvent.created_at).toLocaleString()}
                  </p>
                </div>

                {selectedEvent.payload && (
                  <div className="mb-6">
                    <h3 className="text-md font-medium text-gray-900 mb-2">
                      Payload
                    </h3>
                    <div className="bg-gray-50 p-4 rounded border border-gray-200 text-sm text-gray-700 whitespace-pre-wrap">
                      {selectedEvent.payload}
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-md font-medium text-gray-900 mb-2">
                    {selectedEvent.status === "success"
                      ? "This event was processed successfully."
                      : selectedEvent.status === "partial_success"
                      ? "This event was partially processed. Some operations might have failed."
                      : selectedEvent.status === "processing"
                      ? "This event is still being processed."
                      : "This event failed to process correctly."}
                  </h3>
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">Select an event to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
