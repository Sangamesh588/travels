"use client";

import Link from "next/link";
import {
  Bus,
  Phone,
  Mail,
  MapPin,
  Send,
  ShieldCheck,
  CreditCard,
  Clock,
} from "lucide-react";

export default function Footer() {
  const quickLinks = [
    { label: "Search Buses", href: "/search" },
    { label: "Bus Routes", href: "/routes" },
    { label: "Offers & Discounts", href: "/offers" },
    { label: "Track Bus Live", href: "/track" },
    { label: "Cancel Booking", href: "/cancel" },
  ];

  const popularRoutes = [
    { label: "Bengaluru to Hyderabad", href: "/routes/bengaluru-to-hyderabad" },
    { label: "Chennai to Bengaluru", href: "/routes/chennai-to-bengaluru" },
    { label: "Mumbai to Pune", href: "/routes/mumbai-to-pune" },
    { label: "Delhi to Jaipur", href: "/routes/delhi-to-jaipur" },
    { label: "Hyderabad to Goa", href: "/routes/hyderabad-to-goa" },
  ];


  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Newsletter Callout Banner */}
        <div className="mb-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800/80 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Exclusive Member Perks
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Get ₹150 OFF your first bus booking!
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Subscribe to get instant discount codes, special festival offers, and route updates.
            </p>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center gap-2 w-full lg:w-auto"
          >
            <div className="relative flex-1 lg:w-80">
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all duration-150 flex items-center justify-center gap-2 shrink-0 shadow-md shadow-indigo-600/20"
            >
              <span>Subscribe</span>
              <Send size={15} />
            </button>
          </form>
        </div>

        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
                <Bus size={22} />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Shakuntala Travels
              </span>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed">
              Your trusted travel partner for comfortable, safe, and reliable bus journeys across India. Book tickets seamlessly with zero booking fees.
            </p>

            {/* Social Icons */}
            
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              {quickLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="text-slate-400 hover:text-amber-400 hover:translate-x-1 inline-block transition-all duration-150"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Routes */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Popular Routes
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              {popularRoutes.map((route, idx) => (
                <li key={idx}>
                  <Link
                    href={route.href}
                    className="text-slate-400 hover:text-amber-400 hover:translate-x-1 inline-block transition-all duration-150"
                  >
                    {route.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Contact & Support
            </h4>
            <ul className="space-y-3.5 text-xs font-medium">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <span className="text-slate-400 leading-relaxed">
                  Main Bus Terminal Station, Tech Park Road, Bengaluru, Karnataka 560100
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-amber-400 shrink-0" />
                <a
                  href="tel:+9118001234567"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  +91 1800-123-4567 (Toll Free)
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-amber-400 shrink-0" />
                <a
                  href="mailto:support@shakuntalatravels.com"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  support@shakuntalatravels.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Value Props Strip */}
        <div className="py-6 border-b border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-400">
          <div className="flex items-center justify-start sm:justify-center gap-2.5">
            <ShieldCheck size={18} className="text-indigo-400" />
            <span>100% Safe & Secure Bookings</span>
          </div>
          <div className="flex items-center justify-start sm:justify-center gap-2.5">
            <Clock size={18} className="text-indigo-400" />
            <span>24/7 Live Customer Assistance</span>
          </div>
          <div className="flex items-center justify-start sm:justify-center gap-2.5">
            <CreditCard size={18} className="text-indigo-400" />
            <span>Instant Refunds on Cancellations</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Shakuntala Travels. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy-policy"
              className="hover:text-slate-300 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-slate-300 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/support"
              className="hover:text-slate-300 transition-colors"
            >
              Support Center
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}