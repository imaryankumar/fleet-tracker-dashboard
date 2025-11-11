import { useEffect, useState } from "react";
import "./App.css";
import { loadTripData } from "./utils/loadData";
import { useFleetSimulation } from "./hooks/useFleetSimulation";
import FleetSummary from "./components/FleetSummary";
import TripCard from "./components/TripCard";

export default function App() {
  const [trips, setTrips] = useState([]);
  const [speed, setSpeed] = useState(5);

  useEffect(() => {
    loadTripData()
      .then(setTrips)
      .catch((err) => {
        console.error("Load trips failed:", err);
        alert("Failed to load trip data. Check console.");
      });
  }, []);

  const { visibleEvents, simElapsedMs } = useFleetSimulation(trips, speed);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              🚚 MapUp — Fleet Dashboard
            </h1>
            <p className="text-sm text-gray-500">
              Real-time simulation using fallback dataset • Simulated time:{" "}
              {(simElapsedMs / 1000).toFixed(0)}s
            </p>
          </div>

          <div className="flex items-center gap-2">
            {[1, 5, 10].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-3 py-2 rounded-md font-semibold ${
                  speed === s ? "bg-indigo-600 text-white" : "bg-white border"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <FleetSummary
            visibleEvents={visibleEvents}
            totalTrips={trips.length || 5}
          />
        </div>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trips.map((t) => (
            <TripCard key={t.id} trip={t} visibleEvents={visibleEvents} />
          ))}
        </main>
      </header>
    </div>
  );
}
