import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return <div data-slot="skeleton" className={cn('animate-pulse rounded-md bg-white/10', className)} {...props} />
}


