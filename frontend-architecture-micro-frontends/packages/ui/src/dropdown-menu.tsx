import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "./lib/utils";

export const DropdownMenu = DropdownMenuPrimitive.Root;

export const DropdownMenuTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger>
>(({ onClick, onPointerDown, ...props }, ref) => {
  const wasClosedOnPointerDown = React.useRef<boolean | null>(null);

  return (
    <DropdownMenuPrimitive.Trigger
      ref={ref}
      onPointerDown={(event) => {
        wasClosedOnPointerDown.current = event.currentTarget.getAttribute("aria-expanded") !== "true";
        onPointerDown?.(event);
      }}
      onClick={(event) => {
        onClick?.(event);

        if (event.defaultPrevented) return;
        if (event.button !== 0 || event.ctrlKey) return;

        const wasClosed = wasClosedOnPointerDown.current ?? event.currentTarget.getAttribute("aria-expanded") !== "true";
        wasClosedOnPointerDown.current = null;

        if (wasClosed && event.currentTarget.getAttribute("aria-expanded") !== "true") {
          event.currentTarget.dispatchEvent(
            new KeyboardEvent("keydown", {
              key: "Enter",
              bubbles: true,
              cancelable: true,
            }),
          );
        }
      }}
      {...props}
    />
  );
});
DropdownMenuTrigger.displayName = DropdownMenuPrimitive.Trigger.displayName;

export function DropdownMenuContent({
  className,
  sideOffset = 8,
  ...props
}: DropdownMenuPrimitive.DropdownMenuContentProps) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[14rem] overflow-hidden rounded-md border bg-card p-1 text-card-foreground shadow-md",
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

export function DropdownMenuLabel({
  className,
  ...props
}: DropdownMenuPrimitive.DropdownMenuLabelProps) {
  return <DropdownMenuPrimitive.Label className={cn("px-2 py-1.5 text-sm font-semibold", className)} {...props} />;
}

export function DropdownMenuSeparator({
  className,
  ...props
}: DropdownMenuPrimitive.DropdownMenuSeparatorProps) {
  return <DropdownMenuPrimitive.Separator className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />;
}

export function DropdownMenuItem({
  className,
  inset,
  ...props
}: DropdownMenuPrimitive.DropdownMenuItemProps & { inset?: boolean }) {
  return (
    <DropdownMenuPrimitive.Item
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden transition-colors focus:bg-accent data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        inset && "pl-8",
        className,
      )}
      {...props}
    />
  );
}
