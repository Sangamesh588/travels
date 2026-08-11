"use client";

import { useEffect, useState, useRef } from "react";
import { MapPin, Search, X } from "lucide-react";
import { cities } from "@/data/citied";

export default function RouteSearch() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch available routes
  useEffect(() => {
    fetch("/api/routes")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRoutes(data);
        }
      })
      .catch((err) => console.error("Failed to fetch routes:", err));
  }, []);

  // Handle clicking outside to dismiss dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Extract unique cities safely
  console.log("Cities State:", cities);
  const filtered = cities.filter((city) =>
    city
      .toLowerCase()
      .includes(query.trim().toLowerCase())
  );

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input Field Wrapper */}
      <div className="relative flex items-center">
        <MapPin
          size={18}
          className="absolute left-4 text-indigo-600 dark:text-indigo-400 pointer-events-none transition-colors"
        />

        <input
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          placeholder="Search city or route..."
          className="
            w-full
            pl-11
            pr-10
            py-3.5
            bg-white dark:bg-slate-900
            rounded-xl
            border
            border-slate-300 dark:border-slate-700
            text-slate-900 dark:text-slate-100
            font-medium
            placeholder:text-slate-400 dark:placeholder:text-slate-500
            outline-none
            transition-all
            duration-200
            focus:border-indigo-600 dark:focus:border-indigo-500
            focus:ring-2
            focus:ring-indigo-100 dark:focus:ring-indigo-950/60
            shadow-xs
          "
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setOpen(true);
            }}
            className="absolute right-3.5 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Clear input"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Suggestion Dropdown */}
      {open && (
        <div
          className="
            absolute
            top-full
            left-0
            w-full
            bg-white dark:bg-slate-900
            rounded-xl
            shadow-xl shadow-slate-900/10 dark:shadow-black/40
            mt-1.5
            z-50
            overflow-hidden
            border
            border-slate-200 dark:border-slate-800
            max-h-60
            overflow-y-auto
            divide-y
            divide-slate-100 dark:divide-slate-800/60
            animate-in fade-in slide-in-from-top-2 duration-150
          "
        >
          {filtered.length > 0 ? (
            filtered.map((city) => (
              <div
                key={city}
                onClick={() => {
                  setQuery(city);
                  setOpen(false);
                }}
                className="
                  group
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  cursor-pointer
                  hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40
                  transition-colors
                "
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 border border-indigo-100 dark:border-indigo-900/40 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-200">
                  <Search size={14} />
                </div>

                <span className="text-slate-800 dark:text-slate-200 font-semibold text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {city}
                </span>
              </div>
            ))
          ) : (
            <div className="px-4 py-4 text-slate-400 dark:text-slate-500 text-sm italic text-center">
              No matching routes found
            </div>
          )}
        </div>
      )}
    </div>
  );
}