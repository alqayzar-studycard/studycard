import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react"
import { ImagePlus, Plus, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FloatingLabelInput, FloatingLabelTextarea } from "@/components/ui/floating-label-input"
import { useStudyData } from "@/contexts/StudyDataContext"
import type { Flashcard, ImageSelection, Tag } from "@/lib/db"
import { getRandomTagColor, getTagColorClass } from "@/lib/tag-styles"
import { compressImage } from "@/lib/image-compression"

type NewFlashcardDialogProps = {
  isOpen: boolean
  folderId: string
  flashcard?: Flashcard | null
  onClose: () => void
  onSave: (recto: string, verso: string, tags: Tag[], rectoImage: ImageSelection, versoImage: ImageSelection) => Promise<void>
}

type FlashcardImageInputProps = {
  id: string
  label: string
  image: ImageSelection
  onChange: (image: ImageSelection) => void
}

function FlashcardImageInput(props: FlashcardImageInputProps) {
  const { getImageById } = useStudyData()
  const inputRef = useRef<HTMLInputElement>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isCompressing, setIsCompressing] = useState(false)

  useEffect(() => {
    const blob = props.image.blob ?? (props.image.imageId ? getImageById(props.image.imageId)?.blob : null)
    if (!blob) {
      setImageUrl(null)
      return
    }

    const objectUrl = URL.createObjectURL(blob)
    setImageUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [props.image, getImageById])

  const removeImage = () => {
    setIsPreviewOpen(false)
    props.onChange({ imageId: null, blob: null })
    if (inputRef.current) inputRef.current.value = ""
  }

  const handleImageChange = async (file: File | undefined) => {
    if (!file) {
      props.onChange({ imageId: null, blob: null })
      return
    }

    setIsCompressing(true)
    props.onChange({ imageId: null, blob: await compressImage(file) })
    setIsCompressing(false)
  }

  return (
    <div className="mt-5 flex items-center gap-2">
      <input
        ref={inputRef} id={props.id} type="file" accept="image/*"
        className="sr-only"
        onChange={(event) => void handleImageChange(event.target.files?.[0])}
      />
      <Button
        type="button" variant="ghost"
        onClick={() => inputRef.current?.click()} disabled={isCompressing}
        className="flex-1 border border-primary/35 bg-primary font-bold text-white hover:bg-sage"
      >
        <ImagePlus className="size-4" aria-hidden="true" />
        {isCompressing ? "Compressing…" : props.label}
      </Button>
      {imageUrl && (
        <>
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="size-10 shrink-0 overflow-hidden rounded-[var(--radius)] border-2 border-primary"
            aria-label={`Preview ${props.label.toLocaleLowerCase()}`}
          >
            <img src={imageUrl} alt={`Selected ${props.label.toLocaleLowerCase()}`} className="size-full object-cover" />
          </button>
          <Button
            type="button" variant="ghost" size="icon"
            onClick={removeImage} className="bg-cancel text-cancel-foreground hover:bg-cancel/80"
            aria-label={`Remove ${props.label.toLocaleLowerCase()}`}
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </Button>
        </>
      )}
      {isPreviewOpen && imageUrl && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-ink/85 p-6" role="dialog" aria-modal="true" aria-label={`${props.label} preview`} onClick={() => setIsPreviewOpen(false)}>
          <img src={imageUrl} alt={`Selected ${props.label.toLocaleLowerCase()}`} className="max-h-full max-w-full object-contain" onClick={(event) => event.stopPropagation()} />
        </div>
      )}
    </div>
  )
}

type FlashcardTagsInputProps = {
  isOpen: boolean
  folderId: string
  availableTags: Tag[]
  tags: Tag[]
  onChange: (tags: Tag[]) => void
}

