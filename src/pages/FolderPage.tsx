import { useEffect, useState, type UIEvent } from "react"
import { ArrowLeft, GraduationCap, Layers, Plus, Tag } from "lucide-react"
import { Link, useParams } from "react-router-dom"

import { WaveDivider } from "@/components/WaveDivider"
import { PageFooter } from "@/components/PageFooter"
import { NewFlashcardDialog } from "@/components/NewFlashcardDialog"
import { FlashcardCard } from "@/components/FlashcardCard"
import { TagsDialog } from "@/components/TagsDialog"
import { SelectedTags } from "@/components/SelectedTags"
import { Button } from "@/components/ui/button"
import { useStudyData } from "@/contexts/StudyDataContext"
import type { Flashcard, ImageSelection, Tag as FlashcardTag } from "@/lib/db"
import { cardGlassStyle } from "@/lib/glass-styles"

export function FolderPage() {
  const { folderId = "" } = useParams()
  const { folders, activeFolderId, flashcards: loadedFlashcards, selectedTagIds, loadFolderData, toggleSelectedTag, clearSelectedTags, createFlashcard, updateFlashcard, removeFlashcard, duplicateFlashcard } = useStudyData()
  const folder = folders.find((currentFolder) => currentFolder.id === folderId) ?? null
  const flashcards = activeFolderId === folderId ? loadedFlashcards : []
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isTagsDialogOpen, setIsTagsDialogOpen] = useState(false)
  const [editingFlashcard, setEditingFlashcard] = useState<Flashcard | null>(null)
  const [isTitleCompact, setIsTitleCompact] = useState(false)

  useEffect(() => {
    setIsTagsDialogOpen(false)
    setIsTitleCompact(false)
    void loadFolderData(folderId)
  }, [folderId, loadFolderData])

  const title = folder?.name ?? "Folder not found"

  const createFolderFlashcard = async (recto: string, verso: string, flashcardTags: FlashcardTag[], rectoImage: ImageSelection, versoImage: ImageSelection) => {
    await createFlashcard(folderId, recto, verso, flashcardTags, rectoImage, versoImage)
  }

  const updateFolderFlashcard = async (recto: string, verso: string, flashcardTags: FlashcardTag[], rectoImage: ImageSelection, versoImage: ImageSelection) => {
    if (!editingFlashcard) return
    await updateFlashcard(editingFlashcard, recto, verso, flashcardTags, rectoImage, versoImage)
  }

  const closeFlashcardDialog = () => {
    setIsDialogOpen(false)
    setEditingFlashcard(null)
  }

  const filteredFlashcards = selectedTagIds.length === 0
    ? flashcards
    : flashcards.filter((flashcard) => selectedTagIds.every((tag) => flashcard.tags?.includes(tag)))

  const handleFlashcardListScroll = (event: UIEvent<HTMLElement>) => {
    setIsTitleCompact(event.currentTarget.scrollTop > 0)
  }

  return (
    <main className="app-surface flex h-dvh flex-col overflow-hidden text-ink">
      <section className="relative z-0 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-5xl px-5 py-4 sm:px-8 sm:py-5">
          <section className="pt-3 pb-8 sm:pt-5 sm:pb-10" aria-labelledby="folder-title">
            <div className={`relative min-w-0 transition-[height] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${isTitleCompact ? "h-8" : "h-28"}`}>
              <Link className="absolute left-0 top-0 inline-flex items-center gap-2 text-sm font-bold transition-opacity hover:opacity-80" to="/">
                <ArrowLeft className="size-4" aria-hidden="true" />
                All folders
              </Link>
              <div className={`absolute min-w-0 overflow-x-auto transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${isTitleCompact ? "left-28 right-0 top-0" : "left-0 right-0 top-10"}`}>
                <h1 id="folder-title" className={`w-max font-display font-black leading-none tracking-tight transition-[font-size] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${isTitleCompact ? "text-2xl sm:text-3xl" : "text-5xl sm:text-6xl"}`}>{title}</h1>
              </div>
            </div>
            <div className="mt-4 min-w-0">
              <div className="flex items-center gap-3">
                <Button type="button" variant="ghost" onClick={() => setIsTagsDialogOpen(true)} className="relative h-8 border border-primary-foreground/35 bg-primary-foreground/10 px-3 font-bold text-primary-foreground hover:bg-primary-foreground/20">
                  <Tag className="size-3.5" aria-hidden="true" />
                  Tags
                  {selectedTagIds.length > 0 && (
                    <span className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-paper text-xs font-black text-primary shadow-sm">
                      {selectedTagIds.length}
                    </span>
                  )}
                </Button>
                <p className="rounded-[var(--radius)] text-sm font-bold">
                  {filteredFlashcards.length} cards
                </p>
              </div>
              <SelectedTags tagIds={selectedTagIds} onRemove={(tagId) => void toggleSelectedTag(tagId)} />
            </div>
          </section>
        </div>
        <WaveDivider className="fill-primary" height={50} depth={0.1} frequency={4} />
      </section>

      <section className="relative z-10 -mt-5 min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-5 pb-7 sm:-mt-6 sm:px-8 sm:pb-9" aria-label="Flashcard list" onScroll={handleFlashcardListScroll}>
        <div className="mx-auto max-w-5xl">
          {folder === null ? (
            <div className="border-2 border-dashed border-primary/45 bg-paper px-5 py-8 text-center">
              <p className="font-display text-xl font-bold">This folder no longer exists.</p>
              <Link className="mt-3 inline-block text-sm font-bold text-forest underline" to="/">Return to folders</Link>
            </div>
          ) : filteredFlashcards.length === 0 ? (
            <div className="flashcard-surface flex min-h-36 flex-col items-center justify-center border-2 border-dashed border-primary/45 px-5 py-6 text-center" style={cardGlassStyle}>
              <span className="grid size-10 place-items-center rounded-[var(--radius)] bg-sage text-forest">
                <Layers className="size-5" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h2 className="mt-3 font-display text-xl font-bold">{flashcards.length === 0 ? "No flashcards yet" : "No matching flashcards"}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{flashcards.length === 0 ? "Flashcards for this folder will appear here." : "Try choosing different tags."}</p>
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {filteredFlashcards.map((flashcard) => (
                <FlashcardCard
                  key={flashcard.id}
                  flashcard={flashcard}
                  onDuplicate={() => void duplicateFlashcard(flashcard)}
                  onEdit={() => { setEditingFlashcard(flashcard); setIsDialogOpen(true) }}
                  onDelete={() => void removeFlashcard(flashcard.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-10 px-5 py-3 sm:px-8">
        <div className="mx-auto flex w-full gap-3">
          <Button
            type="button"
            className="h-auto flex-1 border-4 border-study/60 bg-study py-2.5 text-xl font-black text-white hover:bg-study/90"
          >
            <GraduationCap className="size-4" strokeWidth={2} aria-hidden="true" />
            Study
          </Button>
          <Button
            type="button" onClick={() => { setEditingFlashcard(null); setIsDialogOpen(true) }}
            className="h-auto flex-1 border-4 border-secondary/60 bg-secondary py-2.5 text-xl font-black text-paper hover:bg-secondary/90"
          >
            <Plus className="size-4" strokeWidth={2} aria-hidden="true" />
            New
          </Button>
        </div>
      </div>

      <PageFooter />
      <NewFlashcardDialog
        isOpen={isDialogOpen}
        folderId={folderId}
        flashcard={editingFlashcard}
        onClose={closeFlashcardDialog}
        onSave={editingFlashcard ? updateFolderFlashcard : createFolderFlashcard}
      />
      <TagsDialog
        isOpen={isTagsDialogOpen}
        folderId={folderId}
        selectedTags={selectedTagIds}
        onOpenChange={setIsTagsDialogOpen}
        onToggleTag={(tagId) => void toggleSelectedTag(tagId)}
        onClearSelections={() => void clearSelectedTags()}
      />
    </main>
  )
}
