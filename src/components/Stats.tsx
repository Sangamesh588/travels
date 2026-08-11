"use client";

import { ComponentType } from "react";
import { Users, Route, Bus, Headphones, LucideProps } from "lucide-react";

export interface StatItem {
  icon: ComponentType<LucideProps>;
  value: string;
  label: string;
  description: string;
}

interface StatsProps {
  items?: StatItem[];
}

const defaultStats: StatItem[] = [
  {
    icon: Users,
    value: "10K+",
    label: "Happy Travelers",
    description: "Passengers transported safely to their destinations.",
  },
  {
    icon: Route,
    value: "50+",
    label: "Daily Routes",
    description: "Connecting major Karnataka cities and hubs.",
  },
  {
    icon: Bus,
    value: "25+",
    label: "Luxury Fleet",
    description: "Premium AC Sleepers and Volvo buses.",
  },
  {
    icon: Headphones,
    value: "24/7",
    label: "Live Support",
    description: "Dedicated assistance before and during travel.",
  },
];

export default function Stats({ items = defaultStats }: StatsProps) {
  return (
    <section className="py-16 bg-slate-950 relative overflow-hidden">
      {/* Background ambient light blur */}
      <div 
        aria-hidden="true" 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label || idx}
                className="
                  bg-slate-900/80
                  backdrop-blur-md
                  border
                  border-slate-800
                  rounded-2xl
                  p-6
                  sm:p-8
                  text-center
                  hover:border-indigo-500/40
                  hover:-translate-y-1
                  transition-all
                  duration-200
                  flex
                  flex-col
                  items-center
                  justify-between
                  shadow-lg
                  group
                "
              >
                {/* Icon Container */}
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-amber-400 flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors">
                  <Icon size={24} />
                </div>

                {/* Stat Content */}
                <div className="flex flex-col items-center">
                  <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    {stat.value}
                  </h2>

                  <p className="font-bold text-sm text-indigo-300 mt-1">
                    {stat.label}
                  </p>

                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}