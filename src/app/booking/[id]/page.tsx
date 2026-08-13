"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import SeatLayout, { BookingPayload, Bus } from "@/components/SeatLayout";
import { supabase } from "@/lib/supabase";
import { Loader2, CalendarX2 } from "lucide-react";

export default function BookingPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const busId = params.id as string;
  const boardingCity = searchParams.get("from");
  const droppingCity = searchParams.get("to");
  const selectedDate = searchParams.get("date");

  const [seats, setSeats] = useState<any[]>([]);
  const [bus, setBus] = useState<Bus | null>(null);
  const [loading, setLoading] = useState(true);
  const [notAvailable, setNotAvailable] = useState(false);

  useEffect(() => {
    if (busId && selectedDate) {
      loadBusAndSeats();
    } else if (busId && !selectedDate) {
      setLoading(false);
      setNotAvailable(true);
    }
  }, [busId, selectedDate]);

  async function loadBusAndSeats() {
    try {
      setLoading(true);
      setNotAvailable(false);

      // =========================================================
      // 1. CHECK SCHEDULE FOR SELECTED DATE
      // =========================================================
      const { data: schedule, error: scheduleError } = await supabase
        .from("schedules")
        .select("*")
        .eq("bus_id", busId)
        .eq("journey_date", selectedDate)
        .eq("status", "active")
        .maybeSingle();

      console.log("BUS ID =", busId);
      console.log("DATE =", selectedDate);
      console.log("SCHEDULE =", schedule);

      if (scheduleError) {
        console.error("Schedule query error:", scheduleError);
      }

      // If no schedule exists for this bus on selected date, block booking
      if (!schedule) {
        setNotAvailable(true);
        setLoading(false);
        return;
      }

      // =========================================================
      // 2. GET SELECTED BUS DETAILS
      // =========================================================
      const { data: busData, error: busError } = await supabase
        .from("buses")
        .select("*")
        .eq("id", busId)
        .single();

      console.log("SELECTED BUS =", busData);
      console.log("BUS ERROR =", busError);

      if (busError) {
        console.error("Bus fetch error:", busError);
        setNotAvailable(true);
        setLoading(false);
        return;
      }

      setBus({
        ...busData,
        boarding_city: boardingCity || busData.source,
        dropping_city: droppingCity || busData.destination,
      });

      // =========================================================
      // 3. GET BASE SEATS LAYOUT FOR THIS BUS
      // =========================================================
      const { data: seatData, error: seatError } = await supabase
        .from("seats")
        .select("*")
        .eq("bus_id", busId)
        .order("id");

      console.log("SEATS FOR THIS BUS =", seatData);

      if (seatError) {
        console.error("Seat fetch error:", seatError);
        setLoading(false);
        return;
      }

      // =========================================================
      // 4. FETCH DATE-SPECIFIC BOOKINGS (Isolate seats by Date)
      // =========================================================
      const { data: bookedSeatsData, error: bookingError } = await supabase
  .from("bookings")
  .select("seat_number")
  .eq("bus_id", busId)
  .eq("journey_date", selectedDate);

      if (bookingError) {
        console.error("Bookings fetch error:", bookingError);
      }

      // Extract set of seat IDs / numbers already booked for this specific date
      const bookedSet = new Set(
  (bookedSeatsData || []).map((b) => b.seat_number)
);

      // Merge base layout with date-specific availability
      const dateAwareSeats = (seatData || []).map((seat) => {
        const isBookedOnDate =
  bookedSet.has(seat.seat_number);
        return {
          ...seat,
          status: isBookedOnDate ? "booked" : seat.status || "available",
        };
      });

      setSeats(dateAwareSeats);
    } catch (error) {
      console.error("Unexpected error loading booking data:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleProceed = (payload: BookingPayload) => {
    const fullPayload = {
      ...payload,
      busId,
      journeyDate: selectedDate,
      boardingCity,
      droppingCity,
    };

    console.log("FULL BOOKING PAYLOAD =", fullPayload);
  };

  // =========================
  // NO BUS ID
  // =========================
  if (!busId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-slate-200 max-w-sm w-full mx-4">
          <h2 className="text-xl font-bold text-red-600">No Bus Selected</h2>
          <p className="text-sm text-slate-500 mt-2">
            Please select a bus from the search results first.
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // NOT AVAILABLE FOR DATE
  // =========================
  if (notAvailable) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="text-center max-w-md w-full bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarX2 size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Bus Not Available</h2>
          <p className="mt-2 text-slate-500 text-sm">
            This bus is not running or active on{" "}
            <span className="font-semibold text-slate-700">{selectedDate || "the selected date"}</span>.
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-600 bg-white px-6 py-4 rounded-xl border border-slate-200 shadow-2xs">
          <Loader2 size={24} className="animate-spin text-indigo-600" />
          <span className="font-semibold text-sm">Loading bus schedule & seats...</span>
        </div>
      </div>
    );
  }

  // =========================
  // PAGE
  // =========================
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      {/* BUS INFORMATION HEADER */}
      <div className="max-w-5xl mx-auto px-4 mb-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <h1 className="text-2xl font-extrabold text-slate-900">{bus?.bus_name}</h1>

          <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
            <span>🚌 Bus ID: {bus?.id}</span>
            <span>
              📍 {`${bus?.boarding_city || bus?.source} → ${bus?.dropping_city || bus?.destination}`}
            </span>
            <span>📅 Journey Date: {selectedDate}</span>
            <span>🕐 Departure: {bus?.departure_time}</span>
          </div>
        </div>
      </div>

      {/* SEAT LAYOUT */}
      <SeatLayout seats={seats} bus={bus} onProceed={handleProceed} />
    </div>
  );
}