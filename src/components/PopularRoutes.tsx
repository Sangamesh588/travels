"use client";

import Link from "next/link";
import { ArrowRight, Bus, Clock, Sparkles } from "lucide-react";
import { routes } from "@/data/routes";

export default function PopularRoutes() {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3.5 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-900/50 shadow-2xs">
              <Sparkles size={13} className="text-amber-500" />
              <span>Top Destinations</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-3.5 tracking-tight">
              Popular Routes
            </h2>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md leading-relaxed">
            Explore our most requested travel corridors with guaranteed daily departures and comfortable buses.
          </p>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {routes.map((route, idx) => {
            const searchUrl = `/search?from=${encodeURIComponent(
              route.from
            )}&to=${encodeURIComponent(route.to)}`;

            return (
              <Link
                key={route.to + idx}
                href={searchUrl}
                className="
                  group
                  relative
                  bg-white dark:bg-slate-900
                  border
                  border-slate-200/80 dark:border-slate-800
                  rounded-2xl
                  p-5
                  shadow-xs
                  hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5
                  hover:-translate-y-1.5
                  hover:border-indigo-300 dark:hover:border-indigo-500/50
                  transition-all
                  duration-300
                  flex
                  flex-col
                  justify-between
                "
              >
                <div>
                  {/* Bus Icon & Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                      <Bus size={19} />
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center gap-1">
                      Book Now 
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>

                  {/* Cities Flow */}
                  <div className="space-y-1.5">
                    <h3 className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                      {route.from}
                    </h3>

                    <div className="flex items-center gap-2 py-1">
                      <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0" />
                      <div className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800" />
                      <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 shrink-0">to</span>
                      <div className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800" />
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    </div>

                    <h3 className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                      {route.to}
                    </h3>
                  </div>
                </div>

                {/* Price Tag Footer */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Clock size={13} className="text-indigo-500" />
                    Daily Service
                  </span>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block -mb-0.5">
                      Starting from
                    </span>
                    <span className="text-lg font-black text-slate-950 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      ₹{route.price}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}