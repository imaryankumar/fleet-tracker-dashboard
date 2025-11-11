// src/hooks/useFleetSimulation.js
import { useEffect, useRef, useState } from "react";

/**
 * trips: [{ id, name, events: [{ timestamp: ISO|string|number, event_type, ... }] }]
 * speed: multiplier (1,5,10)
 */
export function useFleetSimulation(trips, speed = 5, tickMs = 1000) {
  const [simElapsedMs, setSimElapsedMs] = useState(0);
  const [visibleEvents, setVisibleEvents] = useState([]);
  const startRealRef = useRef(null);
  const minTsRef = useRef(null);

  // Normalize _ts on load and compute earliest timestamp
  useEffect(() => {
    if (!trips || trips.length === 0) return;

    trips.forEach((trip) => {
      trip.events.forEach((e) => {
        // support a couple of timestamp names
        const raw = e.timestamp ?? e.time ?? e.ts;
        e._ts = typeof raw === "number" ? raw : Date.parse(raw);
      });
    });

    // earliest event across all trips
    const allTs = trips.flatMap((t) =>
      t.events.map((e) => e._ts).filter(Boolean)
    );
    const minTs = Math.min(...allTs);
    minTsRef.current = Number(minTs);

    startRealRef.current = Date.now();
    setSimElapsedMs(0);
    setVisibleEvents([]);
  }, [trips]);

  useEffect(() => {
    if (!minTsRef.current) return;
    const tick = () => {
      const elapsedReal = Date.now() - startRealRef.current;
      const simElapsed = elapsedReal * speed; // ms
      setSimElapsedMs(simElapsed);

      const simNow = minTsRef.current + simElapsed;
      const events = trips.flatMap((t) =>
        t.events.filter((e) => e._ts <= simNow)
      );
      // stable ordering by _ts
      events.sort((a, b) => a._ts - b._ts);
      setVisibleEvents(events);
    };

    const id = setInterval(tick, tickMs);
    return () => clearInterval(id);
  }, [trips, speed, tickMs]);

  return { simElapsedMs, visibleEvents };
}
