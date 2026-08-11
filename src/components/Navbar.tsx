"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bus, Menu, X, PhoneCall, ArrowRight, ShieldCheck } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Navigation Links
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Routes & Fleet", href: "/search" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  // Add subtle background shadow/blur intensification on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? "bg-slate-950/95 backdrop-blur-xl border-slate-800 shadow-lg shadow-black/20"
          : "bg-slate-950/80 backdrop-blur-md border-slate-800/60"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-20">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 group-hover:scale-105 group-hover:bg-indigo-500 transition-all duration-200">
            <Bus className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-white leading-none">
              Shakuntala
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 mt-1">
              Travels
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2 font-medium text-sm">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? "text-amber-400 bg-amber-400/10"
                    : "text-slate-300 hover:text-white hover:bg-slate-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Call-to-Action & 24/7 Support */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4">
          <a
            href="tel:+9118001234567"
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800"
          >
            <PhoneCall className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>24/7 Support</span>
          </a>

          <Link
            href="/search"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 active:scale-95 cursor-pointer"
          >
            <span>Book Ticket</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-6 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? "text-amber-400 bg-amber-400/10"
                      : "text-slate-200 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-3">
            <a
              href="tel:+9118001234567"
              className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-300 py-2.5 rounded-xl bg-slate-900 border border-slate-800"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              <span>Toll Free: +91 1800-123-4567</span>
            </a>

            <Link
              href="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              <span>Book Ticket Now</span>
              <ArrowRight size={16} />
            </Link>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-1">
              <ShieldCheck size={13} className="text-emerald-400" />
              <span>Instant Confirmation & Zero Booking Fees</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}