import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"

import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>((props, ref) => {
  const { className, sideOffset = 6, ...contentProps } = props

  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn("z-50 min-w-40 overflow-hidden rounded-[var(--radius)] border border-primary/35 bg-paper p-1.5 font-display text-ink shadow-lg", className)}
        {...contentProps}
      />
    </DropdownMenuPrimitive.Portal>
  )
})
DropdownMenuContent.displayName = "DropdownMenuContent"

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn("flex w-full cursor-pointer select-none items-center gap-2.5 rounded-[var(--radius)] px-3 py-2.5 text-sm leading-5 font-medium outline-none transition-colors data-[highlighted]:bg-accent data-[highlighted]:text-ink", className)}
    {...props}
  />
))
DropdownMenuItem.displayName = "DropdownMenuItem"

export { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger }
