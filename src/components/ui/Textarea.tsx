import { cn } from "@/lib/utils";
import React, { TextareaHTMLAttributes } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, _ref) => {
    return (
      <textarea
        data-slot="textarea"
        className={cn(
          'min-h-16 w-full rounded-md border border-white/20 bg-transparent px-3 py-2 text-base shadow-sm outline-none transition-colors md:text-sm',
          'placeholder:text-white/50',
          'focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea"

export { Textarea }


