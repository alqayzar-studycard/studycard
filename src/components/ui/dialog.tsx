import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root
const DialogClose = DialogPrimitive.Close

const DialogContent = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Content>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink/45" />
    <DialogPrimitive.Content ref={ref} className={cn("fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2.5rem)] w-[calc(100%-2.5rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[var(--radius)] bg-paper p-6 shadow-2xl", className)} {...props}>
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-[var(--radius)] p-2 text-muted-foreground hover:bg-accent focus-visible:outline-2 focus-visible:outline-forest">
        <X className="size-5" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
))
DialogContent.displayName = "DialogContent"

function DialogHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...headerProps } = props
  return <div className={cn("flex flex-col gap-1", className)} {...headerProps} />
}

function DialogFooter(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...footerProps } = props
  return <div className={cn("flex justify-end gap-3", className)} {...footerProps} />
}

const DialogTitle = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Title>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold", className)} {...props} />
))
DialogTitle.displayName = "DialogTitle"

export { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle }
