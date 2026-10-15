import { useState } from "react"
import { BookOpen, Plus } from "lucide-react"

import { FolderCard } from "@/components/FolderCard"
import { NewFolderDialog } from "@/components/NewFolderDialog"
import { MainMenuPanel } from "@/components/main-menu/MainMenuPanel"
import { Button } from "@/components/ui/button"
import { useStudyData } from "@/contexts/StudyDataContext"
import type { Folder } from "@/lib/db"

export function FoldersPanel(props: { isActive: boolean }) {
  const { folders, createFolder, updateFolder, removeFolder } = useStudyData()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null)

  const openNewFolderDialog = () => {
    setEditingFolder(null)
    setIsDialogOpen(true)
  }

  const updateFolderName = async (name: string) => {
    if (!editingFolder) return
    await updateFolder(editingFolder.id, name)
  }

  const closeFolderDialog = () => {
    setIsDialogOpen(false)
    setEditingFolder(null)
  }

  return (
    <>
      <MainMenuPanel tab="folders" isActive={props.isActive} count={folders.length} onCreate={openNewFolderDialog}>
        {folders.length === 0 ? (
          <div className="flex min-h-36 flex-col items-center justify-center border-2 border-dashed border-primary/45 bg-paper px-5 py-6 text-center sm:col-span-2">
            <span className="grid size-10 place-items-center rounded-[var(--radius)] bg-sage text-forest">
              <BookOpen className="size-5" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <h2 className="mt-3 font-display text-xl font-bold">Your library is waiting</h2>
            <p className="mt-1 text-sm text-muted-foreground">Create a folder to begin your study collection.</p>
            <Button type="button" variant="ghost" onClick={openNewFolderDialog} className="mt-4 border border-forest text-forest hover:bg-sage">
              <Plus className="size-4" aria-hidden="true" />
              Create your first folder
            </Button>
          </div>
        ) : folders.map((folder) => (
          <FolderCard
            key={folder.id}
            folder={folder}
            onEdit={() => { setEditingFolder(folder); setIsDialogOpen(true) }}
            onDelete={() => void removeFolder(folder.id)}
          />
        ))}
      </MainMenuPanel>
      <NewFolderDialog
        isOpen={isDialogOpen}
        folder={editingFolder}
        onClose={closeFolderDialog}
        onSave={editingFolder ? updateFolderName : createFolder}
      />
    </>
  )
}
