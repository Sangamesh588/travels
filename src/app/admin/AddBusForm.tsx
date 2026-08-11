"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Bus,
  MapPin,
  Calendar,
  Clock,
  IndianRupee,
  Hash,
  Armchair,
  Layers,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  CalendarDays,
} from "lucide-react";

export interface BusFormState {
  bus_name: string;
  bus_type: string;
  total_seats: number;
  registration_number: string;
  source: string;
  destination: string;
  fare: number;
  departure_time: string;
  arrival_time: string;
  journey_date: string;
  available_days: string;
}

const initialFormState: BusFormState = {
  bus_name: "",
  bus_type: "AC Sleeper (2+1)",
  total_seats: 72,
  registration_number: "",
  source: "",
  destination: "",
  fare: 850,
  departure_time: "",
  arrival_time: "",
  journey_date: "",
  available_days: "Daily",
};

export default function AddBusForm({ onBusAdded }: { onBusAdded?: () => void }) {
  const [form, setForm] = useState<BusFormState>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const updateField = (field: keyof BusFormState, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatusMsg(null);

    if (
      !form.bus_name ||
      !form.source ||
      !form.destination ||
      !form.journey_date ||
      !form.departure_time ||
      !form.arrival_time
    ) {
      setStatusMsg({
        type: "error",
        text: "Please fill in all required fields marked with *",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("buses")
        .insert([
          {
            ...form,
            total_seats: Number(form.total_seats),
            fare: Number(form.fare),
            is_active: true,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setStatusMsg({
        type: "success",
        text: `Bus "${data.bus_name}" added successfully!`,
      });

      // Reset form
      setForm(initialFormState);

      if (onBusAdded) onBusAdded();
    } catch (error: any) {
      setStatusMsg({
        type: "error",
        text: error.message || "Failed to add bus to database.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl max-w-3xl mx-auto text-white">
      {/* Card Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
        <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
          <Bus size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold">Register New Bus</h2>
          <p className="text-xs text-slate-400">
            Configure vehicle specifications, route details, and schedules
          </p>
        </div>
      </div>

      {/* Notification Banner */}
      {statusMsg && (
        <div
          className={`mb-6 p-4 rounded-2xl border text-xs font-medium flex items-center gap-3 ${
            statusMsg.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-rose-500/10 border-rose-500/20 text-rose-400"
          }`}
        >
          {statusMsg.type === "success" ? (
            <CheckCircle2 size={18} className="shrink-0" />
          ) : (
            <AlertCircle size={18} className="shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Row 1: Bus Name & Registration Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Bus Name <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Bus size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="e.g. Royal Express Volvo"
                value={form.bus_name}
                onChange={(e) => updateField("bus_name", e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Registration Number
            </label>
            <div className="relative">
              <Hash size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="e.g. KA 01 F 1234"
                value={form.registration_number}
                onChange={(e) => updateField("registration_number", e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all uppercase"
              />
            </div>
          </div>
        </div>

        {/* Row 2: Bus Type & Total Seats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Bus Type
            </label>
            <div className="relative">
              <Layers size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
              <select
                value={form.bus_type}
                onChange={(e) => updateField("bus_type", e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
              >
                <option value="AC Sleeper (2+1)">AC Sleeper (2+1)</option>
                <option value="Non-AC Sleeper (2+1)">Non-AC Sleeper (2+1)</option>
                <option value="AC Seater (2+2)">AC Seater (2+2)</option>
                <option value="Volvo Multi-Axle AC">Volvo Multi-Axle AC</option>
                <option value="Standard Non-AC">Standard Non-AC</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Total Capacity (Seats)
            </label>
            <div className="relative">
              <Armchair size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="number"
                value={form.total_seats}
                onChange={(e) => updateField("total_seats", e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Row 3: Source, Destination, Fare */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Source City <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3.5 top-3.5 text-emerald-400" />
              <input
                type="text"
                placeholder="e.g. Bengaluru"
                value={form.source}
                onChange={(e) => updateField("source", e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Destination City <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3.5 top-3.5 text-amber-400" />
              <input
                type="text"
                placeholder="e.g. Hyderabad"
                value={form.destination}
                onChange={(e) => updateField("destination", e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Ticket Fare (₹)
            </label>
            <div className="relative">
              <IndianRupee size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="number"
                placeholder="850"
                value={form.fare}
                onChange={(e) => updateField("fare", e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Row 4: Departure Time, Arrival Time, Journey Date */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Departure Time <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Clock size={16} className="absolute left-3.5 top-3.5 text-emerald-400" />
              <input
                type="time"
                value={form.departure_time}
                onChange={(e) => updateField("departure_time", e.target.value)}
                className="w-full pl-10 pr-2 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all [color-scheme:dark]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Arrival Time <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Clock size={16} className="absolute left-3.5 top-3.5 text-amber-400" />
              <input
                type="time"
                value={form.arrival_time}
                onChange={(e) => updateField("arrival_time", e.target.value)}
                className="w-full pl-10 pr-2 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all [color-scheme:dark]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Journey Date <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Calendar size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="date"
                value={form.journey_date}
                onChange={(e) => updateField("journey_date", e.target.value)}
                className="w-full pl-10 pr-2 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all [color-scheme:dark]"
              />
            </div>
          </div>
        </div>

        {/* Row 5: Available Days Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">
            Frequency / Operational Days
          </label>
          <div className="relative">
            <CalendarDays size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
            <select
              value={form.available_days}
              onChange={(e) => updateField("available_days", e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
            >
              <option value="Daily">Daily</option>
              <option value="Weekdays (Mon-Fri)">Weekdays (Mon-Fri)</option>
              <option value="Weekends (Sat-Sun)">Weekends (Sat-Sun)</option>
              <option value="Mon, Wed, Fri">Mon, Wed, Fri</option>
              <option value="Tue, Thu, Sat">Tue, Thu, Sat</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Saving Bus to Database...</span>
            </>
          ) : (
            <>
              <Plus size={16} />
              <span>Add Bus Route</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}