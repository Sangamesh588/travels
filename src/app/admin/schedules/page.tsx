"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Calendar,
  Clock,
  Bus,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Trash2,
  UserCheck,
  CalendarDays,
} from "lucide-react";

export interface BusOption {
  id: number | string;
  bus_name: string;
  source: string;
  destination: string;
  fare: number;
  is_active?: boolean;
}

export interface Schedule {
  id?: number | string;
  bus_id: number | string;
  bus_name?: string;
  source?: string;
  destination?: string;
  journey_date: string;
  departure_time: string;
  arrival_time: string;
  driver_name?: string;
  status: "Scheduled" | "In-Transit" | "Completed" | "Cancelled";
  created_at?: string;
}

export default function SchedulePage() {
  const [buses, setBuses] = useState<BusOption[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  // Form States
  const [selectedBusId, setSelectedBusId] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [driverName, setDriverName] = useState("");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    setFetching(true);
    await Promise.all([fetchBuses(), fetchSchedules()]);
    setFetching(false);
  };

  // Fetch only active buses from Supabase
  const fetchBuses = async () => {
    try {
      const { data, error } = await supabase
        .from("buses")
        .select("*")
        .eq("is_active", true);

      if (error) throw error;
      setBuses(data || []);
    } catch (err: any) {
      console.error("Error fetching buses:", err.message);
    }
  };

  const fetchSchedules = async () => {
    try {
      wait supabase
        .from("schedules")
        .select("*,const { data, error } = a buses(bus_name, source, destination)")
        .order("journey_date", { ascending: true });

      if (error) throw error;

      // Format response to include bus relation details
      const formatted = (data || []).map((item: any) => ({
        ...item,
        bus_name: item.buses?.bus_name || item.bus_name || "Unknown Bus",
        source: item.buses?.source || item.source || "N/A",
        destination: item.buses?.destination || item.destination || "N/A",
      }));

      setSchedules(formatted);
    } catch (err: any) {
      console.error("Error fetching schedules:", err.message);
    }
  };

  const createSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!selectedBusId || !travelDate || !departureTime || !arrivalTime) {
      setStatusMsg({ type: "error", text: "Please fill in all required fields." });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("schedules")
        .insert([
          {
            bus_id: selectedBusId,
            journey_date: travelDate,
            departure_time: departureTime,
            arrival_time: arrivalTime,
            driver_name: driverName || "Unassigned",
            status: "Scheduled",
          },
        ]);

      if (error) throw error;

      setStatusMsg({ type: "success", text: "Schedule created successfully!" });

      // Reset form
      setSelectedBusId("");
      setTravelDate("");
      setDepartureTime("");
      setArrivalTime("");
      setDriverName("");

      fetchSchedules();
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to create schedule." });
    } finally {
      setLoading(false);
    }
  };

  const deleteSchedule = async (id: number | string) => {
    if (!confirm("Are you sure you want to cancel and remove this schedule?")) return;

    try {
      const { error } = await supabase.from("schedules").delete().eq("id", id);
      if (error) throw error;
      setSchedules((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      alert("Failed to delete schedule: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="pb-6 border-b border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              Operations
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Schedule Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Assign dates, departure times, and crew members to active bus routes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Add Schedule Form */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Calendar size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold">New Trip Schedule</h2>
                <p className="text-xs text-slate-400">Set route timings and travel dates</p>
              </div>
            </div>

            {/* Notification Banner */}
            {statusMsg && (
              <div
                className={`mb-5 p-3.5 rounded-2xl border text-xs font-medium flex items-center gap-2.5 ${
                  statusMsg.type === "success"
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                }`}
              >
                {statusMsg.type === "success" ? (
                  <CheckCircle2 size={16} className="shrink-0" />
                ) : (
                  <AlertCircle size={16} className="shrink-0" />
                )}
                <span>{statusMsg.text}</span>
              </div>
            )}

            <form onSubmit={createSchedule} className="space-y-4">
              {/* Select Bus */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Select Active Bus / Route</label>
                <div className="relative">
                  <Bus size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
                  <select
                    value={selectedBusId}
                    onChange={(e) => setSelectedBusId(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">-- Choose a Bus ({buses.length} Active) --</option>
                    {buses.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.bus_name} ({b.source} → {b.destination})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Travel Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Travel Date</label>
                <div className="relative">
                  <CalendarDays size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Timing Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Departure</label>
                  <div className="relative">
                    <Clock size={16} className="absolute left-3.5 top-3.5 text-emerald-400" />
                    <input
                      type="time"
                      value={departureTime}
                      onChange={(e) => setDepartureTime(e.target.value)}
                      className="w-full pl-10 pr-2 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Arrival</label>
                  <div className="relative">
                    <Clock size={16} className="absolute left-3.5 top-3.5 text-amber-400" />
                    <input
                      type="time"
                      value={arrivalTime}
                      onChange={(e) => setArrivalTime(e.target.value)}
                      className="w-full pl-10 pr-2 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all [color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>

              {/* Driver / Crew Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Driver Name (Optional)</label>
                <div className="relative">
                  <UserCheck size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Kumar"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Publishing Schedule...</span>
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    <span>Add Schedule</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Active Schedules List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Calendar size={18} className="text-amber-400" />
                Scheduled Trips ({schedules.length})
              </h2>
            </div>

            {fetching ? (
              <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-7 h-7 animate-spin text-amber-400" />
                <p className="text-xs font-medium text-slate-400">Loading schedules...</p>
              </div>
            ) : schedules.length === 0 ? (
              <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-10 text-center space-y-2">
                <Calendar size={32} className="mx-auto text-slate-600" />
                <p className="text-sm font-semibold text-slate-300">No active schedules</p>
                <p className="text-xs text-slate-500">Fill out the form on the left to schedule a new trip.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {schedules.map((s) => (
                  <div
                    key={s.id}
                    className="bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-4 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center justify-center">
                          <Bus size={16} />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-100 text-sm">{s.bus_name}</h3>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <span className="text-emerald-400">{s.source}</span>
                            <span>→</span>
                            <span className="text-amber-400">{s.destination}</span>
                          </div>
                        </div>
                      </div>

                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {s.status}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 font-medium text-slate-300">
                          <CalendarDays size={13} className="text-slate-500" />
                          {s.journey_date}
                        </span>
                        <span className="flex items-center gap-1.5 font-medium text-slate-300">
                          <Clock size={13} className="text-slate-500" />
                          {s.departure_time} - {s.arrival_time}
                        </span>
                      </div>

                      {s.id && (
                        <button
                          type="button"
                          onClick={() => deleteSchedule(s.id!)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                          title="Delete schedule"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}