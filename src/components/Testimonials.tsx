"use client";

import { Star, Quote, CheckCircle2 } from "lucide-react";

export interface TestimonialItem {
  name: string;
  route: string;
  rating: number;
  comment: string;
  avatarBg?: string;
}

interface TestimonialsProps {
  items?: TestimonialItem[];
  title?: string;
  subtitle?: string;
  badgeText?: string;
}

const defaultTestimonials: TestimonialItem[] = [
  {
    name: "Ramesh Kumar",
    route: "Bengaluru to Bidar",
    rating: 5,
    comment:
      "Very comfortable overnight journey. The sleeper berths were clean, well-maintained, and the bus arrived right on schedule. Highly recommended!",
    avatarBg: "bg-indigo-600",
  },
  {
    name: "Ananya Sharma",
    route: "Bengaluru to Hyderabad",
    rating: 5,
    comment:
      "Clean buses, courteous staff, and punctual service. The live bus tracking link gave my family complete peace of mind throughout the trip.",
    avatarBg: "bg-emerald-600",
  },
  {
    name: "Suresh Patil",
    route: "Bengaluru to Kalaburagi",
    rating: 5,
    comment:
      "Hands down the best bus operator on this route. Personal charging ports worked perfectly, smooth suspension, and zero unnecessary delays.",
    avatarBg: "bg-amber-600",
  },
];

export default function Testimonials({
  items = defaultTestimonials,
  title = "Customer Reviews",
  subtitle = "Trusted by thousands of daily commuters and long-distance travelers across Karnataka.",
  badgeText = "Real Feedback",
}: TestimonialsProps) {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            {badgeText}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            {title}
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-2">
            {subtitle}
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item, idx) => {
            const avatarBgClass = item.avatarBg || "bg-indigo-600";

            return (
              <div
                key={item.name || idx}
                className="
                  bg-white
                  border
                  border-slate-200/80
                  p-6
                  rounded-2xl
                  shadow-xs
                  hover:shadow-md
                  hover:-translate-y-1
                  transition-all
                  duration-200
                  flex
                  flex-col
                  justify-between
                  relative
                  overflow-hidden
                "
              >
                {/* Background Quote Overlay Icon */}
                <Quote className="absolute -top-1 -right-1 w-16 h-16 text-slate-100/80 pointer-events-none" />

                <div>
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className="text-amber-400 fill-amber-400"
                      />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-slate-700 text-sm leading-relaxed mb-6 italic relative z-10">
                    "{item.comment}"
                  </p>
                </div>

                {/* Reviewer Details Footer */}
                <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${avatarBgClass} text-white font-bold text-sm flex items-center justify-center shadow-xs flex-shrink-0`}
                  >
                    {item.name ? item.name.charAt(0) : "U"}
                  </div>

                  <div className="overflow-hidden">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 truncate">
                      <span>{item.name}</span>
                      <CheckCircle2
                        size={14}
                        className="text-emerald-500 flex-shrink-0"
                      />
                    </h3>

                    <p className="text-[11px] font-semibold text-indigo-600 truncate">
                      {item.route}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}