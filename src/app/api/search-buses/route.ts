import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const from = req.nextUrl.searchParams
    .get("from")
    ?.trim()
    .toLowerCase();

  const to = req.nextUrl.searchParams
    .get("to")
    ?.trim()
    .toLowerCase();

  if (!from || !to) {
    return NextResponse.json(
      { error: "Source and destination required" },
      { status: 400 }
    );
  }

  const { data: buses, error } = await supabase
    .from("buses")
    .select("*");

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  const results: any[] = [];

  for (const bus of buses || []) {

  // Direct source -> destination match
  if (
    bus.source?.trim().toLowerCase() === from &&
    bus.destination?.trim().toLowerCase() === to
  ) {

    results.push({
      ...bus,
      boarding_city: bus.source,
      dropping_city: bus.destination,
      boarding_time: bus.departure_time,
      dropping_time: bus.pickup_time,
      travel_distance: bus.total_distance_km,
      calculated_fare: Math.round(
        Number(bus.total_distance_km || 0) *
        Number(bus.fare_per_km || 0)
      ),
    });

    continue;
  }

  // Then check intermediate stops
  const { data: stops } = await supabase
    .from("pickup_points")
    .select("*")
    .eq("bus_id", bus.id)
    .order("distance_from_source", { ascending: true });

  if (!stops?.length) continue;

  const fromStop = stops.find(
    (s) => s.city_name?.trim().toLowerCase() === from
  );

  const toStop = stops.find(
    (s) => s.city_name?.trim().toLowerCase() === to
  );

  if (!fromStop || !toStop) continue;

  if (
    Number(fromStop.distance_from_source) >=
    Number(toStop.distance_from_source)
  ) {
    continue;
  }

  const distance =
    Number(toStop.distance_from_source) -
    Number(fromStop.distance_from_source);

  results.push({
    ...bus,
    boarding_city: fromStop.city_name,
    dropping_city: toStop.city_name,
    boarding_time: fromStop.pickup_time,
    dropping_time: toStop.pickup_time,
    travel_distance: distance,
    calculated_fare: Math.round(
      distance * Number(bus.fare_per_km || 0)
    ),
  });
}

  return NextResponse.json(results);
}