"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Bus,
  MapPin,
  Ticket,
  Calendar,
  Home,
  Printer,
  User,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Phone,
} from "lucide-react";

export default function SuccessPage() {
  const [booking, setBooking] = useState<any>(null);
  const [bookingId, setBookingId] = useState<string>("");

  useEffect(() => {
    // Generate a random booking reference ID
    const randomId = "BUS" + Math.floor(100000 + Math.random() * 900000);
    setBookingId(randomId);

    // Retrieve saved booking details
    const savedBooking = localStorage.getItem("booking");
    if (savedBooking) {
      try {
        setBooking(JSON.parse(savedBooking));
      } catch (err) {
        console.error("Error reading booking details:", err);
      }
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 text-slate-800 font-sans flex items-center justify-center">
      <div className="max-w-xl w-full mx-auto space-y-6">
        
        {/* Success Header Card */}
        <div className="bg-white p-8 rounded-3xl shadow-xs border border-slate-200/80 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full ring-8 ring-emerald-50">
            <CheckCircle2 size={36} />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100 mb-2">
              <Sparkles size={12} />
              Payment Verified
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Booking Confirmed!
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Your ticket has been generated successfully. Safe travels!
            </p>
          </div>
        </div>

        {/* Dynamic Digital Ticket Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden relative">
          
          {/* Ticket Header */}
          <div className="bg-indigo-600 p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                <Bus size={20} />
              </div>
              <div>
                <h2 className="font-bold text-base">
                  {booking?.bus?.bus_name || "Express Bus Service"}
                </h2>
                <span className="text-xs text-indigo-200 font-mono">
                  {booking?.bus?.registration_number || "REG-CONFIRMED"}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-200 block">
                Booking ID
              </span>
              <span className="font-mono font-bold text-sm bg-indigo-700/60 px-2.5 py-1 rounded-lg border border-indigo-500/30">
                #{bookingId}
              </span>
            </div>
          </div>

          {/* Route Info */}
          <div className="p-6 bg-slate-50/50 space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/60 shadow-2xs">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Origin
                </span>
                <div className="flex items-center gap-1.5 text-slate-900 font-bold text-sm">
                  <MapPin size={16} className="text-indigo-600" />
                  <span>{booking?.bus?.source || "Source City"}</span>
                </div>
              </div>

              <div className="flex flex-col items-center px-4">
                <div className="flex items-center gap-1 text-slate-300">
                  <span className="w-6 h-[2px] bg-slate-200"></span>
                  <ArrowRight size={14} className="text-indigo-600" />
                  <span className="w-6 h-[2px] bg-slate-200"></span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 mt-0.5">Direct Route</span>
              </div>

              <div className="space-y-0.5 text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Destination
                </span>
                <div className="flex items-center justify-end gap-1.5 text-slate-900 font-bold text-sm">
                  <span>{booking?.bus?.destination || "Destination City"}</span>
                  <MapPin size={16} className="text-rose-500" />
                </div>
              </div>
            </div>

            {/* Ticket Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/60 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1">
                  <User size={12} className="text-indigo-600" /> Passenger
                </span>
                <p className="font-bold text-slate-800 text-sm truncate">
                  {booking?.passengers?.[0]?.fullName || "Passenger Name"}
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  {booking?.passengers?.[0]?.gender} {booking?.passengers?.[0]?.age ? `(${booking.passengers[0].age} yrs)` : ""}
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/60 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1">
                  <Ticket size={12} className="text-indigo-600" /> Seats Booked
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {booking?.selectedSeats && booking.selectedSeats.length > 0 ? (
                    booking.selectedSeats.map((seat: string, idx: number) => (
                      <span
                        key={idx}
                        className="bg-indigo-50 border border-indigo-100 text-indigo-700 font-mono font-bold px-2 py-0.5 rounded-md text-[11px]"
                      >
                        {seat}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 font-medium">Standard</span>
                  )}
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/60 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1">
                  <Phone size={12} className="text-emerald-600" /> Contact Number
                </span>
                <p className="font-bold text-slate-800 text-sm">
                  {booking?.contactInfo?.primaryPhone || "N/A"}
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/60 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1">
                  <ShieldCheck size={12} className="text-emerald-600" /> Total Paid
                </span>
                <p className="font-extrabold text-emerald-600 text-base">
                  ₹{booking?.totalPrice || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Ticket Cutout Divider Visual */}
          <div className="relative bg-slate-50/50 py-2">
            <div className="border-t-2 border-dashed border-slate-200 w-full"></div>
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-50 rounded-full border-r border-slate-200/80"></div>
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-50 rounded-full border-l border-slate-200/80"></div>
          </div>

          {/* Ticket Footer / Note */}
          <div className="p-4 bg-white text-center text-xs text-slate-400 font-medium">
            A SMS and Email receipt has been sent to your registered contact info.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handlePrint}
            className="w-full sm:w-1/2 py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-sm border border-slate-200 shadow-2xs transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer size={16} />
            <span>Print Ticket</span>
          </button>

          <a
            href="/"
            className="w-full sm:w-1/2 py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home size={16} />
            <span>Back to Home</span>
          </a>
        </div>

      </div>
    </div>
  );
}