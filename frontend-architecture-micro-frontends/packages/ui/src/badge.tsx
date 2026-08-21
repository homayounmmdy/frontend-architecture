import { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", {
  variants: {
    variant: {
      default: "bg-secondary text-secondary-foreground",
      success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/18 dark:text-emerald-300",
      warning: "bg-amber-100 text-amber-700 dark:bg-amber-500/18 dark:text-amber-300",
      danger: "bg-red-100 text-red-700 dark:bg-red-500/18 dark:text-red-300",
      info: "bg-blue-100 text-blue-700 dark:bg-sky-500/18 dark:text-sky-300",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface BadgeProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> { }

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
