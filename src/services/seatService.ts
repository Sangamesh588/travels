import { supabase } from "@/lib/supabase";

export async function getSeats(busId: number) {
  const { data, error } = await supabase
    .from("seats")
    .select("*")
    .eq("bus_id", busId)
    .order("seat_number");

  if (error) throw error;

  return data;
}