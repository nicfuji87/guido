import { cn } from "@/lib/utils";
import React, { HTMLAttributes } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {}

function Skeleton({
  className,
  ...props
}: SkeletonProps) {
  return (
    <div data-slot="skeleton" className={cn('animate-pulse rounded-md bg-white/10', className)} {...props} />
  );
}

export { Skeleton }


