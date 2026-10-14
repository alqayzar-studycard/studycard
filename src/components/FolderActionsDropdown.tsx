import { EllipsisVertical, Pencil, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type FolderActionsDropdownProps = {
  folderName: string
  onEdit: () => void
  onDelete: () => void
}

export function FolderActionsDropdown(props: FolderActionsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="ml-auto text-forest hover:bg-sage" aria-label={`Actions for ${props.folderName}`}>
          <EllipsisVertical className="size-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-primary">
        <DropdownMenuItem className="text-white font-black" onSelect={props.onEdit}>
          <Pencil className="size-4 shrink-0" strokeWidth={2} aria-hidden="true" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem className="bg-destructive/70 text-white font-black" onSelect={props.onDelete}>
          <Trash className="size-4 shrink-0" strokeWidth={2} aria-hidden="true" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
