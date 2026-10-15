import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import { createPortal } from "react-dom"

import { FlashcardActionsDropdown } from "@/components/FlashcardActionsDropdown"
import { useStudyData } from "@/contexts/StudyDataContext"
import type { Flashcard } from "@/lib/db"
import { getTagColorClass } from "@/lib/tag-styles"
import { cn } from "@/lib/utils"

type FlashcardCardProps = {
  flashcard: Flashcard
  onDuplicate: () => void
  onEdit: () => void
  onDelete: () => void
}

export function FlashcardCard(props: FlashcardCardProps) {
  const { getImageById, getTagById } = useStudyData()
  const [isExpanded, setIsExpanded] = useState(false)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)
  const [rectoImageUrl, setRectoImageUrl] = useState<string | null>(null)
  const [versoImageUrl, setVersoImageUrl] = useState<string | null>(null)

  useEffect(() => {
    const image = props.flashcard.rectoImageId ? getImageById(props.flashcard.rectoImageId) : undefined
    if (!image) {
      setRectoImageUrl(null)
      return
    }

    const imageUrl = URL.createObjectURL(image.blob)
    setRectoImageUrl(imageUrl)
    return () => URL.revokeObjectURL(imageUrl)
  }, [props.flashcard.rectoImageId, getImageById])

  useEffect(() => {
    const image = props.flashcard.versoImageId ? getImageById(props.flashcard.versoImageId) : undefined
    if (!image) {
      setVersoImageUrl(null)
      return
    }

    const imageUrl = URL.createObjectURL(image.blob)
    setVersoImageUrl(imageUrl)
    return () => URL.revokeObjectURL(imageUrl)
  }, [props.flashcard.versoImageId, getImageById])

  const toggleExpanded = () => setIsExpanded((currentValue) => !currentValue)

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return
    event.preventDefault()
    toggleExpanded()
  }

  return (
    <article className="flashcard-surface font-content min-w-0 cursor-pointer rounded-[var(--radius)] border-4 border-primary/40 p-4 pt-2" role="button" tabIndex={0} aria-expanded={isExpanded} onClick={toggleExpanded} onKeyDown={handleKeyDown}>
      <div className="flex justify-end gap-1" onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
        <button type="button" onClick={toggleExpanded} className="grid size-7 place-items-center rounded-[var(--radius)] text-forest hover:bg-sage" aria-label={isExpanded ? "Collapse flashcard" : "Expand flashcard"}>
          <ChevronDown className={`size-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>
        <FlashcardActionsDropdown onDuplicate={props.onDuplicate} onEdit={props.onEdit} onDelete={props.onDelete} />
      </div>
      <div className="mt-1 flow-root">
        {rectoImageUrl && (isExpanded ? (
          <button type="button" className="float-right mb-2 ml-3 size-16 overflow-hidden rounded-[var(--radius)] border-2 border-primary" onClick={(event) => { event.stopPropagation(); setPreviewImageUrl(rectoImageUrl) }} aria-label="Preview recto image">
            <img src={rectoImageUrl} alt="" className="size-full object-cover" />
          </button>
        ) : <img src={rectoImageUrl} alt="" className="float-right mb-2 ml-3 size-9 rounded-[var(--radius)] object-cover border-2 border-primary" />)}
        <h2 className={`text-xl font-extrabold ${isExpanded ? "" : "flashcard-copy--collapsed"}`}>{props.flashcard.recto}</h2>
      </div>
      <div className="mt-4 flow-root">
        {versoImageUrl && (isExpanded ? (
          <button type="button" className="float-right mb-2 ml-3 size-16 overflow-hidden rounded-[var(--radius)] border-2 border-primary" onClick={(event) => { event.stopPropagation(); setPreviewImageUrl(versoImageUrl) }} aria-label="Preview verso image">
            <img src={versoImageUrl} alt="" className="size-full object-cover" />
          </button>
        ) : <img src={versoImageUrl} alt="" className="float-right mb-2 ml-3 size-9 rounded-[var(--radius)] object-cover border-2 border-primary" />)}
        <p className={`text-sm font-black text-ink/80 ${isExpanded ? "" : "flashcard-copy--collapsed"}`}>{props.flashcard.verso}</p>
      </div>
      {(props.flashcard.tags?.length ?? 0) > 0 && (
        <div className="mt-4 flex max-w-full gap-1.5 overflow-x-auto pb-1">
          {props.flashcard.tags.map((tagId) => {
            const tag = getTagById(tagId);
            return (
              <span
                key={tagId}
                className={cn(
                  'shrink-0 whitespace-nowrap rounded-[var(--tag-radius)] px-2 py-1 text-xs font-bold',
                  getTagColorClass(tag?.color)
                )}
              >
                {tag?.name ?? tagId}
              </span>
            );
          })}
        </div>
      )}
      {previewImageUrl && createPortal(
        <div className="fixed inset-0 z-[100] grid place-items-center bg-ink/85 p-6" role="dialog" aria-modal="true" aria-label="Image preview" onClick={() => setPreviewImageUrl(null)}>
          <img src={previewImageUrl} alt="" className="max-h-full max-w-full object-contain" />
        </div>,
        document.body,
      )}
    </article>
  )
}
