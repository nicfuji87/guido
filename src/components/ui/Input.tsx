import { cn } from "@/lib/utils";
import React, { InputHTMLAttributes } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, _ref) => {
    return (
      <input
        type={type}
        data-slot="input"
        className={cn(
          'flex h-9 w-full min-w-0 rounded-md border border-white/20 bg-transparent px-3 py-1 text-base shadow-sm outline-none transition-colors md:text-sm',
          'placeholder:text-white/50',
          'focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }


