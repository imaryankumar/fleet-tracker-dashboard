// src/components/FleetSummary.js
import React from "react";

export default function FleetSummary({ visibleEvents, totalTrips }) {
  // count completed by 'trip_completed' or 'trip_cancelled' events (try common keys)
  const completedSet = new Set(
    visibleEvents
      .filter(
        (e) =>
          (e.event_type || e.type || "")
            .toLowerCase()
            .includes("trip_completed") ||
          (e.event_type || e.type || "")
            .toLowerCase()
            .includes("trip_cancelled")
      )
      .map((e) => e.trip_id ?? e.tripId ?? e.trip_id)
  );

  const active = totalTrips - completedSet.size;
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white rounded-lg p-4 shadow">
        <div className="text-sm text-gray-500">Total Trips</div>
        <div className="text-2xl font-bold">{totalTrips}</div>
      </div>
      <div className="bg-white rounded-lg p-4 shadow">
        <div className="text-sm text-gray-500">Active</div>
        <div className="text-2xl font-bold text-indigo-600">{active}</div>
      </div>
      <div className="bg-white rounded-lg p-4 shadow">
        <div className="text-sm text-gray-500">Completed / Cancelled</div>
        <div className="text-2xl font-bold text-green-600">
          {completedSet.size}
        </div>
      </div>
    </div>
  );
}
