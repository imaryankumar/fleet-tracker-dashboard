// src/components/TripCard.js
import React, { useMemo } from "react";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { FiMapPin, FiClock } from "react-icons/fi";

export default function TripCard({ trip, visibleEvents }) {
  // visible events for this trip
  const tripId = trip.id ?? trip.trip_id ?? trip.tripId;
  const events = useMemo(
    () =>
      visibleEvents.filter(
        (e) => (e.trip_id ?? e.tripId ?? e.trip_id) == tripId
      ),
    [visibleEvents, tripId]
  );

  const last = events.length ? events[events.length - 1] : null;

  // small sparkline data: last up to 20 speed points
  const sparkData = useMemo(() => {
    return (
      events.slice(-20).map((e) => ({
        ts: e._ts
          ? new Date(e._ts).toLocaleTimeString()
          : (e.timestamp || "").slice(-8),
        speed: e.movement?.speed_kmh ?? e.speed ?? e.mph ?? 0,
      })),
      [events]
    );
  }, [events]);

  return (
    <div className="bg-white rounded-xl p-4 shadow hover:shadow-lg transition">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-lg">{trip.name ?? tripId}</h3>
          <div className="text-xs text-gray-500">ID: {tripId}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Last seen</div>
          <div className="font-mono text-sm">
            {last ? new Date(last._ts ?? last.timestamp).toLocaleString() : "—"}
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FiMapPin />
          <div>
            {last?.location ? (
              <div>
                {last.location.lat.toFixed(4)}, {last.location.lng.toFixed(4)}
              </div>
            ) : (
              <div className="text-xs text-gray-400">No location yet</div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FiClock />
          <div className="text-sm">
            {last ? `${last.movement?.speed_kmh ?? last.speed ?? 0} km/h` : "—"}
          </div>
        </div>
      </div>

      <div className="mt-3 h-20">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparkData}>
            <XAxis dataKey="ts" hide />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="speed"
              stroke="#6366f1"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
