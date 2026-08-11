"use client";

import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MessageSquare,
  Building,
  Sparkles,
} from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("General Inquiry");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!name || !email || !message) {
      setStatusMsg({
        type: "error",
        text: "Please fill in all required fields.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "YOUR_WEB3FORMS_ACCESS_KEY", // Replace with your key from web3forms.com
          name,
          email,
          phone,
          subject,
          message,
          from_name: "Shakuntala Travels Contact Form",
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatusMsg({
          type: "success",
          text: "Thank you for reaching out! Your message has been sent directly to our email.",
        });

        // Reset form fields
        setName("");
        setEmail("");
        setPhone("");
        setSubject("General Inquiry");
        setMessage("");
      } else {
        throw new Error(result.message || "Failed to send message.");
      }
    } catch (err: any) {
      setStatusMsg({
        type: "error",
        text: err.message || "Something went wrong. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const contactDetails = [
    {
      title: "Call Us",
      value: "+91 98765 43210",
      subtext: "Mon - Sun: 24/7 Available",
      href: "tel:+919876543210",
      icon: Phone,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Email Support",
      value: "support@shakuntalatravels.com",
      subtext: "Response within 2-4 hours",
      href: "mailto:support@shakuntalatravels.com",
      icon: Mail,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      title: "Head Office",
      value: "Majestic Bus Terminus, Bengaluru",
      subtext: "Karnataka, India - 560009",
      href: "https://maps.google.com",
      icon: MapPin,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-10 py-6">
        {/* Header Hero Section */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-400/10 border border-indigo-400/20 text-indigo-400 text-xs font-bold uppercase tracking-widest">
            <Sparkles size={14} />
            <span>24/7 Customer Assistance</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Get in <span className="text-amber-400">Touch</span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Have questions regarding ticket bookings, bus schedules, or lost luggage? 
            We are here to assist you round the clock.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {contactDetails.map((detail, idx) => {
            const IconComponent = detail.icon;
            return (
              <a
                key={idx}
                href={detail.href}
                target={detail.href.startsWith("http") ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className="bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-6 transition-all space-y-3 group block"
              >
                <div
                  className={`w-11 h-11 rounded-2xl border flex items-center justify-center ${detail.color}`}
                >
                  <IconComponent size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {detail.title}
                  </h3>
                  <p className="text-base font-semibold text-white group-hover:text-amber-400 transition-colors mt-0.5">
                    {detail.value}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {detail.subtext}
                  </p>
                </div>
              </a>
            );
          })}
        </div>

        {/* Main Content Grid: Form + Office Hours */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inquiry Form */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <MessageSquare size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Send Us a Message</h2>
                <p className="text-xs text-slate-400">
                  Fill out the form below and our team will get back to you shortly.
                </p>
              </div>
            </div>

            {/* Notification Banner */}
            {statusMsg && (
              <div
                className={`p-4 rounded-2xl border text-xs font-medium flex items-center gap-3 ${
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

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Email & Subject Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. rahul@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Inquiry Type
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Ticket Booking & Cancellation">
                      Ticket Booking & Cancellation
                    </option>
                    <option value="Bus Schedule & Routes">
                      Bus Schedule & Routes
                    </option>
                    <option value="Luggage & Lost Property">
                      Luggage & Lost Property
                    </option>
                    <option value="Corporate Fleet Rental">
                      Corporate Fleet Rental
                    </option>
                  </select>
                </div>
              </div>

              {/* Message Textarea */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Your Message <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe your query or request in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Operational Details Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Support Operating Hours</h3>
                  <p className="text-xs text-slate-400">Always active when you are on the road</p>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                  <span className="text-slate-400">Bus Helpline Desk</span>
                  <span className="font-semibold text-emerald-400">24 Hours / 7 Days</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                  <span className="text-slate-400">Ticket Counter (Majestic)</span>
                  <span className="font-semibold text-slate-200">05:00 AM - 11:30 PM</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                  <span className="text-slate-400">Refund & Cancellation Desk</span>
                  <span className="font-semibold text-slate-200">09:00 AM - 08:00 PM</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Building size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Main Depot Terminal</h3>
                  <p className="text-xs text-slate-400">Boarding & Service Hub</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Platform No. 18, Majestic Inter-State Bus Station, Opposite KSR City Railway Station, 
                Bengaluru, Karnataka 560009.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}