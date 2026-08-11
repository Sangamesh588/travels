"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Check,
  Info,
  ShieldAlert,
  Sparkles,
  X,
  User,
  Phone,
  Mail,
  Calendar,
  UserCheck,
  Armchair,
  Loader2,
  Receipt,
} from "lucide-react";

export interface Seat {
  id?: string | number;
  seat_number: string;
  status: "available" | "booked" | "blocked";
  gender?: "male" | "female" | null;
}

export interface Bus {
  id?: string | number;
  fare?: number;
  fare_per_km: number;
total_distance_km: number;

  boarding_city?: string;
  dropping_city?: string;

  bus_name?: string;
  registration_number?: string;

  source?: string;
  destination?: string;

  departure_time?: string;
  arrival_time?: string;

  lower_single_fare?: number;
  lower_double_fare?: number;
  upper_single_fare?: number;
  upper_double_fare?: number;
}

export interface Passenger {
  phone: string;
  seatNumber: string;
  fullName: string;
  gender: "male" | "female" | "other";
  age: string;
}

export interface ContactInfo {
  primaryPhone: string;
  secondaryPhone: string;
  email: string;
}

export interface BookingPayload {
  bus: any;
  selectedSeats: string[];
  passengers: Passenger[];
  contactInfo: ContactInfo;
  totalPrice: number;
}

interface SeatLayoutProps {
  seats?: Seat[];
  bus?: Bus | null;
  gstRate?: number; // GST percentage e.g., 5 for 5%
  onProceed?: (payload: BookingPayload) => void;
}

