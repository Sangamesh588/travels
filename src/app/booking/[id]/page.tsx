"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SeatLayout, { BookingPayload, Bus } from "@/components/SeatLayout";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function BookingPage() {
  const params = useParams();
const searchParams = useSearchParams();

const busId = params.id as string;

const boardingCity = searchParams.get("from");
const droppingCity = searchParams.get("to");


  

  const [seats, setSeats] = useState<any[]>([]);
  const [bus, setBus] = useState<Bus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (busId) {
      loadBusAndSeats();
    }
  }, [busId]);

  async function loadBusAndSeats() {
    try {
      setLoading(true);

      // =========================
      // 1. GET SELECTED BUS
      // =========================

      const {
        data: busData,
        error: busError,
      } = await supabase
        .from("buses")
        .select("*")
        .eq("id", busId)
        .single();

      console.log("SELECTED BUS =", busData);
      console.log("BUS ERROR =", busError);

      if (busError) {
        console.error("Bus fetch error:", busError);
        return;
      }

      setBus({
  ...busData,

  boarding_city:
    boardingCity || busData.source,

  dropping_city:
    droppingCity || busData.destination,
});

      // =========================
      // 2. GET ONLY THIS BUS SEATS
      // =========================

      const {
        data: seatData,
        error: seatError,
      } = await supabase
        .from("seats")
        .select("*")
        .eq("bus_id", busId)
        .order("id");

      console.log("BUS ID =", busId);
      console.log("SEATS FOR THIS BUS =", seatData);
      console.log("SEAT ERROR =", seatError);

      if (seatError) {
        console.error("Seat fetch error:", seatError);
        return;
      }

      setSeats(seatData || []);
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleProceed = (payload: BookingPayload) => {
    console.log("FULL BOOKING PAYLOAD =", payload);
    console.log("BUS ID =", busId);
    console.log("SELECTED SEATS =", payload.selectedSeats);
    console.log("PASSENGERS =", payload.passengers);
    console.log("CONTACT INFO =", payload.contactInfo);
  };

  // =========================
  // NO BUS ID
  // =========================

  if (!busId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600">
            No Bus Selected
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            Please select a bus first.
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2
            size={24}
            className="animate-spin text-indigo-600"
          />

          <span className="font-semibold">
            Loading bus seats...
          </span>
        </div>
      </div>
    );
  }

  // =========================
  // PAGE
  // =========================

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      
      {/* BUS INFORMATION */}

      <div className="max-w-5xl mx-auto px-4 mb-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          
          <h1 className="text-2xl font-extrabold text-slate-900">
            {bus?.bus_name}
          </h1>

          <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
            
            <span>
              🚌 {bus?.id}
            </span>

            <span>
  📍 {`${bus?.boarding_city || bus?.source} → ${bus?.dropping_city || bus?.destination}`}
</span>

            <span>
              🕐 {bus?.departure_time}
            </span>

          </div>

        </div>
      </div>

      {/* SEAT LAYOUT */}

      <SeatLayout
        seats={seats}
        bus={bus}
        onProceed={handleProceed}
      />

    </div>
  );
}