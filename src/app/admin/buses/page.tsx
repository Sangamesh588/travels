"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  Bus,
  Plus,
  Trash2,
  Loader2,
  ShieldAlert,
  CheckCircle2,
  X,
  MapPin,
  Clock,
  Route,
  Pencil,
} from "lucide-react";

export interface BusData {
  id: string | number;
  bus_name: string;
  registration_number: string;
  source: string;
  destination: string;
  departure_time: string;
  arrival_time: string;
  pickup_time?: string;
  fare_per_km: number;
  total_distance_km: number;
  created_at?: string;
}

export interface StopData {
  id?: string | number;
  bus_id: string | number;
  city_name: string;
  distance_from_source: number;
  pickup_time: string;
}

export default function BusManagement() {
  const [cities, setCities] = useState<any[]>([]);
  const [buses, setBuses] = useState<BusData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingBus, setEditingBus] = useState<BusData | null>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  // Stop Management States
  const [isStopsModalOpen, setIsStopsModalOpen] = useState<boolean>(false);
  const [selectedBusForStops, setSelectedBusForStops] = useState<BusData | null>(null);
  const [stops, setStops] = useState<StopData[]>([]);
  const [loadingStops, setLoadingStops] = useState<boolean>(false);
  const [isAddingStop, setIsAddingStop] = useState<boolean>(false);

  const [newStopData, setNewStopData] = useState({
    city_name: "",
    distance_from_source: "",
    pickup_time: "",
  });

  // Form state mapped directly to Database columns
  const [formData, setFormData] = useState({
    bus_name: "",
    registration_number: "",
    arrival_time: "",
    source: "",
    destination: "",
    departure_time: "",
    pickup_time: "",
    fare_per_km: "",
    total_distance_km: "",
  });

  const fetchBuses = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("buses")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setBuses(data || []);
    } catch (err: any) {
      console.error("FULL ERROR:", err);
      setError(
        err?.message ||
        err?.error_description ||
        "Failed to load buses."
      );
    } fontally: {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    const response = await supabase.from("cities").select("*");
    if (!response.error) {
      setCities(response.data || []);
    }
  };

  useEffect(() => {
    fetchBuses();
    fetchCities();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddBus = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const arrivalVal = formData.arrival_time || formData.pickup_time || "";

      const payload = {
        bus_name: formData.bus_name.trim(),
        registration_number: formData.registration_number.trim(),
        source: formData.source.trim(),
        destination: formData.destination.trim(),
        departure_time: formData.departure_time,
        arrival_time: arrivalVal,
        pickup_time: arrivalVal,
        fare_per_km: Number(formData.fare_per_km) || 0,
        total_distance_km: Number(formData.total_distance_km) || 0,
      };

      const { data, error: insertError } = await supabase
        .from("buses")
        .insert([payload])
        .select();

      if (insertError) throw insertError;

      const newBus = data ? data[0] : null;

      if (newBus) {
        // Auto-add source and destination as initial pickup points
        await supabase.from("pickup_points").insert([
          {
            bus_id: newBus.id,
            city_name: newBus.source,
            distance_from_source: 0,
            pickup_time: newBus.departure_time,
          },
          {
            bus_id: newBus.id,
            city_name: newBus.destination,
            distance_from_source: newBus.total_distance_km || 0,
            pickup_time: newBus.arrival_time || newBus.pickup_time,
          },
        ]);

        setBuses((prev) => [newBus, ...prev]);
      } else {
        await fetchBuses();
      }

      setSuccessMessage("Bus and initial route stops created successfully!");
      setIsAddModalOpen(false);
      resetFormData();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error("Error adding bus:", err);
      setError(err.message || "Failed to add bus.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (bus: BusData) => {
    setEditingBus(bus);

    setFormData({
      bus_name: bus.bus_name,
      registration_number: bus.registration_number || "",
      source: bus.source,
      destination: bus.destination,
      departure_time: bus.departure_time,
      arrival_time: bus.arrival_time || bus.pickup_time || "",
      pickup_time: bus.pickup_time || bus.arrival_time || "",
      fare_per_km: String(bus.fare_per_km),
      total_distance_km: String(bus.total_distance_km),
    });

    setIsEditModalOpen(true);
  };

  const handleUpdateBus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBus) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const arrivalVal = formData.arrival_time || formData.pickup_time || "";

      const payload = {
        bus_name: formData.bus_name.trim(),
        registration_number: formData.registration_number.trim(),
        source: formData.source.trim(),
        destination: formData.destination.trim(),
        departure_time: formData.departure_time,
        arrival_time: arrivalVal,
        pickup_time: arrivalVal,
        fare_per_km: Number(formData.fare_per_km) || 0,
        total_distance_km: Number(formData.total_distance_km) || 0,
      };

      const { error } = await supabase
        .from("buses")
        .update(payload)
        .eq("id", editingBus.id);

      if (error) throw error;

      await fetchBuses();

      setSuccessMessage("Bus updated successfully!");
      setIsEditModalOpen(false);
      resetFormData();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setError(err.message || "Failed to update bus.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBus = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this bus?")) return;

    setDeletingId(id);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from("buses")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      setBuses((prev) => prev.filter((bus) => bus.id !== id));
      setSuccessMessage("Bus deleted successfully!");
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error("Error deleting bus:", err);
      setError(err.message || "Failed to delete bus.");
    } finally {
      setDeletingId(null);
    }
  };

  const resetFormData = () => {
    setFormData({
      arrival_time: "",
      bus_name: "",
      registration_number: "",
      source: "",
      destination: "",
      departure_time: "",
      pickup_time: "",
      fare_per_km: "",
      total_distance_km: "",
    });
  };

  // --- STOP MANAGEMENT HANDLERS ---
  const handleOpenStopsModal = async (bus: BusData) => {
    setSelectedBusForStops(bus);
    setIsStopsModalOpen(true);
    fetchStops(bus.id);
  };

  const fetchStops = async (busId: string | number) => {
    setLoadingStops(true);
    try {
      const { data, error: stopsError } = await supabase
        .from("pickup_points")
        .select("*")
        .eq("bus_id", busId)
        .order("distance_from_source", { ascending: true });

      if (stopsError) throw stopsError;
      setStops(data || []);
    } catch (err: any) {
      console.error("Error fetching stops:", err);
      setError(err.message || "Failed to load route stops.");
    } finally {
      setLoadingStops(false);
    }
  };

  const handleAddStop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBusForStops) return;

    setIsAddingStop(true);
    try {
      const payload = {
        bus_id: selectedBusForStops.id,
        city_name: newStopData.city_name.trim(),
        distance_from_source: Number(newStopData.distance_from_source) || 0,
        pickup_time: newStopData.pickup_time,
      };

      const { data, error: stopInsertError } = await supabase
        .from("pickup_points")
        .insert([payload])
        .select();

      if (stopInsertError) throw stopInsertError;

      if (data) {
        setStops((prev) =>
          [...prev, data[0]].sort(
            (a, b) => a.distance_from_source - b.distance_from_source
          )
        );
      }

      setNewStopData({ city_name: "", distance_from_source: "", pickup_time: "" });
    } catch (err: any) {
      console.error("Error adding stop:", err);
      setError(err.message || "Failed to add route stop.");
    } finally {
      setIsAddingStop(false);
    }
  };

  const handleDeleteStop = async (stopId: string | number) => {
    try {
      const { error: deleteError } = await supabase
        .from("pickup_points")
        .delete()
        .eq("id", stopId);

      if (deleteError) throw deleteError;

      setStops((prev) => prev.filter((s) => s.id !== stopId));
    } catch (err: any) {
      console.error("Error deleting stop:", err);
      setError(err.message || "Failed to delete route stop.");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 text-slate-800 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Admin Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
              Manage Buses & Route Stops
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Add new bus schedules, distance rates, and intermediate pickup/drop points.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              resetFormData();
              setIsAddModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Plus size={18} />
            Add New Bus
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert size={18} className="text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-rose-500 hover:text-rose-700">
              <X size={16} />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage(null)} className="text-emerald-500 hover:text-emerald-700">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Bus List */}
        {loading ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200/80 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 size={32} className="animate-spin text-indigo-600" />
            <span className="text-xs font-medium">Loading bus listings...</span>
          </div>
        ) : buses.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200/80 text-center space-y-3">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
              <Bus size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Buses Available</h3>
            <p className="text-xs text-slate-500">Click "Add New Bus" above to list your first bus route.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {buses.map((bus) => (
              <div
                key={bus.id}
                className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-300 transition-all"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                      <Bus size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{bus.bus_name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-mono font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-600 border border-slate-200">
                          {bus.registration_number}
                        </span>
                        <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded border border-indigo-100">
                          ₹{bus.fare_per_km}/km • {bus.total_distance_km} KM
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600 pt-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-indigo-600" />
                      <span><strong>From:</strong> {bus.source}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-rose-500" />
                      <span><strong>To:</strong> {bus.destination}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="text-amber-500" />
                      <span><strong>Dep:</strong> {bus.departure_time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="text-emerald-500" />
                      <span><strong>Arr:</strong> {bus.arrival_time || bus.pickup_time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
                  <button
                    type="button"
                    onClick={() => handleOpenStopsModal(bus)}
                    className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all text-xs font-bold cursor-pointer flex items-center gap-1.5"
                  >
                    <Route size={16} />
                    <span>Manage Stops</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleEditClick(bus)}
                    className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 transition-all text-xs font-bold cursor-pointer flex items-center gap-1.5"
                  >
                    <Pencil size={16} />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    disabled={deletingId === bus.id}
                    onClick={() => handleDeleteBus(bus.id)}
                    className="p-2.5 rounded-xl text-rose-600 hover:bg-rose-50 hover:border-rose-200 border border-transparent transition-all disabled:opacity-50 flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                  >
                    {deletingId === bus.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ADD BUS MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative flex flex-col max-h-[90vh]">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                <Bus size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Add New Bus Route</h3>
                <p className="text-xs text-slate-500">Enter bus info, route locations, distance, and rates</p>
              </div>
            </div>

            <form onSubmit={handleAddBus} className="flex-1 overflow-y-auto pr-1 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Bus Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="bus_name"
                    placeholder="e.g. Royal Travels Express"
                    value={formData.bus_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:border-indigo-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Registration Number *
                  </label>
                  <input
                    type="text"
                    required
                    name="registration_number"
                    placeholder="e.g. KA-01-F-1234"
                    value={formData.registration_number}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:border-indigo-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Source (From) *
                  </label>
                  <select
                    name="source"
                    required
                    value={formData.source}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:border-indigo-600 outline-none"
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.city_name}>
                        {city.city_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Destination (To) *
                  </label>
                  <select
                    name="destination"
                    required
                    value={formData.destination}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:border-indigo-600 outline-none"
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.city_name}>
                        {city.city_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Departure Time *
                  </label>
                  <input
                    type="time"
                    required
                    name="departure_time"
                    value={formData.departure_time}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:border-indigo-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Arrival Time *
                  </label>
                  <input
                    type="time"
                    required
                    name="arrival_time"
                    value={formData.arrival_time}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:border-indigo-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Fare Per KM (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    name="fare_per_km"
                    placeholder="1.5"
                    value={formData.fare_per_km}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:border-indigo-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Total Distance (KM) *
                  </label>
                  <input
                    type="number"
                    required
                    name="total_distance_km"
                    placeholder="700"
                    value={formData.total_distance_km}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:border-indigo-600 outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : "Save & Add Bus"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT BUS MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative flex flex-col max-h-[90vh]">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                <Pencil size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Edit Bus Details</h3>
                <p className="text-xs text-slate-500">Update schedule, route info, distance, and fare rates</p>
              </div>
            </div>

            <form onSubmit={handleUpdateBus} className="flex-1 overflow-y-auto pr-1 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Bus Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="bus_name"
                    value={formData.bus_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:border-indigo-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Registration Number *
                  </label>
                  <input
                    type="text"
                    required
                    name="registration_number"
                    value={formData.registration_number}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:border-indigo-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Source (From) *
                  </label>
                  <select
                    name="source"
                    required
                    value={formData.source}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:border-indigo-600 outline-none"
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.city_name}>
                        {city.city_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Destination (To) *
                  </label>
                  <select
                    name="destination"
                    required
                    value={formData.destination}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:border-indigo-600 outline-none"
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.city_name}>
                        {city.city_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Departure Time *
                  </label>
                  <input
                    type="time"
                    required
                    name="departure_time"
                    value={formData.departure_time}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:border-indigo-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Arrival Time *
                  </label>
                  <input
                    type="time"
                    required
                    name="arrival_time"
                    value={formData.arrival_time}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:border-indigo-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Fare Per KM (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    name="fare_per_km"
                    value={formData.fare_per_km}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:border-indigo-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Total Distance (KM) *
                  </label>
                  <input
                    type="number"
                    required
                    name="total_distance_km"
                    value={formData.total_distance_km}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:border-indigo-600 outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : "Update Bus"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANAGE ROUTE STOPS MODAL */}
      {isStopsModalOpen && selectedBusForStops && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative flex flex-col max-h-[90vh]">
            <button
              type="button"
              onClick={() => setIsStopsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                <Route size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Manage Route Stops ({selectedBusForStops.bus_name})
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedBusForStops.source} → {selectedBusForStops.destination}
                </p>
              </div>
            </div>

            {/* Add Stop Form */}
            <form onSubmit={handleAddStop} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-4 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Add Intermediate Stop
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <select
                  required
                  value={newStopData.city_name}
                  onChange={(e) => setNewStopData({ ...newStopData, city_name: e.target.value })}
                  className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:border-indigo-600 outline-none"
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.city_name}>
                      {city.city_name}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  required
                  placeholder="Dist from Source (KM)"
                  value={newStopData.distance_from_source}
                  onChange={(e) => setNewStopData({ ...newStopData, distance_from_source: e.target.value })}
                  className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:border-indigo-600 outline-none"
                />

                <input
                  type="time"
                  required
                  value={newStopData.pickup_time}
                  onChange={(e) => setNewStopData({ ...newStopData, pickup_time: e.target.value })}
                  className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:border-indigo-600 outline-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isAddingStop}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  {isAddingStop ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  Add Stop
                </button>
              </div>
            </form>

            {/* Stops List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {loadingStops ? (
                <div className="flex justify-center py-6 text-slate-400">
                  <Loader2 size={24} className="animate-spin" />
                </div>
              ) : stops.length === 0 ? (
                <p className="text-center text-xs text-slate-400 py-6">No route stops configured yet.</p>
              ) : (
                stops.map((stop) => (
                  <div
                    key={stop.id}
                    className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-indigo-600" />
                      <span className="font-bold text-slate-900">{stop.city_name}</span>
                      <span className="text-slate-400">• {stop.distance_from_source} KM</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-slate-600">{stop.pickup_time}</span>
                      <button
                        type="button"
                        onClick={() => stop.id && handleDeleteStop(stop.id)}
                        className="text-rose-600 hover:text-rose-800 p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}