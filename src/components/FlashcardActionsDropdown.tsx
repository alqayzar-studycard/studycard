import { Copy, EllipsisVertical, Pencil, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type FlashcardActionsDropdownProps = {
  onDuplicate: () => void
  onEdit: () => void
  onDelete: () => void
}

export function FlashcardActionsDropdown(props: FlashcardActionsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="ml-auto size-7 text-forest hover:bg-sage" aria-label="Flashcard actions">
          <EllipsisVertical className="size-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-primary/40">
        <DropdownMenuItem className="text-black font-black" onSelect={props.onDuplicate}>
          <Copy className="size-4 shrink-0" strokeWidth={2} aria-hidden="true" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem className="text-black font-black" onSelect={props.onEdit}>
          <Pencil className="size-4 shrink-0" strokeWidth={2} aria-hidden="true" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem className="bg-secondary/70 text-white font-black" onSelect={props.onDelete}>
          <Trash className="size-4 shrink-0" strokeWidth={2} aria-hidden="true" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
