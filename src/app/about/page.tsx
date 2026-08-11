"use client";

import {
  Bus,
  ShieldCheck,
  Clock,
  Award,
  Users,
  MapPin,
  Sparkles,
  PhoneCall,
  Heart,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Shield,
  Zap,
} from "lucide-react";

export default function AboutPage() {
  const stats = [
    { label: "Passengers Served", value: "500K+", icon: Users, accent: "from-amber-500/20 to-orange-500/10" },
    { label: "Active Routes", value: "120+", icon: MapPin, accent: "from-indigo-500/20 to-blue-500/10" },
    { label: "On-Time Arrival Rate", value: "98.5%", icon: Clock, accent: "from-emerald-500/20 to-teal-500/10" },
    { label: "Years of Trust", value: "15+", icon: Award, accent: "from-rose-500/20 to-pink-500/10" },
  ];

  const coreValues = [
    {
      title: "Safety First",
      description:
        "Every vehicle in our fleet undergoes rigorous safety checks before every journey. Trained, certified drivers ensure your peace of mind.",
      icon: ShieldCheck,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 group-hover:border-emerald-500/40",
      glow: "group-hover:shadow-emerald-500/10",
    },
    {
      title: "Punctuality & Reliability",
      description:
        "We respect your time. Real-time GPS tracking and optimized route scheduling guarantee minimal delays and predictable departures.",
      icon: Clock,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20 group-hover:border-indigo-500/40",
      glow: "group-hover:shadow-indigo-500/10",
    },
    {
      title: "Premium Comfort",
      description:
        "Ergonomic sleeper berths, individual climate control, sanitized linens, and onboard amenities designed for long-distance luxury.",
      icon: Bus,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20 group-hover:border-amber-500/40",
      glow: "group-hover:shadow-amber-500/10",
    },
    {
      title: "Customer Centricity",
      description:
        "From transparent fare policies to 24/7 dedicated support assistance, every step of your journey with us is effortless.",
      icon: Heart,
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20 group-hover:border-rose-500/40",
      glow: "group-hover:shadow-rose-500/10",
    },
  ];

  const fleetHighlights = [
    "Multi-Axle Volvo & Scania AC Sleeper Coaches",
    "GPS Live Tracking & Speed Governor Integration",
    "Sanitized Bedding, Personal Charging Ports & Reading Lights",
    "Regular Driver Shift Rotations & Automated Safety Audits",
  ];

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-8 overflow-hidden">
      {/* Background Lighting & Glow Effects */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto space-y-16 py-8">
        {/* Header Hero Section */}
        <div className="text-center space-y-5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-amber-400/30 text-amber-400 text-xs font-semibold uppercase tracking-widest backdrop-blur-md shadow-lg shadow-amber-500/5 transition-all hover:border-amber-400/50">
            <Sparkles size={14} className="animate-pulse text-amber-400" />
            <span>Redefining Intercity Travel</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            About{" "}
            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 bg-clip-text text-transparent">
              Shakuntala Travels
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-xl leading-relaxed font-normal max-w-2xl mx-auto">
            Connecting cities, families, and businesses across India with safe,
            punctual, and premium sleeper bus services. Your journey is our highest priority.
          </p>
        </div>

        {/* Key Metrics Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={idx}
                className="group relative bg-slate-900/60 backdrop-blur-md border border-slate-800/80 hover:border-slate-700 rounded-2xl p-6 text-center space-y-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-b ${stat.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
                <div className="relative w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 text-amber-400 mx-auto flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:border-amber-400/40 transition-transform duration-300">
                  <IconComponent size={22} />
                </div>
                <div className="relative text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="relative text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Story Section */}
        <div className="relative bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-2xl shadow-slate-950/50">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest">
              <TrendingUp size={14} />
              <span>Our Journey</span>
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-snug">
              Over a Decade of Trust on the Highway
            </h2>
            
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Founded with a vision to transform regional passenger transport,{" "}
              <strong className="text-amber-400 font-semibold">Shakuntala Travels</strong> has grown from a single route operator into one of the region’s most trusted fleet services. We combine modern multi-axle AC sleeper coaches with state-of-the-art safety features to guarantee maximum security and relaxation.
            </p>
            
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Whether you are travelling for business, university, or family holidays, our meticulously maintained fleet and courteous staff ensure every kilometer feels effortless.
            </p>
          </div>

          <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 space-y-5 shadow-inner">
            <h3 className="font-bold text-base sm:text-lg text-white border-b border-slate-800/80 pb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Bus className="text-amber-400" size={20} />
                <span>Fleet Highlights</span>
              </span>
              <span className="text-[10px] uppercase font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                Premium Fleet
              </span>
            </h3>

            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-300">
              {fleetHighlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-3 group">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="leading-snug">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Why Travel With Us?
            </h2>
            <p className="text-slate-400 text-xs sm:text-base max-w-xl mx-auto">
              Our core commitments that define every single route we operate.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, idx) => {
              const IconComponent = value.icon;
              return (
                <div
                  key={idx}
                  className={`group relative bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${value.glow} flex flex-col justify-between`}
                >
                  <div className="space-y-4">
                    <div
                      className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${value.color}`}
                    >
                      <IconComponent size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors">
                      {value.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact CTA Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-950/80 via-slate-900 to-amber-950/50 border border-slate-800/90 rounded-3xl p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-2 text-center sm:text-left relative z-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400">
              <Zap size={14} />
              <span>24/7 Dedicated Passenger Care</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Have Questions or Need Assistance?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              Our support team is available round-the-clock to assist with route schedules, boarding points, and seat reservations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0 relative z-10">
            <a
              href="tel:+911234567890"
              className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-amber-500/20"
            >
              <PhoneCall size={18} />
              <span>Contact Support</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}