function FlashcardTagsInput(props: FlashcardTagsInputProps) {
  const [tagName, setTagName] = useState("")

  useEffect(() => {
    setTagName("")
  }, [props.isOpen])

  const addTag = () => {
    const trimmedName = tagName.trim()
    if (!trimmedName || props.tags.some((tag) => tag.name.localeCompare(trimmedName, undefined, { sensitivity: "accent" }) === 0)) return

    const existingTag = props.availableTags.find((tag) => tag.name.localeCompare(trimmedName, undefined, { sensitivity: "accent" }) === 0)
    props.onChange([...props.tags, existingTag ?? { id: `${props.folderId}/${crypto.randomUUID()}`, folderId: props.folderId, name: trimmedName, color: getRandomTagColor(), createdAt: Date.now() }])
    setTagName("")
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return
    event.preventDefault()
    addTag()
  }

  return (
    <div className="mt-5">
      <div className="flex items-end gap-2">
        <FloatingLabelInput label="Tags" id="flashcard-tag" value={tagName} onChange={(event) => setTagName(event.target.value)} onKeyDown={handleKeyDown} placeholder="Add a tag" list="flashcard-tag-suggestions" containerClassName="min-w-0 flex-1" />
        <Button type="button" onClick={addTag} className="size-12 shrink-0 p-0" aria-label="Add tag">
          <Plus className="size-5" aria-hidden="true" />
        </Button>
      </div>
      <datalist id="flashcard-tag-suggestions">
        {props.availableTags.map((tag) => <option key={tag.id} value={tag.name} />)}
      </datalist>
      {props.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2" aria-label="Selected tags">
          {props.tags.map((tag) => (
            <button key={tag.id} type="button" onClick={() => props.onChange(props.tags.filter((currentTag) => currentTag.id !== tag.id))} className={`inline-flex items-center gap-1 rounded-[var(--radius)] border px-2 py-1 text-sm font-bold transition-opacity hover:opacity-70 ${getTagColorClass(tag.color)}`}>
              {tag.name}
              <X className="size-3.5" aria-hidden="true" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function NewFlashcardDialog(props: NewFlashcardDialogProps) {
  const { activeFolderId, tags: folderTags, selectedTagIds } = useStudyData()
  const flashcard = props.flashcard ?? null
  const availableTags = activeFolderId === props.folderId ? folderTags : []
  const [recto, setRecto] = useState("")
  const [verso, setVerso] = useState("")
  const [rectoImage, setRectoImage] = useState<ImageSelection>({ imageId: null, blob: null })
  const [versoImage, setVersoImage] = useState<ImageSelection>({ imageId: null, blob: null })
  const [tags, setTags] = useState<Tag[]>([])
  const isEditing = flashcard !== null

  useEffect(() => {
    setRecto(flashcard?.recto ?? "")
    setVerso(flashcard?.verso ?? "")
    setRectoImage({ imageId: flashcard?.rectoImageId ?? null, blob: null })
    setVersoImage({ imageId: flashcard?.versoImageId ?? null, blob: null })
    const initialTagIds = flashcard?.tags ?? selectedTagIds
    setTags(initialTagIds.map((tagId) => availableTags.find((tag) => tag.id === tagId)).filter((tag): tag is Tag => tag !== undefined))
  }, [flashcard, props.isOpen, selectedTagIds, availableTags])

  const closeDialog = () => {
    setRecto("")
    setVerso("")
    setRectoImage({ imageId: null, blob: null })
    setVersoImage({ imageId: null, blob: null })
    setTags([])
    props.onClose()
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedRecto = recto.trim()
    const trimmedVerso = verso.trim()

    if (!trimmedRecto || !trimmedVerso) return

    await props.onSave(trimmedRecto, trimmedVerso, tags, rectoImage, versoImage)
    closeDialog()
  }

  return (
    <Dialog open={props.isOpen} onOpenChange={(open) => !open && closeDialog()}>
      <DialogContent className="flex h-[min(44rem,calc(var(--app-height)-1.5rem))] w-[calc(100%-1.5rem)] max-w-xl flex-col gap-0 overflow-hidden border border-primary/20 p-6 sm:p-8" onOpenAutoFocus={(event) => event.preventDefault()}>
        <DialogHeader className="shrink-0 pr-10">
          <DialogTitle className="font-display text-2xl font-black text-primary tracking-tight">{isEditing ? "Edit card" : "New card"}</DialogTitle>
        </DialogHeader>

        <form className=" flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
          <div className="min-h-0 pt-7 flex-1 overflow-y-auto pr-1">
            <FloatingLabelTextarea label="Recto" id="flashcard-recto" value={recto} onChange={(event) => setRecto(event.target.value)} placeholder="Question or prompt" />
            <FlashcardImageInput id="flashcard-recto-image" label="Image recto" image={rectoImage} onChange={setRectoImage} />

            <FloatingLabelTextarea label="Verso" id="flashcard-verso" value={verso} onChange={(event) => setVerso(event.target.value)} placeholder="Answer or explanation" containerClassName="mt-5" />
            <FlashcardImageInput id="flashcard-verso-image" label="Image verso" image={versoImage} onChange={setVersoImage} />

            <FlashcardTagsInput isOpen={props.isOpen} folderId={props.folderId} availableTags={availableTags} tags={tags} onChange={setTags} />
          </div>

          <DialogFooter className="mt-6 flex shrink-0">
            <Button
              type="button" variant="ghost"
              onClick={closeDialog}
              className="flex-1 bg-cancel font-black text-cancel-foreground hover:bg-cancel/80"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="font-black flex-1"
            >
              {isEditing ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
