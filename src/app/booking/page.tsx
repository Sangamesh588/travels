"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import SeatLayout, { BookingPayload } from "@/components/SeatLayout";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function BookingPage() {
  const params = useParams();

const busId = params.id;
  const [seats, setSeats] = useState<any[]>([]);
  const [bus, setBus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSeats();
  }, []);

  async function loadSeats() {
    try {
      // Fetch seats
      const { data, error } = await supabase
        .from("seats")
        .select("*")
        .order("id");

      console.log("DATA =", data);
      console.log("ERROR =", error);

      if (error) {
        console.error("Supabase fetch error:", error);
      } else {
        setSeats(data || []);
      }

      // Fetch bus details (ID 3)
      const { data: busData, error: busError } = await supabase
        .from("buses")
        .select("*")
        .eq("id", busId)
        .single();

      if (busError) {
        console.error("Bus fetch error:", busError);
      } else {
        setBus(busData);
      }
    } catch (err) {
      console.error("Unexpected error loading seats:", err);
    } finally {
      setLoading(false);
    }
  }

  // Updated parameter type to match SeatLayout's BookingPayload
  const handleProceed = (payload: BookingPayload) => {
    console.log("Full Booking Payload:", payload);
    console.log("Selected Seats:", payload.selectedSeats);
    console.log("Passengers:", payload.passengers);
    console.log("Contact Info:", payload.contactInfo);

    // Example navigation logic:
    // router.push(`/checkout?seats=${payload.selectedSeats.join(",")}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
        <p className="text-sm font-semibold text-slate-300">
          Loading seat layout...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white py-10 px-4">
      <div className="max-w-5xl mx-auto mb-6 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Select Your Seats
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Choose your preferred sleeper berths to continue booking
        </p>
      </div>

      <SeatLayout
        seats={seats}
        bus={bus}
        onProceed={handleProceed}
      />
    </div>
  );
}