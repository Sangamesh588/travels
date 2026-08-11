"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import {
  Ticket,
  User,
  Phone,
  IndianRupee,
  Calendar,
  Loader2,
  Armchair,
  RefreshCw,
  Search,
  Trash2,
  Download,
  Bus,
  FileText,
  ArrowRight,
  Route,
  AlertCircle,
} from "lucide-react";

export interface Booking {
  id: string | number;
  passenger_name: string;
  seat_number: string;
  phone: string;
  amount: number;
  gender?: string;
  age?: number;
  email?: string;
  payment_status?: string;
  bus_number?: string;
  bus_name?: string;
  created_at?: string;
  boarding_point?: string;
  drop_point?: string;
  distance_km?: number;
}

// Utility function to escape dynamic HTML strings for safe window printing
function escapeHtml(str: string | undefined | null): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedBus, setSelectedBus] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching bookings:", error);
        setErrorMessage("Failed to fetch bookings. Please try again.");
      } else {
        setBookings(data || []);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setErrorMessage("An unexpected error occurred while loading bookings.");
    } finally {
      setLoading(false);
    }
  };

  // Delete Booking
  const handleDeleteBooking = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this booking record?")) return;

    setDeletingId(id);
    try {
      const { error } = await supabase.from("bookings").delete().eq("id", id);
      if (error) throw error;

      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err: any) {
      console.error("Delete error:", err);
      alert(err.message || "Failed to delete booking record.");
    } finally {
      setDeletingId(null);
    }
  };

  // Extract unique bus numbers for filter dropdowns
  const uniqueBuses = useMemo(() => {
    return Array.from(
      new Set(bookings.map((b) => b.bus_number).filter(Boolean))
    ) as string[];
  }, [bookings]);

  // Extract unique months for filter dropdowns
  const uniqueMonths = useMemo(() => {
    return Array.from(
      new Set(
        bookings
          .map((b) => (b.created_at ? b.created_at.substring(0, 7) : null))
          .filter(Boolean)
      )
    ) as string[];
  }, [bookings]);

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return bookings.filter((b) => {
      const matchesSearch =
        !query ||
        b.passenger_name?.toLowerCase().includes(query) ||
        b.seat_number?.toLowerCase().includes(query) ||
        b.phone?.includes(query) ||
        b.bus_number?.toLowerCase().includes(query) ||
        b.boarding_point?.toLowerCase().includes(query) ||
        b.drop_point?.toLowerCase().includes(query);

      const matchesGender =
        selectedGender === "all" ||
        b.gender?.toLowerCase() === selectedGender.toLowerCase();

      const matchesBus =
        selectedBus === "all" || b.bus_number === selectedBus;

      const matchesMonth =
        selectedMonth === "all" ||
        (b.created_at && b.created_at.startsWith(selectedMonth));

      return matchesSearch && matchesGender && matchesBus && matchesMonth;
    });
  }, [bookings, searchQuery, selectedGender, selectedBus, selectedMonth]);

  // Calculate Total Revenue
  const totalRevenue = useMemo(() => {
    return filteredBookings.reduce(
      (sum, b) => sum + (Number(b.amount) || 0),
      0
    );
  }, [filteredBookings]);

  // Generate & Download Single Ticket PDF/Print
  const handleDownloadSingleTicket = (b: Booking) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const formattedDate = b.created_at
      ? new Date(b.created_at).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "N/A";

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Bus Ticket - ${escapeHtml(b.passenger_name)}</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; background: #f8fafc; color: #0f172a; }
            .ticket-card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 2px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
            .header { background: #4f46e5; color: white; padding: 24px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
            .header p { margin: 4px 0 0; opacity: 0.8; font-size: 13px; }
            .body { padding: 30px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px dashed #e2e8f0; padding-bottom: 12px; }
            .label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; letter-spacing: 0.5px; }
            .value { font-size: 15px; font-weight: 700; color: #0f172a; margin-top: 4px; }
            .badge { background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 20px; font-weight: 800; font-size: 14px; display: inline-block; }
            .route-box { background: #f1f5f9; padding: 12px 16px; border-radius: 12px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; }
            .footer { background: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b; }
            @media print {
              body { background: white; padding: 0; }
              .ticket-card { border: 1px solid #000; box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="ticket-card">
            <div class="header">
              <h1>BUS RESERVATION TICKET</h1>
              <p>Confirmed Booking Receipt</p>
            </div>
            <div class="body">
              
              <div class="route-box">
                <div>
                  <div class="label">Boarding Point</div>
                  <div class="value" style="color: #4f46e5;">${escapeHtml(b.boarding_point) || "Source"}</div>
                </div>
                <div style="font-size: 18px; font-weight: bold; color: #94a3b8;">→</div>
                <div style="text-align: right;">
                  <div class="label">Drop Point</div>
                  <div class="value" style="color: #4f46e5;">${escapeHtml(b.drop_point) || "Destination"}</div>
                </div>
              </div>

              <div class="row">
                <div>
                  <div class="label">Passenger Name</div>
                  <div class="value">${escapeHtml(b.passenger_name) || "N/A"}</div>
                </div>
                <div>
                  <div class="label">Seat Number</div>
                  <div class="value"><span class="badge">${escapeHtml(b.seat_number)}</span></div>
                </div>
              </div>

              <div class="row">
                <div>
                  <div class="label">Gender / Age</div>
                  <div class="value">${escapeHtml((b.gender || "N/A").toUpperCase())} / ${b.age ? b.age + " yrs" : "N/A"}</div>
                </div>
                <div>
                  <div class="label">Phone Number</div>
                  <div class="value">${escapeHtml(b.phone) || "N/A"}</div>
                </div>
              </div>

              <div class="row">
                <div>
                  <div class="label">Bus Number / Details</div>
                  <div class="value">${escapeHtml(b.bus_number || b.bus_name) || "Standard Express"}</div>
                </div>
                <div>
                  <div class="label">Distance</div>
                  <div class="value">${b.distance_km ? b.distance_km + " KM" : "N/A"}</div>
                </div>
              </div>

              <div class="row" style="border-bottom: none; margin-bottom: 0;">
                <div>
                  <div class="label">Booking Date</div>
                  <div class="value">${formattedDate}</div>
                </div>
                <div>
                  <div class="label">Total Amount Paid</div>
                  <div class="value" style="font-size: 20px; color: #4f46e5;">₹${b.amount}</div>
                </div>
              </div>
            </div>
            <div class="footer">
              Thank you for traveling with us! Please present this ticket upon boarding.
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Generate & Download Summary PDF/Report
  const handleDownloadReport = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const reportTitle =
      selectedMonth !== "all"
        ? `Monthly Booking Report - ${escapeHtml(selectedMonth)}`
        : "All Bookings Summary Report";

    const rows = filteredBookings
      .map(
        (b, idx) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${idx + 1}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${escapeHtml(b.passenger_name)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${escapeHtml(b.seat_number)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${escapeHtml(b.bus_number) || "N/A"}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${escapeHtml(b.boarding_point) || "N/A"} → ${escapeHtml(b.drop_point) || "N/A"}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${escapeHtml(b.phone)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #16a34a;">₹${b.amount}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${
          b.created_at ? new Date(b.created_at).toLocaleDateString("en-IN") : "N/A"
        }</td>
      </tr>
    `
      )
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${reportTitle}</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 30px; color: #0f172a; }
            .header { border-bottom: 2px solid #4f46e5; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
            .header h1 { margin: 0; font-size: 22px; color: #4f46e5; }
            .stats { display: flex; gap: 20px; margin-bottom: 24px; background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0; }
            .stat-box { flex: 1; }
            .stat-box .title { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; }
            .stat-box .val { font-size: 20px; font-weight: 800; color: #0f172a; margin-top: 4px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th { background: #f1f5f9; padding: 10px; text-align: left; font-weight: bold; color: #475569; border-bottom: 2px solid #cbd5e1; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>${reportTitle}</h1>
              <p style="margin: 4px 0 0; font-size: 12px; color: #64748b;">Generated on: ${new Date().toLocaleDateString("en-IN")}</p>
            </div>
          </div>

          <div class="stats">
            <div class="stat-box">
              <div class="title">Total Passengers</div>
              <div class="val">${filteredBookings.length}</div>
            </div>
            <div class="stat-box">
              <div class="title">Total Revenue</div>
              <div class="val" style="color: #16a34a;">₹${totalRevenue}</div>
            </div>
            <div class="stat-box">
              <div class="title">Bus Filter</div>
              <div class="val">${selectedBus === "all" ? "All Buses" : escapeHtml(selectedBus)}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Passenger</th>
                <th>Seat</th>
                <th>Bus No</th>
                <th>Route (Boarding → Drop)</th>
                <th>Phone</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                Admin Panel
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              All Passenger Bookings
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage, filter, delete, and download reservation statements with route stops
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleDownloadReport}
              disabled={filteredBookings.length === 0}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Download size={15} />
              Export PDF / Report
            </button>

            <button
              type="button"
              onClick={loadBookings}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? "animate-spin text-amber-400" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* Search, Filters & Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <Search size={16} className="absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              aria-label="Search bookings"
              placeholder="Search passenger, seat, city, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Gender Filter */}
          <div className="relative">
            <select
              aria-label="Filter by Gender"
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-200 outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">Gender: All</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Bus Number Filter */}
          <div className="relative">
            <select
              aria-label="Filter by Bus Number"
              value={selectedBus}
              onChange={(e) => setSelectedBus(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-200 outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">Bus Number: All</option>
              {uniqueBuses.map((busNo) => (
                <option key={busNo} value={busNo}>
                  {busNo}
                </option>
              ))}
            </select>
          </div>

          {/* Month Filter */}
          <div className="relative">
            <select
              aria-label="Filter by Month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-200 outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">Month: All</option>
              {uniqueMonths.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Total Passengers</span>
            <span className="text-xl font-extrabold text-amber-400">{filteredBookings.length}</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Total Revenue</span>
            <span className="text-xl font-extrabold text-emerald-400">₹{totalRevenue}</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Active Filters</span>
            <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20 truncate max-w-[180px]">
              {[
                selectedGender !== "all" && selectedGender,
                selectedBus !== "all" && `Bus: ${selectedBus}`,
                selectedMonth !== "all" && `Month: ${selectedMonth}`,
              ]
                .filter(Boolean)
                .join(" • ") || "None"}
            </span>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
            <p className="text-sm font-medium text-slate-400">Loading bookings list...</p>
          </div>
        ) : errorMessage ? (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-3xl p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
            <p className="text-sm font-medium text-rose-300">{errorMessage}</p>
            <button
              onClick={loadBookings}
              className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-12 text-center space-y-3">
            <div className="w-12 h-12 bg-slate-800 text-slate-500 rounded-2xl flex items-center justify-center mx-auto">
              <Ticket size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-300">No Bookings Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery || selectedGender !== "all" || selectedBus !== "all" || selectedMonth !== "all"
                ? "No records match your selected filter criteria."
                : "There are currently no seats reserved in the system."}
            </p>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800/80 rounded-3xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                    <th className="py-4 px-6">Passenger Details</th>
                    <th className="py-4 px-6">Route & Stops</th>
                    <th className="py-4 px-6">Seat & Bus</th>
                    <th className="py-4 px-6">Contact Info</th>
                    <th className="py-4 px-6">Amount</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Date</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800/60">
                  {filteredBookings.map((b) => (
                    <tr
                      key={b.id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Passenger Name & Details */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0">
                            <User size={18} />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-100">
                              {b.passenger_name || "N/A"}
                            </p>
                            {(b.gender || b.age) && (
                              <p className="text-[11px] text-slate-500 capitalize">
                                {[b.gender, b.age ? `${b.age} yrs` : null]
                                  .filter(Boolean)
                                  .join(" • ")}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Route & Intermediate Stops */}
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-xs text-slate-200">
                            <span className="text-amber-400">{b.boarding_point || "Source"}</span>
                            <ArrowRight size={12} className="text-slate-500" />
                            <span className="text-amber-400">{b.drop_point || "Destination"}</span>
                          </div>
                          {b.distance_km && (
                            <p className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                              <Route size={11} className="text-indigo-400" />
                              {b.distance_km} KM
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Seat & Bus Number */}
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-extrabold bg-amber-400/10 text-amber-400 border border-amber-400/20">
                            <Armchair size={13} />
                            {b.seat_number}
                          </span>
                          {b.bus_number && (
                            <p className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                              <Bus size={11} className="text-slate-500" />
                              {b.bus_number}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-4 px-6">
                        <div className="space-y-0.5 text-xs">
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <Phone size={12} className="text-slate-500" />
                            <span>{b.phone || "N/A"}</span>
                          </div>
                          {b.email && (
                            <p className="text-[11px] text-slate-500 truncate max-w-[180px]">
                              {b.email}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Amount Paid */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-0.5 font-bold text-slate-100">
                          <IndianRupee size={13} className="text-emerald-400" />
                          <span>{b.amount}</span>
                        </div>
                      </td>

                      {/* Payment Status Badge */}
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {b.payment_status || "Confirmed"}
                        </span>
                      </td>

                      {/* Booking Date */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Calendar size={12} />
                          <span>
                            {b.created_at
                              ? new Date(b.created_at).toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* Actions: Download Single Ticket & Delete */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleDownloadSingleTicket(b)}
                            title="Download Ticket PDF"
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                          >
                            <FileText size={15} />
                          </button>

                          <button
                            type="button"
                            disabled={deletingId === b.id}
                            onClick={() => handleDeleteBooking(b.id)}
                            title="Delete Record"
                            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all disabled:opacity-50 cursor-pointer"
                          >
                            {deletingId === b.id ? (
                              <Loader2 size={15} className="animate-spin" />
                            ) : (
                              <Trash2 size={15} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}