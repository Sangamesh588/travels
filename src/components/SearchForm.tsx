"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CityAutocomplete from "@/components/CityAutocomplete";
import { Calendar, Search, ArrowLeftRight, AlertCircle } from "lucide-react";

export default function SearchForm() {
  const router = useRouter();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = () => {
    setErrorMessage("");

    if (!from || !to || !date) {
      setErrorMessage("Please select source, destination, and departure date.");
      return;
    }

    if (from.trim().toLowerCase() === to.trim().toLowerCase()) {
      setErrorMessage("Source and Destination cannot be the same city.");
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
    // Format to YYYY-MM-DD
    const formattedDate = targetDate.toISOString().split("T")[0];
    setDate(formattedDate);
  };

  // Date helper values for quick pill active states
  const todayISO = new Date().toISOString().split("T")[0];
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowISO = tomorrowDate.toISOString().split("T")[0];

  return (
    <div className="w-full bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl shadow-slate-200/50 dark:shadow-none backdrop-blur-xl transition-colors duration-300">
      {/* Error Feedback Banner */}
      {errorMessage && (
        <div className="mb-5 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs font-semibold flex items-center gap-2.5 shadow-2xs animate-in fade-in duration-200">
          <AlertCircle size={16} className="text-red-500 dark:text-red-400 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Search Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-center">
        {/* Source Field */}
        <div className="lg:col-span-3">
          <CityAutocomplete
            placeholder="From (Departure)"
            value={from}
            onChange={setFrom}
          />
        </div>

        {/* Swap Button Divider */}
        <div className="relative flex justify-center lg:col-span-1 my-1 lg:my-0">
          <button
            type="button"
            onClick={swapLocations}
            aria-label="Swap Locations"
            className="
              bg-amber-400 hover:bg-amber-500
              dark:bg-amber-500 dark:hover:bg-amber-400
              text-slate-950
              w-10
              h-10
              rounded-full
              shadow-md hover:shadow-lg
              transition-all
              duration-300
              flex
              items-center
              justify-center
              hover:scale-110 active:scale-95 hover:rotate-180
              z-10
              border border-amber-300 dark:border-amber-400
              cursor-pointer
            "
          >
            <ArrowLeftRight size={18} className="font-bold text-slate-950" />
          </button>
        </div>

        {/* Destination Field */}
        <div className="lg:col-span-3">
          <CityAutocomplete
            placeholder="To (Destination)"
            value={to}
            onChange={setTo}
          />
        </div>

        {/* Date Field & Quick Selectors */}
        <div className="lg:col-span-3 flex flex-col gap-2">
          <div className="relative flex items-center">
            <Calendar
              size={18}
              className="absolute left-4 text-indigo-600 dark:text-indigo-400 pointer-events-none z-10 transition-colors"
            />
            <input
              type="date"
              value={date}
              min={todayISO}
              onChange={(e) => setDate(e.target.value)}
              className="
                w-full
                pl-11
                pr-4
                py-3.5
                bg-white dark:bg-slate-900
                rounded-xl
                border
                border-slate-300 dark:border-slate-700
                text-slate-900 dark:text-slate-100
                font-medium
                outline-none
                transition-all
                duration-200
                focus:border-indigo-600 dark:focus:border-indigo-500
                focus:ring-2
                focus:ring-indigo-100 dark:focus:ring-indigo-950/60
                shadow-xs
                cursor-pointer
              "
            />
          </div>

          {/* Quick Date Pills */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setQuickDate(0)}
              className={`
                px-3 
                py-1 
                text-xs 
                font-bold 
                rounded-lg 
                border 
                transition-all
                duration-200
                cursor-pointer
                ${
                  date === todayISO
                    ? "bg-indigo-50 dark:bg-indigo-950/80 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 shadow-2xs"
                    : "bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                }
              `}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setQuickDate(1)}
              className={`
                px-3 
                py-1 
                text-xs 
                font-bold 
                rounded-lg 
                border 
                transition-all
                duration-200
                cursor-pointer
                ${
                  date === tomorrowISO
                    ? "bg-indigo-50 dark:bg-indigo-950/80 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 shadow-2xs"
                    : "bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                }
              `}
            >
              Tomorrow
            </button>
          </div>
        </div>

        {/* Submit Search Button */}
        <div className="lg:col-span-2">
          <button
            type="button"
            onClick={handleSearch}
            className="
              w-full
              py-3.5
              px-6
              bg-indigo-600 dark:bg-indigo-500
              hover:bg-indigo-700 dark:hover:bg-indigo-600
              text-white
              font-extrabold
              rounded-xl
              shadow-md shadow-indigo-500/20 dark:shadow-none
              hover:shadow-lg hover:shadow-indigo-500/30
              transition-all
              duration-200
              flex
              items-center
              justify-center
              gap-2
              active:scale-98
              cursor-pointer
            "
          >
            <Search size={18} />
            <span>Search</span>
          </button>
        </div>
      </div>
    </div>
  );
}