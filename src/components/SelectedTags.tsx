import { X } from "lucide-react"

import { useStudyData } from "@/contexts/StudyDataContext"
import { getSolidTagColorClass } from "@/lib/tag-styles"

type SelectedTagsProps = {
  tagIds: string[]
  onRemove: (tagId: string) => void
}

export function SelectedTags(props: SelectedTagsProps) {
  const { getTagById } = useStudyData()

  if (props.tagIds.length === 0) return null

  return (
    <div className="font-content mt-3 flex max-w-full gap-1.5 overflow-x-auto pb-1" aria-label="Selected tags">
      {props.tagIds.map((tagId) => {
        const tag = getTagById(tagId)

        return (
          <button
            key={tagId}
            type="button"
            onClick={() => props.onRemove(tagId)}
            className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-[var(--tag-radius)] border px-2 py-1 text-sm font-black ${getSolidTagColorClass(tag?.color)}`}
          >
            {tag?.name ?? tagId}
            <X className="size-3" aria-hidden="true" />
          </button>
        )
      })}
    </div>
  )
}
