"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

import {
  Bus,
  Ticket,
  Calendar,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  IndianRupee,
  Loader2,
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBuses: 0,
    totalBookings: 0,
    totalSchedules: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      // Fetch counts in parallel
      const [busesRes, bookingsRes, schedulesRes] = await Promise.all([
        supabase.from("buses").select("id", { count: "exact", head: true }),
        supabase.from("bookings").select("amount"),
        supabase.from("schedules").select("id", { count: "exact", head: true }),
      ]);

      const revenue = (bookingsRes.data || []).reduce(
        (acc, b) => acc + (Number(b.amount) || 0),
        0
      );

      setStats({
        totalBuses: busesRes.count || 0,
        totalBookings: bookingsRes.data?.length || 0,
        totalSchedules: schedulesRes.count || 0,
        totalRevenue: revenue,
      });
    } catch (err) {
      console.error("Error loading dashboard metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="pb-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 flex items-center gap-1.5 w-fit">
                <ShieldCheck size={12} /> System Admin
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Control Panel
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Monitor network operations, bus fleets, and passenger reservations
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold transition-all"
            >
              Back to Main Site
            </Link>
          </div>
        </div>

        {/* Analytics Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Total Fleet</span>
              <Bus size={18} className="text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-white">
              {loading ? <Loader2 size={20} className="animate-spin text-amber-400" /> : stats.totalBuses}
            </div>
            <p className="text-[11px] text-slate-500">Active operational buses</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Total Bookings</span>
              <Ticket size={18} className="text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white">
              {loading ? <Loader2 size={20} className="animate-spin text-amber-400" /> : stats.totalBookings}
            </div>
            <p className="text-[11px] text-slate-500">Seats reserved by passengers</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Trips Scheduled</span>
              <Calendar size={18} className="text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white">
              {loading ? <Loader2 size={20} className="animate-spin text-amber-400" /> : stats.totalSchedules}
            </div>
            <p className="text-[11px] text-slate-500">Active upcoming journeys</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Estimated Revenue</span>
              <TrendingUp size={18} className="text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 flex items-center">
              <IndianRupee size={20} />
              {loading ? <Loader2 size={20} className="animate-spin text-amber-400 ml-1" /> : stats.totalRevenue.toLocaleString("en-IN")}
            </div>
            <p className="text-[11px] text-slate-500">Total booking earnings</p>
          </div>
        </div>

        {/* Dashboard Navigation Cards */}
        <div>
          <h2 className="text-lg font-bold mb-4 text-slate-200">Management Modules</h2>
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Manage Buses Card */}
            <Link
              href="/admin/buses"
              className="group bg-slate-900 border border-slate-800/80 hover:border-indigo-500/50 rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Bus size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white group-hover:text-indigo-400 transition-colors">
                    Manage Buses
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Add new buses, define routes, configure seating pricing, and manage operational vehicles.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 group-hover:translate-x-1 transition-transform">
                <span>Configure Fleet</span>
                <ArrowRight size={14} />
              </div>
            </Link>

            {/* View Bookings Card */}
            <Link
              href="/admin/bookings"
              className="group bg-slate-900 border border-slate-800/80 hover:border-amber-500/50 rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Ticket size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white group-hover:text-amber-400 transition-colors">
                    Passenger Bookings
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    View complete reservation logs, search passengers, verify contact numbers, and track payments.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                <span>View All Tickets</span>
                <ArrowRight size={14} />
              </div>
            </Link>

            {/* Manage Schedules Card */}
            <Link
              href="/admin/schedules"
              className="group bg-slate-900 border border-slate-800/80 hover:border-emerald-500/50 rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white group-hover:text-emerald-400 transition-colors">
                    Manage Schedules
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Set up trip timetables, assign travel dates, specify arrival/departure times, and assign drivers.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
                <span>Update Timetables</span>
                <ArrowRight size={14} />
              </div>
            </Link>

          </div>
        </div>

      </div>
    </div>
  );
}