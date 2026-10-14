import { useEffect, useRef, useState } from "react"
import { BookOpen, Plus } from "lucide-react"
import { Link } from "react-router-dom"

import { FolderCard } from "@/components/FolderCard"
import { NewFolderDialog } from "@/components/NewFolderDialog"
import { PageFooter } from "@/components/PageFooter"
import { WaveDivider } from "@/components/WaveDivider"
import { Button } from "@/components/ui/button"
import { useStudyData } from "@/contexts/StudyDataContext"
import type { Folder as FolderType } from "@/lib/db"

export function MainPage() {
  const { folders, createFolder, updateFolder, removeFolder } = useStudyData()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingFolder, setEditingFolder] = useState<FolderType | null>(null)
  const hasHandledReload = useRef(false)

  useEffect(() => {
    // A reload writes "false" first; the resulting page load switches it back
    // to "true" without reloading, so this cannot loop.
    if (hasHandledReload.current) return
    hasHandledReload.current = true

    const marker = window.localStorage.getItem("need-reload")
    const shouldReload = marker !== "false"
    window.localStorage.setItem("need-reload", shouldReload ? "false" : "true")

    if (shouldReload) window.location.reload()
  }, [])

  const updateFolderName = async (name: string) => {
    if (!editingFolder) return
    await updateFolder(editingFolder.id, name)
  }

  const closeFolderDialog = () => {
    setIsDialogOpen(false)
    setEditingFolder(null)
  }

  return (
    <main className="relative flex h-full flex-col overflow-hidden bg-paper text-ink">
      <section className="relative z-0 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-5xl px-5 py-4 sm:px-8 sm:py-5">
          <header className="border-b-none border-primary-foreground/30 pb-4 sm:pb-5">
          <Link className="flex items-center gap-3" to="/" aria-label="Study home">
            <span className="grid size-10 -rotate-3 place-items-center rounded-[var(--radius)] bg-secondary text-paper shadow-[3px_3px_0_var(--ink)]">
              <BookOpen className="size-5" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <span className="font-display text-2xl font-black tracking-tight">study</span>
          </Link>
        </header>

          <section className="pt-9 pb-8 sm:pt-11 sm:pb-10" aria-labelledby="library-title">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <h1 id="library-title" className="font-display text-5xl font-black leading-none tracking-tight sm:text-6xl">Folders</h1>
              <Button
                type="button"
                onClick={() => setIsDialogOpen(true)}
                className="mt-4 h-auto bg-secondary py-2.5 font-bold border-4 border-primary-foreground/45 text-paper hover:bg-accent hover:text-ink"
              >
                <Plus className="size-4" strokeWidth={2} aria-hidden="true" />
                New folder
              </Button>
            </div>
            <p className="rounded-[var(--radius)] text-sm font-bold">{folders.length} folders</p>
          </div>
          </section>
        </div>
        <WaveDivider className="fill-primary" height={50} depth={0.1} frequency={4} />
      </section>

      <section className="relative z-10 -mt-5 min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-5 pb-7 sm:-mt-6 sm:px-8 sm:pb-9" aria-label="Folder list">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-2 sm:grid-cols-2">
            {folders.length === 0 ? (
              <div className="flex min-h-36 flex-col items-center justify-center border-2 border-dashed border-primary/45 bg-paper px-5 py-6 text-center sm:col-span-2">
                <span className="grid size-10 place-items-center rounded-[var(--radius)] bg-sage text-forest">
                  <BookOpen className="size-5" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <h2 className="mt-3 font-display text-xl font-bold">Your library is waiting</h2>
                <p className="mt-1 text-sm text-muted-foreground">Create a folder to begin your study collection.</p>
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(true)} className="mt-4 border border-forest text-forest hover:bg-sage">
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
          </div>
        </div>
      </section>

      <PageFooter />

      <NewFolderDialog
        isOpen={isDialogOpen}
        folder={editingFolder}
        onClose={closeFolderDialog}
        onSave={editingFolder ? updateFolderName : createFolder}
      />
    </main>
  )
}
