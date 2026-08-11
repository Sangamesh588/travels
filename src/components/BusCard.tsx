"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface BusData {
  id: string | number;
  bus_name?: string;
  bus_type?: string;
  rating?: number;
  boarding_time?: string;
  departure_time?: string;
  departure?: string;
  dropping_time?: string;
  arrival_time?: string;
  arrival?: string;
  boarding_city?: string;
  source?: string;
  dropping_city?: string;
  destination?: string;
  lower_single_fare?: number;
  lower_double_fare?: number;
  upper_single_fare?: number;
  upper_double_fare?: number;
  calculated_fare?: number;
  fare?: number;
  price?: number;
  ticket_price?: number;
  available_seats?: number;
  amenities?: string[];
}

/** Parses 12h (08:00 PM) or 24h (20:00) time strings into total minutes from midnight */
function parseTimeToMinutes(timeStr: string): number | null {
  if (!timeStr) return null;

  const clean = timeStr.trim().toUpperCase().replace(".", ":");
  const isPM = clean.includes("PM");
  const isAM = clean.includes("AM");
  const timePart = clean.replace(/(AM|PM)/g, "").trim();
  const parts = timePart.split(":");

  if (parts.length < 2) return null;

  let hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);

  if (isNaN(hours) || isNaN(minutes)) return null;

  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

/** Calculates total duration string between departure and arrival */
function calculateDuration(departure: string, arrival: string): string {
  const depMins = parseTimeToMinutes(departure);
  const arrMins = parseTimeToMinutes(arrival);

  if (depMins === null || arrMins === null) return "--";

  let diff = arrMins - depMins;

  // Handle overnight journeys crossing midnight
  if (diff < 0) {
    diff += 24 * 60;
  }

  const hours = Math.floor(diff / 60);
  const mins = diff % 60;

  return `${hours}h ${mins}m`;
}

/** Safely derives the minimum available fare without returning Infinity */
function getStartingPrice(bus: BusData): number {
  const fares = [
    bus?.lower_single_fare,
    bus?.lower_double_fare,
    bus?.upper_single_fare,
    bus?.upper_double_fare,
    bus?.calculated_fare,
    bus?.fare,
    bus?.price,
    bus?.ticket_price,
  ].filter((f): f is number => typeof f === "number" && !isNaN(f) && f > 0);

  return fares.length > 0 ? Math.min(...fares) : 850;
}

export default function BusCard({ bus }: { bus: BusData }) {
  const [availableSeats, setAvailableSeats] = useState<number>(
    bus?.available_seats ?? 0
  );

  const price = getStartingPrice(bus);
  const rating = bus?.rating || 4.8;

  const departureTime =
    bus?.boarding_time ||
    bus?.departure_time ||
    bus?.departure ||
    "08:00 PM";

  const arrivalTime =
    bus?.dropping_time ||
    bus?.arrival_time ||
    bus?.arrival ||
    "06:00 AM";

  const duration = calculateDuration(departureTime, arrivalTime);

  const fromCity = bus?.boarding_city || bus?.source || "";
  const toCity = bus?.dropping_city || bus?.destination || "";

  // Constructed URL cleanly on a single line
  const bookingUrl = `/booking/${bus?.id}?from=${encodeURIComponent(fromCity)}&to=${encodeURIComponent(toCity)}`;

  useEffect(() => {
    let isMounted = true;

    async function loadAvailableSeats() {
      if (!bus?.id) return;

      const { count, error } = await supabase
        .from("seats")
        .select("*", { count: "exact", head: true })
        .eq("bus_id", bus.id)
        .eq("status", "available");

      if (error) {
        console.error("Error loading available seats:", error);
        return;
      }

      if (isMounted && count !== null) {
        setAvailableSeats(count);
      }
    }

    loadAvailableSeats();

    return () => {
      isMounted = false;
    };
  }, [bus?.id]);

  // Color logic for seat availability badge
  const getSeatBadgeColor = () => {
    if (availableSeats <= 5)
      return "bg-rose-50 text-rose-700 border-rose-200";
    if (availableSeats <= 12)
      return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  };

  return (
    <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 lg:p-6 shadow-xs hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 lg:gap-6">
        
        {/* Left Column: Operator Info & Amenities */}
        <div className="flex-1 space-y-2.5">
          <div className="flex items-center flex-wrap gap-2.5">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {bus?.bus_name || "Express Travels"}
            </h3>

            {/* Rating Badge */}
            <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded-md shadow-2xs">
              <span className="text-[10px]">★</span>
              <span>{rating}</span>
            </span>
          </div>

          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
            {bus?.bus_type || "AC Sleeper (2+1) • Live Tracking"}
          </p>

          {/* Amenities Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
              📶 WiFi
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
              🔌 Power Outlet
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
              🛏 Blankets
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900">
              🛡 Safety Plus
            </span>
          </div>
        </div>

        {/* Center Column: Departure, Duration Timeline, Arrival */}
        <div className="flex items-center justify-between sm:justify-center gap-3 sm:gap-6 py-3.5 lg:py-0 border-y lg:border-y-0 border-slate-100 dark:border-slate-800">
          {/* Departure */}
          <div className="text-left">
            <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {departureTime}
            </p>
            <p className="text-xs font-medium text-slate-400">Departure</p>
          </div>

          {/* Timeline Visual */}
          <div className="flex flex-col items-center px-2 min-w-[90px] sm:min-w-[130px]">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              {duration}
            </span>
            <div className="relative w-full flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-indigo-600 shrink-0"></div>
              <div className="h-[2px] w-full bg-slate-200 dark:bg-slate-700 flex-1"></div>
              <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></div>
            </div>
            <span className="text-[10px] font-medium text-slate-400 mt-1">Direct</span>
          </div>

          {/* Arrival */}
          <div className="text-right">
            <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {arrivalTime}
            </p>
            <p className="text-xs font-medium text-slate-400">Arrival</p>
          </div>
        </div>

        {/* Right Column: Pricing & Action Button */}
        <div className="flex items-center justify-between sm:justify-end lg:flex-col lg:items-end lg:justify-center gap-3 lg:pl-6 lg:border-l border-slate-100 dark:border-slate-800 min-w-full sm:min-w-0 lg:min-w-[170px]">
          <div className="text-left sm:text-right">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Starts from</div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              ₹{price}
            </p>
            {/* Available Seats Count Display */}
            <span
              className={`inline-block text-[11px] font-semibold border px-2 py-0.5 rounded-full mt-0.5 ${getSeatBadgeColor()}`}
            >
              {availableSeats} {availableSeats === 1 ? "Seat" : "Seats"} left
            </span>
          </div>

          {/* Styled CTA Button */}
          <Link
            href={bookingUrl}
            className="w-auto sm:w-auto text-center bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-xs hover:shadow-indigo-500/20 transition-all duration-200 shrink-0"
          >
            Select Seats
          </Link>
        </div>

      </div>
    </div>
  );
}