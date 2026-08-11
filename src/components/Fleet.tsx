"use client";

import Image from "next/image";
import { ArrowUpRight, Bus, Sparkles, ShieldCheck } from "lucide-react";

interface FleetItem {
  title: string;
  description: string;
  image: string;
  tags: string[];
  badge: string;
  specs?: string;
}

export default function Fleet() {
  const fleetItems: FleetItem[] = [
    {
      title: "Luxury AC Sleeper",
      description:
        "Spacious individual berths with orthopedic mattresses, private curtains, and noise insulation for long overnight journeys.",
      image: "/images/sleeper-bus.jpg",
      tags: ["AC Sleeper", "USB-C Ports", "Live GPS Tracking"],
      badge: "Most Popular",
      specs: "2+1 Berth Layout",
    },
    {
      title: "Premium Seater & Recliner",
      description:
        "Ergonomic executive push-back leather seats with calf support and generous legroom engineered for day trips.",
      image: "/images/interior.jpg",
      tags: ["140° Recliner", "Reading Lamp", "Foldable Tray"],
      badge: "Express",
      specs: "2+2 Executive Layout",
    },
    {
      title: "Volvo Multi-Axle AC",
      description: "Ultra-smooth electronically controlled air suspension coaches built for maximum safety and high-speed stability.",
      image: "/images/volvo-bus.jpg",
      tags: ["Air Suspension", "Free 5G WiFi", "HD Screens"],
      badge: "Flagship",
      specs: "Multi-Axle Coach",
    },
  ];

  return (
    <section className="relative py-16 sm:py-24 bg-slate-50 dark:bg-slate-950 transition-colors overflow-hidden">
      {/* Background Ambient Glow */}
      <div
        className="aria-hidden:true absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 dark:bg-indigo-500/10 blur-[140px] rounded-full pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/60 px-3.5 py-1.5 rounded-full shadow-2xs">
              <Sparkles size={14} className="text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                Modern Comfort
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mt-4 tracking-tight">
              Our Premium Fleet
            </h2>
          </div>

          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-md leading-relaxed">
            Travel onboard top-tier luxury coaches rigorously inspected and maintained to the highest safety and sanitation standards.
          </p>
        </div>

        {/* Fleet Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {fleetItems.map((item, idx) => (
            <div
              key={idx}
              className="
                group relative bg-white dark:bg-slate-900
                rounded-2xl border border-slate-200/80 dark:border-slate-800
                shadow-2xs hover:shadow-xl hover:shadow-indigo-500/5
                hover:border-indigo-200 dark:hover:border-indigo-800
                hover:-translate-y-1.5
                transition-all duration-300 ease-out
                overflow-hidden flex flex-col justify-between
              "
            >
              <div>
                {/* Image & Badge Overlay Wrapper */}
                <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />

                  {/* Gradient Overlay for Text Contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Top Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <span className="bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-400/20 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                      {item.badge}
                    </span>
                  </div>

                  {/* Bottom Image Overlay Specs */}
                  {item.specs && (
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white/90 text-xs font-medium bg-slate-950/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                      <Bus size={13} className="text-indigo-400" />
                      <span>{item.specs}</span>
                    </div>
                  )}
                </div>

                {/* Content Area */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <h3 className="font-bold text-xl text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {item.title}
                    </h3>
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center shrink-0 transition-all duration-300">
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>

                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed mb-5">
                    {item.description}
                  </p>

                  {/* Feature Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 rounded-md border border-slate-200/60 dark:border-slate-700/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Bar */}
              <div className="px-6 py-3 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <ShieldCheck size={14} /> Sanitized & Verified
                </span>
                <span className="text-indigo-600 dark:text-indigo-400 group-hover:underline cursor-pointer font-semibold">
                  View Routes →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}