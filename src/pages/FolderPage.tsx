import { useEffect, useState } from "react"
import { GraduationCap, Layers, Plus } from "lucide-react"
import { Link, useParams } from "react-router-dom"

import { FolderHeader } from "@/components/FolderHeader"
import { PageFooter } from "@/components/PageFooter"
import { NewFlashcardDialog } from "@/components/NewFlashcardDialog"
import { FlashcardCard } from "@/components/FlashcardCard"
import { TagsDialog } from "@/components/TagsDialog"
import { Button } from "@/components/ui/button"
import { useStudyData } from "@/contexts/StudyDataContext"
import { useFolderHeaderScroll } from "@/hooks/useFolderHeaderScroll"
import type { Flashcard, ImageSelection, Tag as FlashcardTag } from "@/lib/db"

export function FolderPage() {
  const { folderId = "" } = useParams()
  const { folders, activeFolderId, flashcards: loadedFlashcards, selectedTagIds, loadFolderData, toggleSelectedTag, clearSelectedTags, createFlashcard, updateFlashcard, removeFlashcard, duplicateFlashcard } = useStudyData()
  const folder = folders.find((currentFolder) => currentFolder.id === folderId) ?? null
  const flashcards = activeFolderId === folderId ? loadedFlashcards : []
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isTagsDialogOpen, setIsTagsDialogOpen] = useState(false)
  const [editingFlashcard, setEditingFlashcard] = useState<Flashcard | null>(null)
  const { headerRef, listRef, compensationRef } = useFolderHeaderScroll(folderId)

  useEffect(() => {
    setIsTagsDialogOpen(false)
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

  const openTagsDialog = () => {
    setIsTagsDialogOpen(true)
  }

  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-paper text-ink">
      <FolderHeader ref={headerRef} title={title} cardCount={filteredFlashcards.length} onOpenTags={openTagsDialog} />

      <section ref={listRef} className="folder-flashcard-list relative z-10 -mt-5 min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-5 pb-7 sm:-mt-6 sm:px-8 sm:pb-9" aria-label="Flashcard list">
        <div className="mx-auto max-w-5xl">
          {folder === null ? (
            <div className="border-2 border-dashed border-primary/45 bg-paper px-5 py-8 text-center">
              <p className="font-display text-xl font-bold">This folder no longer exists.</p>
              <Link className="mt-3 inline-block text-sm font-bold text-forest underline" to="/">Return to folders</Link>
            </div>
          ) : filteredFlashcards.length === 0 ? (
            <div className="flashcard-surface flex min-h-36 flex-col items-center justify-center border-2 border-dashed border-primary/45 px-5 py-6 text-center">
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
        <div ref={compensationRef} className="folder-scroll-compensation" aria-hidden="true" />
      </section>

      <div className="fixed inset-x-0 bottom-0 z-30 px-5 py-3 sm:px-8">
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
