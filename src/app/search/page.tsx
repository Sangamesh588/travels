"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import BusCard from "@/components/BusCard";

export default function SearchPage() {
  const params = useSearchParams();

  const from = params.get("from")?.trim() || "";
  const to = params.get("to")?.trim() || "";
  const date = params.get("date") || "";

  const [buses, setBuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    async function loadBuses() {
      setLoading(true);

      try {
        console.log("================================");
        console.log("FROM:", JSON.stringify(from));
        console.log("TO:", JSON.stringify(to));
        console.log("DATE:", date);

        const response = await fetch(
  `/api/search-buses?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
);

console.log("URL:", response.url);
console.log("STATUS:", response.status);

const data = await response.json();

console.log("SEARCH RESULTS =", data);

setBuses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Catch Error:", err);
        setBuses([]);
      }

      setLoading(false);
    }

    if (from && to) {
      loadBuses();
    } else {
      setLoading(false);
    }
  }, [from, to, date]);

  // Format date display
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Select Date";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      {/* Search Header Banner */}
      <header className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Route & Journey Details */}
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
                <span>Bus Search Results</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight flex items-center gap-3">
                <span className="capitalize">{from || "Origin"}</span>
                <span className="text-indigo-400">→</span>
                <span className="capitalize">{to || "Destination"}</span>
              </h1>
              <div className="flex items-center gap-4 mt-3 text-slate-300 text-sm">
                <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
                  📅 {formattedDate}
                </span>
                <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
                  🚌 Direct Service
                </span>
              </div>
            </div>

            {/* Results Count Badge */}
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/60 rounded-2xl p-4 flex items-center gap-4 min-w-[200px] justify-between md:justify-start">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                  Available Buses
                </p>
                <p className="text-3xl font-black text-amber-400">
                  {loading ? "..." : buses.length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        {/* Quick Filter Bar */}
        {!loading && buses.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm mb-6 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2">
                Filter:
              </span>
              {[
                { id: "all", label: "All Buses" },
                { id: "sleeper", label: "AC Sleeper" },
                { id: "seater", label: "Seater / Semi-Sleeper" },
                { id: "rating", label: "Top Rated (4.5+)" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    activeFilter === tab.id
                      ? "bg-indigo-950 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-500 font-medium">
              Prices include taxes & fees
            </span>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm animate-pulse flex flex-col md:flex-row justify-between gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                  <div className="flex gap-4 pt-2">
                    <div className="h-10 bg-slate-100 rounded-xl w-24"></div>
                    <div className="h-10 bg-slate-100 rounded-xl w-24"></div>
                  </div>
                </div>
                <div className="h-12 bg-slate-200 rounded-xl w-full md:w-36 self-center"></div>
              </div>
            ))}
          </div>
        ) : buses.length === 0 ? (
          /* Empty State */
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-xl mx-auto my-8 shadow-sm">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl shadow-inner">
              🚌
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              No Buses Found
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              We couldn't find any available buses running between{" "}
              <strong className="text-slate-700 capitalize">{from || "origin"}</strong>{" "}
              and <strong className="text-slate-700 capitalize">{to || "destination"}</strong>{" "}
              on {formattedDate}.
            </p>
            <div className="inline-flex gap-3">
              <button
                onClick={() => window.history.back()}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl transition shadow-sm"
              >
                Modify Search
              </button>
            </div>
          </div>
        ) : (
          /* Bus List */
          <div className="space-y-4">
            {buses.map((bus) => (
              <BusCard key={bus.id} bus={bus} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}