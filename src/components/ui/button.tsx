import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    // Layout & Base
    "group/button relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap select-none",
    "rounded-xl text-sm font-semibold transition-all duration-150 ease-out outline-none",
    // Interactive feedback
    "active:not-aria-[haspopup]:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
    // Focus ring styling
    "focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:focus-visible:ring-indigo-400",
    // Invalid / Error state styling
    "aria-invalid:border-rose-500 aria-invalid:ring-2 aria-invalid:ring-rose-500/20 dark:aria-invalid:ring-rose-500/30",
    // SVG icon auto-sizing
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-indigo-600 text-white shadow-sm shadow-indigo-600/25",
          "hover:bg-indigo-500 hover:shadow-md hover:shadow-indigo-600/30",
          "active:bg-indigo-700",
          "dark:bg-indigo-600 dark:hover:bg-indigo-500 dark:active:bg-indigo-700",
          // Inner top light highlight for 3D tactile depth
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]",
        ].join(" "),

        secondary: [
          "bg-slate-100 text-slate-900 shadow-2xs",
          "hover:bg-slate-200/80 hover:text-slate-950",
          "active:bg-slate-200",
          "dark:bg-slate-800/80 dark:text-slate-100 dark:hover:bg-slate-800 dark:hover:text-white dark:active:bg-slate-700/80",
        ].join(" "),

        outline: [
          "border border-slate-200/80 bg-white/80 text-slate-700 backdrop-blur-xs shadow-2xs",
          "hover:border-slate-300 hover:bg-slate-100/80 hover:text-slate-900",
          "active:bg-slate-200/60",
          "aria-expanded:bg-slate-100 aria-expanded:text-slate-900",
          "dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-900 dark:hover:text-white",
        ].join(" "),

        soft: [
          "bg-indigo-50 text-indigo-600",
          "hover:bg-indigo-100 hover:text-indigo-700",
          "active:bg-indigo-200/80",
          "dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20 dark:hover:text-indigo-300",
        ].join(" "),

        amber: [
          "bg-amber-400 text-amber-950 font-bold shadow-sm shadow-amber-500/20",
          "hover:bg-amber-300 hover:shadow-md hover:shadow-amber-500/30",
          "active:bg-amber-500",
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35)]",
        ].join(" "),

        "amber-outline": [
          "border-2 border-amber-400/80 bg-transparent text-amber-600 dark:text-amber-400",
          "hover:border-amber-400 hover:bg-amber-400/10",
          "active:bg-amber-400/20",
        ].join(" "),

        ghost: [
          "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
          "active:bg-slate-200/70",
          "dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-white dark:active:bg-slate-800",
        ].join(" "),

        destructive: [
          "bg-rose-600 text-white shadow-sm shadow-rose-600/20",
          "hover:bg-rose-500 hover:shadow-md hover:shadow-rose-600/30",
          "active:bg-rose-700",
          "focus-visible:ring-rose-500",
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]",
        ].join(" "),

        "destructive-soft": [
          "bg-rose-500/10 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400",
          "hover:bg-rose-500/20 dark:hover:bg-rose-500/25",
          "active:bg-rose-500/30",
          "focus-visible:ring-rose-500",
        ].join(" "),

        link: [
          "text-indigo-600 underline-offset-4 hover:underline dark:text-indigo-400",
          "focus-visible:ring-2 focus-visible:ring-indigo-500",
        ].join(" "),
      },

      size: {
        xs: [
          "h-7 rounded-lg px-2.5 text-xs gap-1.5",
          "in-data-[slot=button-group]:rounded-md",
          "has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
          "[&_svg:not([class*='size-'])]:size-3.5",
        ].join(" "),

        sm: [
          "h-8.5 rounded-lg px-3 text-xs gap-1.5",
          "in-data-[slot=button-group]:rounded-lg",
          "has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
          "[&_svg:not([class*='size-'])]:size-3.5",
        ].join(" "),

        default: [
          "h-10 rounded-xl px-4 text-sm gap-2",
          "in-data-[slot=button-group]:rounded-xl",
          "has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
          "[&_svg:not([class*='size-'])]:size-4",
        ].join(" "),

        lg: [
          "h-12 rounded-2xl px-6 text-base gap-2.5",
          "has-data-[icon=inline-end]:pr-4.5 has-data-[icon=inline-start]:pl-4.5",
          "[&_svg:not([class*='size-'])]:size-5",
        ].join(" "),

        icon: "size-10 rounded-xl p-0",
        "icon-xs": "size-7 rounded-lg p-0 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-8.5 rounded-lg p-0 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-12 rounded-2xl p-0 [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends ButtonPrimitive.Props,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
}

function Button({
  className,
  variant,
  size,
  isLoading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {children}
        </>
      ) : (
        children
      )}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }