import { cn } from "@/lib/utils";
import React, { LabelHTMLAttributes } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

export const Label: React.FC<LabelProps> = ({ className, ...props }) => {
  return (
    <label
      data-slot="label"
      className={cn('text-sm font-medium leading-none', className)}
      {...props}
    />
  )
}


