import { useState } from "react"
import { Eraser } from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FloatingLabelInput } from "@/components/ui/floating-label-input"
import { useStudyData } from "@/contexts/StudyDataContext"
import { getSolidTagColorClass, getTagColorClass } from "@/lib/tag-styles"

type TagsDialogProps = {
  isOpen: boolean
  folderId: string
  selectedTags: string[]
  onOpenChange: (isOpen: boolean) => void
  onToggleTag: (tagId: string) => void
  onClearSelections: () => void
}

export function TagsDialog(props: TagsDialogProps) {
  const { activeFolderId, tags } = useStudyData()
  const [searchQuery, setSearchQuery] = useState("")
  const folderTags = activeFolderId === props.folderId ? tags : []
  const visibleTags = folderTags.filter((tag) => tag.name.toLocaleLowerCase().includes(searchQuery.trim().toLocaleLowerCase()))

  const handleOpenChange = (open: boolean) => {
    if (!open) setSearchQuery("")
    props.onOpenChange(open)
  }

  return (
    <Dialog open={props.isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="flex h-[min(32rem,calc(100dvh-2.5rem))] max-h-[calc(100dvh-2.5rem)] flex-col overflow-hidden" onOpenAutoFocus={(event) => event.preventDefault()}>
        <DialogHeader className="shrink-0 pr-10">
          <DialogTitle className="font-display text-3xl font-bold text-primary">Tags</DialogTitle>
        </DialogHeader>

        {folderTags.length === 0 ? (
          <p className="mt-5 text-sm text-muted-foreground">Save a flashcard with tags to see them here.</p>
        ) : (
          <>
            <div className="mt-2 flex items-end gap-2">
              <Button type="button" variant="ghost" onClick={props.onClearSelections} disabled={props.selectedTags.length === 0} className="size-12 shrink-0 bg-cancel p-0 text-cancel-foreground hover:bg-cancel/80" aria-label="Clear selected tags">
                <Eraser className="size-4" aria-hidden="true" />
              </Button>
              <FloatingLabelInput label="Search tags" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Type a tag name" containerClassName="min-w-0 flex-1" />
            </div>
            {visibleTags.length === 0 ? (
              <p className="mt-5 text-sm text-muted-foreground">No tags match your search.</p>
            ) : (
              <div className="mt-2 min-h-0 flex-1 overflow-y-auto px-1 py-1">
                <div className="flex flex-wrap gap-2">
                  {visibleTags.map((tag) => {
                    const isSelected = props.selectedTags.includes(tag.id)

                    return (
                      <button
                        key={tag.id}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => props.onToggleTag(tag.id)}
                        className={`rounded-[var(--radius)] border px-3 py-1.5 text-sm font-black transition-all ${isSelected ? `ring-2 ring-ink/60 ring-offset-2 ring-offset-paper shadow-md ${getSolidTagColorClass(tag.color)}` : `opacity-60 hover:-translate-y-0.5 hover:opacity-100 hover:shadow-sm ${getTagColorClass(tag.color)}`}`}
                      >
                        {tag.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
