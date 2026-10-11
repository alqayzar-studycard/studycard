import { openDB, type DBSchema } from "idb"
import type { TagColor } from "@/lib/tag-styles"

export type Folder = {
  id: string
  name: string
  color: TagColor
  createdAt: number
}

export type Flashcard = {
  id: string
  folderId: string
  recto: string
  verso: string
  rectoImageId?: string | null
  versoImageId?: string | null
  tags: string[]
  createdAt: number
}

export type ImageRecord = { id: string; blob: Blob; referenceCount: number }
export type ImageSelection = { imageId: string | null; blob: Blob | null }

export type Tag = {
  id: string
  folderId: string
  name: string
  color: TagColor
  createdAt: number
}

type FolderTagSelection = {
  folderId: string
  tagIds: string[]
}

interface FlashcardsDatabase extends DBSchema {
  folders: {
    key: string
    value: Folder
  }
  flashcards: {
    key: string
    value: Flashcard
  }
  tags: {
    key: string
    value: Tag
  }
  folderTagSelections: {
    key: string
    value: FolderTagSelection
  }
  images: { key: string; value: ImageRecord }
}

const dbPromise = openDB<FlashcardsDatabase>("flashcards", 6, {
  upgrade(database, oldVersion) {
    if (!database.objectStoreNames.contains("folders")) {
      database.createObjectStore("folders", { keyPath: "id" })
    }

    if (oldVersion < 4) {
      if (database.objectStoreNames.contains("flashcards")) {
        database.deleteObjectStore("flashcards")
      }

      if (database.objectStoreNames.contains("tags")) {
        database.deleteObjectStore("tags")
      }

      database.createObjectStore("flashcards", { keyPath: "id" })
      database.createObjectStore("tags", { keyPath: "id" })
    }

    if (!database.objectStoreNames.contains("folderTagSelections")) {
      database.createObjectStore("folderTagSelections", { keyPath: "folderId" })
    }
    if (!database.objectStoreNames.contains("images")) database.createObjectStore("images", { keyPath: "id" })
  },
})

function getFolderRange(folderId: string) {
  return IDBKeyRange.bound(`${folderId}/`, `${folderId}/\uffff`)
}

export async function getFolders() {
  const folders = await (await dbPromise).getAll("folders")
  return folders.sort((first, second) => first.createdAt - second.createdAt)
}

export async function saveFolder(folder: Folder) {
  await (await dbPromise).put("folders", folder)
}

export async function deleteFolder(folderId: string) {
  const database = await dbPromise
  const transaction = database.transaction(["folders", "flashcards", "tags", "images"], "readwrite")
  const flashcards = await transaction.objectStore("flashcards").getAll(getFolderRange(folderId))
  const tagKeys = await transaction.objectStore("tags").getAllKeys(getFolderRange(folderId))

  await transaction.objectStore("folders").delete(folderId)
  for (const flashcard of flashcards) {
    await releaseImage(transaction, flashcard.rectoImageId)
    await releaseImage(transaction, flashcard.versoImageId)
    await transaction.objectStore("flashcards").delete(flashcard.id)
  }
  await Promise.all(tagKeys.map((key) => transaction.objectStore("tags").delete(key)))
  await transaction.done
}

export async function getFlashcardsForFolder(folderId: string) {
  const flashcards = await (await dbPromise).getAll("flashcards", getFolderRange(folderId))
  return flashcards.sort((first, second) => second.createdAt - first.createdAt)
}

async function releaseImage(transaction: any, imageId?: string | null) {
  if (!imageId) return
  const image = await transaction.objectStore("images").get(imageId)
  if (!image) return
  if (image.referenceCount <= 1) await transaction.objectStore("images").delete(imageId)
  else await transaction.objectStore("images").put({ ...image, referenceCount: image.referenceCount - 1 })
}

async function retainImage(transaction: any, selection: ImageSelection, previousImageId?: string | null) {
  if (selection.blob) {
    const imageId = crypto.randomUUID()
    await transaction.objectStore("images").put({ id: imageId, blob: selection.blob, referenceCount: 1 })
    return imageId
  }
  if (!selection.imageId || selection.imageId === previousImageId) return selection.imageId
  const image = await transaction.objectStore("images").get(selection.imageId)
  if (image) await transaction.objectStore("images").put({ ...image, referenceCount: image.referenceCount + 1 })
  return selection.imageId
}

export async function saveFlashcard(flashcard: Flashcard, rectoImage: ImageSelection, versoImage: ImageSelection) {
  const database = await dbPromise
  const transaction = database.transaction(["flashcards", "images"], "readwrite")
  const previous = await transaction.objectStore("flashcards").get(flashcard.id)
  const rectoImageId = await retainImage(transaction, rectoImage, previous?.rectoImageId)
  const versoImageId = await retainImage(transaction, versoImage, previous?.versoImageId)
  if (previous?.rectoImageId !== rectoImageId) await releaseImage(transaction, previous?.rectoImageId)
  if (previous?.versoImageId !== versoImageId) await releaseImage(transaction, previous?.versoImageId)
  await transaction.objectStore("flashcards").put({ ...flashcard, rectoImageId, versoImageId })
  await transaction.done
}

export async function duplicateFlashcard(flashcard: Flashcard) {
  const database = await dbPromise
  const transaction = database.transaction(["flashcards", "images"], "readwrite")
  const duplicate = { ...flashcard, id: `${flashcard.folderId}/${crypto.randomUUID()}`, createdAt: Date.now() }
  for (const imageId of [duplicate.rectoImageId, duplicate.versoImageId]) {
    if (!imageId) continue
    const image = await transaction.objectStore("images").get(imageId)
    if (image) await transaction.objectStore("images").put({ ...image, referenceCount: image.referenceCount + 1 })
  }
  await transaction.objectStore("flashcards").put(duplicate)
  await transaction.done
}

export async function deleteFlashcard(id: string) {
  const database = await dbPromise
  const transaction = database.transaction(["flashcards", "images"], "readwrite")
  const flashcard = await transaction.objectStore("flashcards").get(id)
  if (flashcard) {
    await releaseImage(transaction, flashcard.rectoImageId)
    await releaseImage(transaction, flashcard.versoImageId)
    await transaction.objectStore("flashcards").delete(id)
  }
  await transaction.done
}

export async function getImages(imageIds: string[]) {
  const database = await dbPromise
  return (await Promise.all(imageIds.map((id) => database.get("images", id)))).filter((image): image is ImageRecord => image !== undefined)
}

export async function getTagsForFolder(folderId: string) {
  const tags = await (await dbPromise).getAll("tags", getFolderRange(folderId))
  return tags.sort((first, second) => first.name.localeCompare(second.name))
}

export async function saveTags(tags: Tag[]) {
  const database = await dbPromise
  const transaction = database.transaction("tags", "readwrite")

  for (const tag of tags) {
    await transaction.store.put(tag)
  }

  await transaction.done
}

export async function getSelectedTagIds(folderId: string) {
  return (await (await dbPromise).get("folderTagSelections", folderId))?.tagIds ?? []
}

export async function saveSelectedTagIds(folderId: string, tagIds: string[]) {
  await (await dbPromise).put("folderTagSelections", { folderId, tagIds })
}
