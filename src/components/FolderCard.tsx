import { BookOpen } from "lucide-react"
import { Link } from "react-router-dom"

import { FolderActionsDropdown } from "@/components/FolderActionsDropdown"
import type { Folder } from "@/lib/db"
import { getTagBackgroundClass } from "@/lib/tag-styles"
import { cardGlassStyle } from "@/lib/glass-styles"

type FolderCardProps = {
  folder: Folder
  onEdit: () => void
  onDelete: () => void
}

export function FolderCard(props: FolderCardProps) {
  return (
    <article className="flashcard-surface group flex min-w-0 items-center gap-3 rounded-[var(--radius)] border-4 border-primary/40 p-2 pr-3 transition-colors hover:bg-list-hover" style={cardGlassStyle}>
      <Link to={`/${props.folder.id}`} className="flex min-w-0 flex-1 items-center gap-3">
        <span className={`grid size-9 shrink-0 place-items-center opacity-70 rotate-3 rounded-[var(--radius)] ${getTagBackgroundClass(props.folder.color)}`}>
          <BookOpen className="size-4 -rotate-6" strokeWidth={2} aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1 overflow-x-auto">
          <h2 className="w-max font-display text-lg font-black tracking-tight">{props.folder.name}</h2>
        </span>
      </Link>
      <FolderActionsDropdown folderName={props.folder.name} onEdit={props.onEdit} onDelete={props.onDelete} />
    </article>
  )
}
