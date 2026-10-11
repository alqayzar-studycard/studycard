import { useEffect, useState, type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FloatingLabelInput } from "@/components/ui/floating-label-input"
import type { Folder } from "@/lib/db"

type NewFolderDialogProps = {
  isOpen: boolean
  folder?: Folder | null
  onClose: () => void
  onSave: (name: string) => Promise<void>
}

export function NewFolderDialog(props: NewFolderDialogProps) {
  const [folderName, setFolderName] = useState("")
  const isEditing = props.folder !== null && props.folder !== undefined

  useEffect(() => {
    setFolderName(props.folder?.name ?? "")
  }, [props.folder, props.isOpen])

  const closeDialog = () => {
    setFolderName("")
    props.onClose()
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const name = folderName.trim()

    if (!name) return

    await props.onSave(name)
    closeDialog()
  }

  return (
    <Dialog open={props.isOpen} onOpenChange={(open) => !open && closeDialog()}>
      <DialogContent onOpenAutoFocus={(event) => event.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="font-display text-3xl text-primary font-bold tracking-tight">{isEditing ? "Edit folder" : "Create a folder"}</DialogTitle>
        </DialogHeader>

        <form className="mt-7" onSubmit={handleSubmit}>
          <FloatingLabelInput label="Folder name" id="folder-name" value={folderName} onChange={(event) => setFolderName(event.target.value)} placeholder="e.g. Modern poetry" />
          <DialogFooter className="mt-6 flex">
            <Button
              type="button" variant="ghost" onClick={closeDialog}
              className="bg-cancel font-bold text-cancel-foreground hover:bg-cancel/80 flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="font-bold flex-1"
            >
              {isEditing ? "Save changes" : "Create folder"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
