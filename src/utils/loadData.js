// src/utils/loadData.js
export async function loadTripData() {
  const files = [
    "trip_1_cross_country.json",
    "trip_2_urban_dense.json",
    "trip_3_mountain_cancelled.json",
    "trip_4_southern_technical.json",
    "trip_5_regional_logistics.json",
  ];

  const arr = await Promise.all(
    files.map((f) =>
      fetch(`/data/${f}`).then((r) => {
        if (!r.ok) throw new Error(`Failed to load ${f}`);
        return r.json();
      })
    )
  );

  // Normalize each trip into { id, name, events: [] }
  return arr.map((t, i) => {
    // If file contains just array of events, use that; else try t.events
    const events = Array.isArray(t) ? t : t.events ?? t.data ?? [];
    return {
      id: t.trip_id ?? t.id ?? `trip-${i + 1}`,
      name: t.name ?? t.trip_name ?? `Trip ${i + 1}`,
      events,
    };
  });
}