export default function SeatLayout({
  seats = [],
  bus,
  gstRate = 5,
  onProceed,
}: SeatLayoutProps) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic Passenger List state based on selected seats
  const [passengers, setPassengers] = useState<Passenger[]>([]);

  // Shared Contact Information state
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    primaryPhone: "",
    secondaryPhone: "",
    email: "",
  });

  const safeSeats = seats || [];

  // Dynamic Fare Calculation per Seat
  const getSeatPrice = (seatNumber: string): number => {
  const farePerKm = Number(bus?.fare_per_km || 0);
  const distance = Number(bus?.total_distance_km || 0);

  const baseFare = farePerKm * distance;

  if (seatNumber.startsWith("U-D")) {
    return Math.round(baseFare * 1.00);
  }

  if (seatNumber.startsWith("U-S")) {
    return Math.round(baseFare * 1.10);
  }

  if (seatNumber.startsWith("L-D")) {
    return Math.round(baseFare * 1.20);
  }

  if (seatNumber.startsWith("L-S")) {
    return Math.round(baseFare * 1.30);
  }

  return Math.round(baseFare);
};

  // Categorize seats
  const femaleSeats = safeSeats
    .filter((s) => s.status === "booked" && s.gender === "female")
    .map((s) => s.seat_number);

  const maleSeats = safeSeats
    .filter((s) => s.status === "booked" && s.gender === "male")
    .map((s) => s.seat_number);

  const bookedSeats = safeSeats
    .filter((s) => s.status === "booked" || s.status === "blocked")
    .map((s) => s.seat_number);

  // Fare & Total Calculations
  const seatCount = selectedSeats.length;

  const basePrice = selectedSeats.reduce(
    (sum, seat) => sum + getSeatPrice(seat),
    0
  );

  const gstAmount = Math.round((basePrice * gstRate) / 100);

  const totalPrice = basePrice + gstAmount;

  const toggleSeat = (seat: string) => {
    setAlertMessage(null);

    // Disable selection for already booked seats
    if (bookedSeats.includes(seat)) return;

    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
      return;
    }

    if (selectedSeats.length >= 6) {
      setAlertMessage("Maximum 6 seats allowed per booking transaction.");
      return;
    }

    setSelectedSeats([...selectedSeats, seat]);
  };

  // Open Modal and populate passengers dynamically for each seat
  const handleOpenModal = () => {
    if (selectedSeats.length === 0) return;

    const initialPassengers: Passenger[] = selectedSeats.map((seatNum) => {
      const existing = passengers.find((p) => p.seatNumber === seatNum);
      return (
        existing || {
          seatNumber: seatNum,
          fullName: "",
          gender: "male",
          age: "",
          phone: "",
        }
      );
    });

    setPassengers(initialPassengers);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handlePassengerChange = (
    index: number,
    field: keyof Passenger,
    value: string
  ) => {
    setModalError(null);
    setPassengers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleContactChange = (field: keyof ContactInfo, value: string) => {
    setModalError(null);
    const sanitizedValue =
      field === "primaryPhone" || field === "secondaryPhone"
        ? value.replace(/\D/g, "")
        : value;

    setContactInfo((prev) => ({ ...prev, [field]: sanitizedValue }));
  };

  // Process Booking & Save Local State
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validate passengers
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.fullName.trim()) {
        setModalError(`Please enter full name for Seat ${p.seatNumber}.`);
        return;
      }
      const parsedAge = parseInt(p.age, 10);
      if (!p.age || isNaN(parsedAge) || parsedAge <= 0 || parsedAge > 120) {
        setModalError(`Please enter a valid age for Seat ${p.seatNumber}.`);
        return;
      }
    }

    // 2. Validate Contact Information
    if (!/^\d{10}$/.test(contactInfo.primaryPhone)) {
      setModalError("Please enter a valid 10-digit primary mobile number.");
      return;
    }
    if (
      contactInfo.secondaryPhone &&
      !/^\d{10}$/.test(contactInfo.secondaryPhone)
    ) {
      setModalError("Please enter a valid 10-digit secondary mobile number.");
      return;
    }
    if (
      contactInfo.secondaryPhone &&
      contactInfo.primaryPhone === contactInfo.secondaryPhone
    ) {
      setModalError(
        "Secondary mobile number must be different from primary number."
      );
      return;
    }

    setIsSubmitting(true);
    setModalError(null);

    try {
      const payload: BookingPayload = {
        bus,
        selectedSeats,
        passengers,
        contactInfo,
        totalPrice,
      };

      if (onProceed) {
        onProceed(payload);
      }

      // SAVE BOOKING DATA IN LOCAL STORAGE
      localStorage.setItem("bookingData", JSON.stringify(payload));
      localStorage.setItem("booking", JSON.stringify(payload));

      // REDIRECT TO PAYMENT PAGE
      window.location.href = "/payment";
    } catch (err: any) {
      console.error("Booking error:", err);
      setModalError(
        err?.message || "Failed to confirm booking. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setSelectedSeats([]);
    setPassengers([]);
    setContactInfo({ primaryPhone: "", secondaryPhone: "", email: "" });
    window.location.reload();
  };

  const getSeatStyle = (seat: string) => {
    if (femaleSeats.includes(seat)) {
      return "bg-rose-500 border-rose-500 text-white cursor-not-allowed shadow-none";
    }
    if (maleSeats.includes(seat)) {
      return "bg-sky-500 border-sky-500 text-white cursor-not-allowed shadow-none";
    }
    if (bookedSeats.includes(seat)) {
      return "bg-slate-300 border-slate-300 text-slate-500 cursor-not-allowed shadow-none opacity-80";
    }
    if (selectedSeats.includes(seat)) {
      return "bg-indigo-600 border-indigo-600 text-white shadow-md ring-2 ring-indigo-200 scale-105";
    }
    return "bg-white border-slate-300 text-slate-700 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50/50 shadow-xs cursor-pointer";
  };

  const getPillowStyle = (seat: string) => {
    if (bookedSeats.includes(seat) || selectedSeats.includes(seat)) {
      return "border-white/50 bg-white/30";
    }
    return "border-indigo-200 bg-indigo-50/60";
  };

  const renderSeatItem = (seat: string) => {
    const isSelected = selectedSeats.includes(seat);
    const isBooked = bookedSeats.includes(seat);
    const price = getSeatPrice(seat);

    return (
      <button
        key={seat}
        type="button"
        disabled={isBooked}
        onClick={() => toggleSeat(seat)}
        title={!isBooked ? `Seat: ${seat} - ₹${price}` : undefined}
        className={`
          relative flex items-center justify-between px-2.5 py-2 w-16 h-10
          rounded-lg border text-xs font-bold transition-all duration-200
          active:scale-95
          ${getSeatStyle(seat)}
        `}
      >
        <span>{seat}</span>
        <span
          className={`w-1.5 h-5 rounded-full border transition-colors ${getPillowStyle(
            seat
          )}`}
        />
        {isSelected && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-slate-950 rounded-full flex items-center justify-center shadow-xs">
            <Check size={10} strokeWidth={3} />
          </span>
        )}
      </button>
    );
  };

  const renderDeckLayout = (prefix: string, showDriver: boolean = false) => {
    const cols = [1, 2, 3, 4, 5, 6];

    return (
      <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-6 overflow-x-auto">
        {showDriver ? (
          <div className="flex flex-col items-center gap-1 self-start pt-1">
            <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-amber-400 shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 2a8 8 0 017.75 6h-4.32a4.002 4.002 0 00-6.86 0H4.25A8 8 0 0112 4zm0 6a2 2 0 110 4 2 2 0 010-4zm-8 2c0 .7.09 1.38.25 2h4.32a4.002 4.002 0 003.43 2h.001c0 .7.2 1.37.55 1.95L9.12 20.2A7.973 7.973 0 014 12zm16 0c0 3.01-1.66 5.63-4.12 7.03l-3.43-2.25c.35-.58.55-1.25.55-1.95h.001a4.002 4.002 0 003.43-2h4.32c.16-.62.25-1.3.25-2z" />
              </svg>
            </div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Driver
            </span>
          </div>
        ) : (
          <div className="w-10" />
        )}

        <div className="flex-1 flex flex-col gap-5 min-w-[500px]">
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-2 block">
              Double Berths (2 Sleeper Seats)
            </span>
            <div className="flex gap-3">
              {cols.map((col) => {
                const topSeat = `${prefix}-D${col * 2 - 1}`;
                const bottomSeat = `${prefix}-D${col * 2}`;
                return (
                  <div
                    key={col}
                    className="flex flex-col gap-1.5 p-1.5 bg-white border border-slate-200/80 rounded-xl shadow-xs"
                  >
                    {renderSeatItem(topSeat)}
                    {renderSeatItem(bottomSeat)}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="h-4 border-b border-dashed border-slate-200 flex items-center justify-center">
            <span className="bg-slate-50 px-3 text-[10px] font-bold text-slate-400 tracking-widest uppercase">
              Gangway / Aisle
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-2 block">
              Single Berth (Solo Sleeper)
            </span>
            <div className="flex gap-3">
              {cols.map((col) => {
                const singleSeat = `${prefix}-S${col}`;
                return (
                  <div
                    key={col}
                    className="p-1.5 bg-white border border-slate-200/80 rounded-xl shadow-xs"
                  >
                    {renderSeatItem(singleSeat)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 text-slate-800 font-sans relative">
      <div className="max-w-5xl mx-auto bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-slate-200/80">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Seat Selection
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
              Select Your Sleeper Berths
            </h2>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            <Info size={14} className="text-indigo-600" />
            <span>Click any available seat to select</span>
          </div>
        </div>

        {/* Validation Warning */}
        {alertMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-2">
            <ShieldAlert size={16} className="text-amber-600 flex-shrink-0" />
            <span>{alertMessage}</span>
          </div>
        )}

        {/* Lower & Upper Decks */}
        <div className="space-y-8 mb-8">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              Lower Deck
            </h3>
            {renderDeckLayout("L", true)}
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              Upper Deck
            </h3>
            {renderDeckLayout("U", false)}
          </div>
        </div>

        {/* Legend */}
        <div className="mb-8 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-3">
            Seat Category Legend
          </span>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-white border border-slate-400" />
              Available
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-600 text-white shadow-xs">
              <Check size={12} /> Selected
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-300 text-slate-600">
              Booked
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-sky-500 text-white">
              Booked (Male)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-rose-500 text-white">
              Booked (Female)
            </span>
          </div>
        </div>

        {/* Price Breakdown & Selected Summary Banner */}
        <div className="bg-slate-950 text-white p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 w-full md:w-auto text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="text-xs text-slate-400 font-medium">
                Selected Berths:
              </span>
              <span className="text-sm font-extrabold text-amber-400">
                {selectedSeats.length
                  ? selectedSeats
                      .map((seat) => `${seat} (₹${getSeatPrice(seat)})`)
                      .join(", ")
                  : "None"}
              </span>
            </div>

            <div className="text-xs text-slate-400 flex items-center justify-center md:justify-start gap-4">
              <span>
                Seats Selected:{" "}
                <strong className="text-white">{seatCount} / 6</strong>
              </span>
              <span>
                Base Fare: <strong className="text-white">₹{basePrice}</strong>
              </span>
              <span>
                GST ({gstRate}%):{" "}
                <strong className="text-white">₹{gstAmount}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-slate-800 pt-4 md:pt-0">
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                Grand Total Amount
              </span>
              <span className="text-2xl sm:text-3xl font-black text-amber-400">
                ₹{totalPrice}
              </span>
            </div>

            <button
              type="button"
              disabled={selectedSeats.length === 0}
              onClick={handleOpenModal}
              className={`
                px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2
                ${
                  selectedSeats.length > 0
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md active:scale-95 cursor-pointer"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }
              `}
            >
              <Sparkles size={16} />
              Proceed to Pay
            </button>
          </div>
        </div>
      </div>

      {/* DYNAMIC PASSENGER DETAILS MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
            {/* Close Modal Button */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors z-10 disabled:opacity-50"
            >
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4 pb-2 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                <UserCheck size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Passenger & Contact Details
                </h3>
                <p className="text-xs text-slate-500">
                  Fill details for {passengers.length} passenger
                  {passengers.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Validation / Database Error Alert */}
            {modalError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 flex-shrink-0">
                <ShieldAlert size={16} className="text-rose-600 flex-shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            {/* Form Scrollable Area */}
            <form
              onSubmit={handleFormSubmit}
              className="flex-1 overflow-y-auto pr-1 space-y-6"
            >
              {/* Dynamic Passenger Sections */}
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">
                  Passenger Details ({passengers.length})
                </span>

                {passengers.map((p, idx) => (
                  <div
                    key={p.seatNumber}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                      <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                        <Armchair size={14} className="text-indigo-600" />
                        Passenger {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200">
                        Seat: {p.seatNumber} (₹{getSeatPrice(p.seatNumber)})
                      </span>
                    </div>

                    {/* Full Name */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User
                          size={15}
                          className="absolute left-3 top-2.5 text-slate-400"
                        />
                        <input
                          type="text"
                          required
                          placeholder="e.g. John Doe"
                          value={p.fullName}
                          disabled={isSubmitting}
                          onChange={(e) =>
                            handlePassengerChange(idx, "fullName", e.target.value)
                          }
                          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all disabled:bg-slate-100"
                        />
                      </div>
                    </div>

                    {/* Gender & Age */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                          Gender *
                        </label>
                        <select
                          value={p.gender}
                          disabled={isSubmitting}
                          onChange={(e) =>
                            handlePassengerChange(
                              idx,
                              "gender",
                              e.target.value as any
                            )
                          }
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all disabled:bg-slate-100"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                          Age *
                        </label>
                        <div className="relative">
                          <Calendar
                            size={15}
                            className="absolute left-3 top-2.5 text-slate-400"
                          />
                          <input
                            type="number"
                            required
                            min="1"
                            max="120"
                            placeholder="28"
                            value={p.age}
                            disabled={isSubmitting}
                            onChange={(e) =>
                              handlePassengerChange(idx, "age", e.target.value)
                            }
                            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all disabled:bg-slate-100"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shared Contact Info Section */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block border-b border-slate-200/60 pb-2">
                  Contact Details (Ticket Delivery)
                </span>

                {/* Primary Mobile */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Primary Mobile Number *
                  </label>
                  <div className="relative">
                    <Phone
                      size={15}
                      className="absolute left-3 top-2.5 text-slate-400"
                    />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="9876543210"
                      value={contactInfo.primaryPhone}
                      disabled={isSubmitting}
                      onChange={(e) =>
                        handleContactChange("primaryPhone", e.target.value)
                      }
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all disabled:bg-slate-100"
                    />
                  </div>
                </div>

                {/* Secondary Mobile */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Secondary Mobile Number{" "}
                    <span className="text-slate-400 font-normal">
                      (Optional)
                    </span>
                  </label>
                  <div className="relative">
                    <Phone
                      size={15}
                      className="absolute left-3 top-2.5 text-slate-400"
                    />
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="9123456789"
                      value={contactInfo.secondaryPhone}
                      disabled={isSubmitting}
                      onChange={(e) =>
                        handleContactChange("secondaryPhone", e.target.value)
                      }
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all disabled:bg-slate-100"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Email Address{" "}
                    <span className="text-slate-400 font-normal">
                      (Optional)
                    </span>
                  </label>
                  <div className="relative">
                    <Mail
                      size={15}
                      className="absolute left-3 top-2.5 text-slate-400"
                    />
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={contactInfo.email}
                      disabled={isSubmitting}
                      onChange={(e) =>
                        handleContactChange("email", e.target.value)
                      }
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all disabled:bg-slate-100"
                    />
                  </div>
                </div>
              </div>

              {/* Itemized Price Summary in Modal */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5 mb-1">
                  <Receipt size={14} className="text-indigo-600" />
                  Fare & Tax Breakdown
                </span>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>
                    Base Price ({seatCount} seat{seatCount > 1 ? "s" : ""}):
                  </span>
                  <span className="font-semibold text-slate-800">
                    ₹{basePrice}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>GST ({gstRate}%):</span>
                  <span className="font-semibold text-slate-800">
                    ₹{gstAmount}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-indigo-200/80">
                  <span>Total Payable:</span>
                  <span className="text-indigo-600">₹{totalPrice}</span>
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-2 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-2 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-md active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Booking...
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      Confirm & Proceed
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-md w-full p-6 text-center space-y-4 border border-slate-200 shadow-2xl">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Check size={24} strokeWidth={3} />
            </div>
            <h3 className="text-xl font-bold">Booking Confirmed!</h3>
            <p className="text-xs text-slate-500">
              Your seats have been reserved successfully.
            </p>
            <button
              type="button"
              onClick={handleCloseSuccessModal}
              className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Close & Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  );
}