"use client";

import {
  Wifi,
  MapPinned,
  BatteryCharging,
  ShieldCheck,
  Clock,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
}

export default function Features() {
  const features: FeatureItem[] = [
    {
      icon: Wifi,
      title: "High-Speed 5G WiFi",
      description:
        "Stay connected throughout your journey with uninterrupted ultra-fast onboard internet.",
      badge: "Free",
    },
    {
      icon: MapPinned,
      title: "Live GPS Tracking",
      description:
        "Track bus location in real-time and share precise ETA updates with family.",
      badge: "Realtime",
    },
    {
      icon: BatteryCharging,
      title: "Power at Every Seat",
      description:
        "Dedicated AC outlets and USB-C fast charging ports available for all passengers.",
    },
    {
      icon: ShieldCheck,
      title: "Safety First Guarantee",
      description:
        "Verified professional drivers, CCTV surveillance, and 24/7 emergency support.",
      badge: "Verified",
    },
  ];

  return (
    <section className="relative py-16 sm:py-24 bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors">
      {/* Ambient background glow */}
      <div
        className="aria-hidden:true absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/60 px-3.5 py-1.5 rounded-full shadow-2xs">
            <Sparkles size={14} className="text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
              Premium Amenities
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mt-4 tracking-tight">
            Why Travel With Us
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg mt-3 leading-relaxed">
            Experience first-class comfort, safety, and modern conveniences
            engineered into every single trip.
          </p>
        </div>

        {/* Features Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="
                  group relative
                  bg-white dark:bg-slate-900
                  border border-slate-200/80 dark:border-slate-800
                  p-6 rounded-2xl
                  shadow-2xs hover:shadow-xl hover:shadow-indigo-500/5
                  hover:border-indigo-200 dark:hover:border-indigo-800
                  hover:-translate-y-1.5
                  transition-all duration-300 ease-out
                  flex flex-col justify-between
                "
              >
                <div>
                  {/* Top Row: Icon + Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white dark:group-hover:bg-indigo-600 transition-all duration-300 shadow-2xs">
                      <Icon size={22} />
                    </div>

                    {feature.badge && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                        {feature.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Bottom decorative subtle indicator line */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                  <Clock size={12} className="text-slate-400" />
                  <span>Available on all routes</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}