"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CityAutocomplete from "@/components/CityAutocomplete";
import {
  Calendar,
  Search,
  ArrowLeftRight,
  AlertCircle,
  ShieldCheck,
  Clock,
  CheckCircle,
  Sparkles,
} from "lucide-react";

export default function HeroSection() {
  const router = useRouter();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = () => {
    setErrorMessage("");

    if (!from || !to || !date) {
      setErrorMessage("Please select departure city, destination, and journey date.");
      return;
    }

    if (from.trim().toLowerCase() === to.trim().toLowerCase()) {
      setErrorMessage("Source and destination cities cannot be the same.");
      return;
    }

    router.push(
      `/search?from=${encodeURIComponent(from.trim())}&to=${encodeURIComponent(
        to.trim()
      )}&date=${date}`
    );
  };

  const swapLocations = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const setQuickDate = (daysToAdd: number) => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysToAdd);
    const formattedDate = targetDate.toISOString().split("T")[0];
    setDate(formattedDate);
  };

  return (
    <section className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden">
      {/* Background Lighting Effect */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Top Badge (Properly Padded) */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-amber-400 text-xs sm:text-sm font-semibold tracking-wide shadow-xs">
            <Sparkles size={14} className="text-amber-400" />
            <span>#1 Bus Booking Platform in Karnataka</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight sm:leading-none">
            Travel With{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500">
              Ultimate Comfort
            </span>
          </h1>
          <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Karnataka's most trusted travel partner. Book luxury sleeper and AC
            buses at best prices guaranteed.
          </p>
        </div>

        {/* Search Card Container */}
        <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-200/50 text-slate-900">
          {/* Error Feedback */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle size={16} className="text-rose-500 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Search Inputs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
            
            {/* From City Field */}
            <div className="lg:col-span-3 flex flex-col gap-1.5">
              <label className="text-[11px] font-bold tracking-wider uppercase text-slate-500">
                From
              </label>
              <CityAutocomplete
                placeholder="Departure City"
                value={from}
                onChange={setFrom}
              />
            </div>

            {/* Swap Button */}
            <div className="flex justify-center lg:col-span-1 my-1 lg:my-0 lg:pb-1">
              <button
                type="button"
                onClick={swapLocations}
                aria-label="Swap Locations"
                className="
                  bg-amber-400
                  hover:bg-amber-500
                  text-slate-950
                  w-10
                  h-10
                  rounded-full
                  shadow-md
                  transition-all
                  duration-200
                  flex
                  items-center
                  justify-center
                  active:scale-90
                  hover:rotate-180
                "
              >
                <ArrowLeftRight size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* To City Field */}
            <div className="lg:col-span-3 flex flex-col gap-1.5">
              <label className="text-[11px] font-bold tracking-wider uppercase text-slate-500">
                To
              </label>
              <CityAutocomplete
                placeholder="Destination City"
                value={to}
                onChange={setTo}
              />
            </div>

            {/* Departure Date Field */}
            <div className="lg:col-span-3 flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold tracking-wider uppercase text-slate-500">
                  Date of Journey
                </label>
                
                {/* Quick Date Selectors */}
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setQuickDate(0)}
                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded transition-colors"
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickDate(1)}
                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded transition-colors"
                  >
                    Tomorrow
                  </button>
                </div>
              </div>

              <div className="relative flex items-center">
                <Calendar
                  size={18}
                  className="absolute left-3.5 text-indigo-600 pointer-events-none"
                />
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDate(e.target.value)}
                  className="
                    w-full
                    pl-10
                    pr-3
                    py-3
                    bg-slate-50
                    rounded-xl
                    border
                    border-slate-300
                    text-slate-900
                    text-sm
                    font-semibold
                    outline-none
                    transition-all
                    focus:bg-white
                    focus:border-indigo-600
                    focus:ring-2
                    focus:ring-indigo-100
                  "
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="lg:col-span-2">
              <button
                type="button"
                onClick={handleSearch}
                className="
                  w-full
                  py-3.5
                  px-5
                  bg-indigo-600
                  hover:bg-indigo-700
                  text-white
                  font-bold
                  text-sm
                  rounded-xl
                  shadow-md
                  hover:shadow-lg
                  transition-all
                  duration-200
                  flex
                  items-center
                  justify-center
                  gap-2
                  active:scale-95
                "
              >
                <Search size={18} strokeWidth={2.5} />
                <span>Search Buses</span>
              </button>
            </div>

          </div>
        </div>

        {/* Value Highlights Footer */}
        <div className="mt-10 flex flex-wrap justify-center items-center gap-6 sm:gap-10 text-xs sm:text-sm font-semibold text-slate-300">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-400" />
            <span>100% Safe Rides</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-amber-400" />
            <span>On-Time Guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={18} className="text-indigo-400" />
            <span>Verified Bus Operators</span>
          </div>
        </div>

      </div>
    </section>
  );
}