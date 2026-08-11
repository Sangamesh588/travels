"use client";

import { useEffect, useState } from "react";
import {
  Bus,
  MapPin,
  User,
  Phone,
  CreditCard,
  ShieldCheck,
  Ticket,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Clock,
  Sparkles,
} from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentPage() {
  const [booking, setBooking] = useState<any>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  // Load booking details from LocalStorage
  useEffect(() => {
    const savedBooking = localStorage.getItem("booking");

    console.log("LOCAL STORAGE =", savedBooking);

    if (savedBooking) {
      try {
        setBooking(JSON.parse(savedBooking));
      } catch (err) {
        console.error("Error parsing booking data from localStorage:", err);
      }
    }
  }, []);

  // Load Razorpay Checkout SDK Script
  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => {
      console.log("RAZORPAY LOADED");
      setIsScriptLoaded(true);
    };

    script.onerror = () => {
      console.log("RAZORPAY FAILED TO LOAD");
      setIsScriptLoaded(false);
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handlePayment = () => {
    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded yet. Please check your internet connection.");
      return;
    }

    setIsPaying(true);

    const options = {
      key: "rzp_test_TOMBkAou5WpcRX", // TEST KEY

      amount: (Number(booking?.totalPrice) || 100) * 100,

      currency: "INR",

      name: "Bus Booking",

      description: `Bus Ticket - ${booking?.bus?.bus_name || "Express Bus"}`,

      handler: function (response: any) {
        console.log("PAYMENT SUCCESS =", response);
        setIsPaying(false);

        alert(
          "Payment Successful! ✅\nPayment ID: " +
            response.razorpay_payment_id
        );

        window.location.href = "/booking-success";
      },

      modal: {
        ondismiss: function () {
          setIsPaying(false);
        },
      },

      prefill: {
        name: booking?.passengers?.[0]?.fullName || "",
        contact: booking?.contactInfo?.primaryPhone || "",
        email: booking?.contactInfo?.email || "",
      },

      theme: {
        color: "#4f46e5", // Indigo-600
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 text-slate-800 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 flex items-center gap-1.5">
                <Sparkles size={12} />
                Secure Checkout
              </span>
              <span className="text-xs font-semibold text-slate-400">Step 3 of 3</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
              Review & Pay
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Verify your journey details before completing payment via Razorpay.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 px-3.5 py-2 rounded-2xl text-xs font-bold">
            <ShieldCheck size={18} className="text-emerald-600" />
            <span>100% Encrypted Payment</span>
          </div>
        </div>

        {/* Loading State */}
        {!booking ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200/80 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 size={32} className="animate-spin text-indigo-600" />
            <span className="text-xs font-semibold">Loading booking details...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Content Column (Details) */}
            <div className="lg:col-span-2 space-y-5">
              {/* Bus & Route Card */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                      <Bus size={20} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        {booking.bus?.bus_name || "Express Bus"}
                      </h2>
                      <span className="text-xs font-mono font-semibold text-slate-500">
                        {booking.bus?.registration_number || "REG-N/A"}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                    Confirmed Ticket
                  </span>
                </div>

                {/* Route Flow */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      From
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-900 font-bold text-sm">
                      <MapPin size={16} className="text-indigo-600" />
                      <span>{booking.bus?.source || "Source"}</span>
                    </div>
                    {booking.bus?.departure_time && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                        <Clock size={12} />
                        <span>{booking.bus.departure_time}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-center justify-center px-4">
                    <div className="flex items-center gap-1 text-slate-300">
                      <span className="w-8 h-[2px] bg-slate-200"></span>
                      <ArrowRight size={16} className="text-indigo-600" />
                      <span className="w-8 h-[2px] bg-slate-200"></span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 mt-1">Direct</span>
                  </div>

                  <div className="space-y-1 text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      To
                    </span>
                    <div className="flex items-center justify-end gap-1.5 text-slate-900 font-bold text-sm">
                      <span>{booking.bus?.destination || "Destination"}</span>
                      <MapPin size={16} className="text-rose-500" />
                    </div>
                    {booking.bus?.pickup_time && (
                      <div className="flex items-center justify-end gap-1 text-[11px] text-slate-500 font-medium">
                        <Clock size={12} />
                        <span>{booking.bus.pickup_time}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Seats list */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="font-bold text-slate-600 flex items-center gap-1.5">
                    <Ticket size={16} className="text-indigo-600" />
                    Selected Seat(s):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {booking.selectedSeats && booking.selectedSeats.length > 0 ? (
                      booking.selectedSeats.map((seat: string, idx: number) => (
                        <span
                          key={idx}
                          className="bg-indigo-600 text-white font-mono font-bold px-2.5 py-0.5 rounded-lg text-xs"
                        >
                          {seat}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 font-medium">N/A</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Passenger & Contact Details Card */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 block border-b border-slate-100 pb-2">
                  Passenger & Contact Details
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Primary Passenger */}
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0 mt-0.5">
                      <User size={16} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Primary Passenger
                      </span>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">
                        {booking.passengers?.[0]?.fullName || "N/A"}
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        {booking.passengers?.[0]?.age ? `${booking.passengers[0].age} yrs` : ""}
                        {booking.passengers?.[0]?.gender ? ` • ${booking.passengers[0].gender}` : ""}
                      </p>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0 mt-0.5">
                      <Phone size={16} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Contact Information
                      </span>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">
                        {booking.contactInfo?.primaryPhone || "N/A"}
                      </p>
                      {booking.contactInfo?.email && (
                        <p className="text-xs text-slate-500 font-medium truncate max-w-[180px]">
                          {booking.contactInfo.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar Column (Payment Summary) */}
            <div className="space-y-5">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5 sticky top-6">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <CreditCard size={18} className="text-indigo-600" />
                  <h3 className="text-base font-bold text-slate-900">Fare Summary</h3>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Base Seat Fare</span>
                    <span>₹{booking.totalPrice || 0}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Taxes & Service Fee</span>
                    <span className="text-emerald-600 font-semibold">FREE</span>
                  </div>

                  <div className="border-t border-slate-100 pt-3 mt-3 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">Total Payable</span>
                    <span className="text-xl font-extrabold text-emerald-600">
                      ₹{booking.totalPrice || 0}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    disabled={isPaying || !isScriptLoaded}
                    onClick={handlePayment}
                    className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isPaying ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={18} />
                        <span>Pay ₹{booking.totalPrice || 0} Now</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 text-center space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Supported Payment Options
                  </span>
                  <p className="text-[11px] text-slate-500 font-medium">
                    UPI, Credit/Debit Cards, NetBanking, Wallets via Razorpay
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}