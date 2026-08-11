"use client";

import { useEffect, useState, useRef, useId } from "react";
import { MapPin, X, Loader2, Check } from "lucide-react";

export interface City {
  id: number | string;
  city_name: string;
  state_name?: string;
}

interface CityAutocompleteProps {
  placeholder?: string;
  value: string;
  onChange: (city: string) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export default function CityAutocomplete({
  placeholder = "Search city...",
  value,
  onChange,
  label,
  className = "",
  disabled = false,
}: CityAutocompleteProps) {
  const [cities, setCities] = useState<City[]>([]);
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  // Keep internal query state in sync with parent component's value prop
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Fetch cities on mount with AbortController for clean component unmounting
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    fetch("/api/cities", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load cities");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setCities(data);
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("City fetch error:", err);
        }
      })
      .finally(() => {
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSelectedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Flexible substring filtering (matches anywhere in the city name)
  const trimmedQuery = query.trim().toLowerCase();
  const filteredCities = cities.filter((city) =>
    city.city_name.toLowerCase().includes(trimmedQuery)
  );

  // Reset keyboard highlight whenever search query updates
  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  // Handle city item click
  const handleSelect = (cityName: string) => {
    setQuery(cityName);
    onChange(cityName);
    setOpen(false);
    setSelectedIndex(-1);
  };

  // Handle clear button click
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuery("");
    onChange("");
    setOpen(true);
    inputRef.current?.focus();
  };

  // Full Keyboard Navigation (ArrowUp, ArrowDown, Enter, Escape)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        setOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredCities.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredCities.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredCities.length) {
          handleSelect(filteredCities[selectedIndex].city_name);
        } else if (filteredCities.length > 0) {
          handleSelect(filteredCities[0].city_name);
        }
        break;
      case "Escape":
        setOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Helper to highlight matching text substrings in search results
  const renderMatchedText = (text: string, search: string) => {
    if (!search) return <span>{text}</span>;

    const index = text.toLowerCase().indexOf(search);
    if (index === -1) return <span>{text}</span>;

    const before = text.substring(0, index);
    const match = text.substring(index, index + search.length);
    const after = text.substring(index + search.length);

    return (
      <span>
        {before}
        <span className="font-bold text-indigo-600 dark:text-indigo-400">
          {match}
        </span>
        {after}
      </span>
    );
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
          {label}
        </label>
      )}

      {/* Input Container */}
      <div className="relative flex items-center">
        <MapPin
          size={18}
          className="absolute left-4 text-slate-400 dark:text-slate-500 pointer-events-none z-10"
        />

        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listboxId}
          disabled={disabled}
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value);
            setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="
            w-full
            pl-11
            pr-10
            py-3.5
            bg-white dark:bg-slate-900
            rounded-xl
            border
            border-slate-300 dark:border-slate-800
            text-slate-900 dark:text-white
            font-medium text-sm
            placeholder:text-slate-400 dark:placeholder:text-slate-500
            outline-none
            transition-all
            duration-200
            focus:border-indigo-600 dark:focus:border-indigo-500
            focus:ring-4
            focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20
            shadow-xs
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        />

        {/* Clear Button & Loader Icons */}
        <div className="absolute right-3.5 flex items-center gap-1 z-10">
          {loading ? (
            <Loader2 size={16} className="animate-spin text-slate-400" />
          ) : query ? (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Clear input"
            >
              <X size={14} />
            </button>
          ) : null}
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      {open && (
        <div
          id={listboxId}
          role="listbox"
          className="
            absolute
            top-full
            left-0
            w-full
            bg-white dark:bg-slate-900
            rounded-xl
            shadow-xl
            mt-1.5
            z-50
            overflow-hidden
            border
            border-slate-200/80 dark:border-slate-800
            max-h-64
            overflow-y-auto
            divide-y divide-slate-100 dark:divide-slate-800/60
          "
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2 px-4 py-6 text-slate-400 text-sm">
              <Loader2 size={16} className="animate-spin text-indigo-600" />
              <span>Loading available cities...</span>
            </div>
          ) : filteredCities.length > 0 ? (
            <>
              {!trimmedQuery && (
                <div className="px-4 py-2 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/30">
                  Popular Destinations
                </div>
              )}

              {filteredCities.map((city, index) => {
                const isSelected = index === selectedIndex;
                const isExactMatch =
                  value.toLowerCase().trim() ===
                  city.city_name.toLowerCase().trim();

                return (
                  <div
                    key={city.id}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(city.city_name)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`
                      flex
                      items-center
                      justify-between
                      px-4
                      py-3
                      cursor-pointer
                      transition-colors
                      text-sm
                      ${
                        isSelected
                          ? "bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? "bg-indigo-600 text-white"
                            : "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                        }`}
                      >
                        <MapPin size={14} />
                      </div>

                      <div className="truncate">
                        <span className="font-semibold block truncate">
                          {renderMatchedText(city.city_name, trimmedQuery)}
                        </span>
                        {city.state_name && (
                          <span className="text-xs text-slate-400 block truncate">
                            {city.state_name}
                          </span>
                        )}
                      </div>
                    </div>

                    {isExactMatch && (
                      <Check
                        size={16}
                        className="text-indigo-600 dark:text-indigo-400 shrink-0 ml-2"
                      />
                    )}
                  </div>
                );
              })}
            </>
          ) : (
            <div className="px-4 py-6 text-center text-slate-400 dark:text-slate-500 text-sm">
              <p className="font-medium">No matching cities found</p>
              <p className="text-xs mt-0.5 text-slate-400">
                Check spelling or try typing a different city
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}