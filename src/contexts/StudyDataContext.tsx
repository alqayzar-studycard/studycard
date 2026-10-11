import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react"

import { deleteFlashcard, deleteFolder, duplicateFlashcard as duplicateFlashcardInDB, getFlashcardsForFolder, getFolders, getImages, getSelectedTagIds, getTagsForFolder, saveFlashcard, saveFolder, saveSelectedTagIds, saveTags, type Flashcard, type Folder, type ImageRecord, type ImageSelection, type Tag } from "@/lib/db"
import { getRandomTagColor } from "@/lib/tag-styles"

type StudyDataContextValue = {
  folders: Folder[]
  activeFolderId: string | null
  flashcards: Flashcard[]
  tags: Tag[]
  getImageById: (imageId: string) => ImageRecord | undefined
  selectedTagIds: string[]
  isLoading: boolean
  getTagById: (tagId: string) => Tag | undefined
  loadFolderData: (folderId: string) => Promise<void>
  toggleSelectedTag: (tagId: string) => Promise<void>
  clearSelectedTags: () => Promise<void>
  createFolder: (name: string) => Promise<void>
  updateFolder: (id: string, name: string) => Promise<void>
  removeFolder: (id: string) => Promise<void>
  createFlashcard: (folderId: string, recto: string, verso: string, tags: Tag[], rectoImage: ImageSelection, versoImage: ImageSelection) => Promise<void>
  updateFlashcard: (flashcard: Flashcard, recto: string, verso: string, tags: Tag[], rectoImage: ImageSelection, versoImage: ImageSelection) => Promise<void>
  removeFlashcard: (id: string) => Promise<void>
  duplicateFlashcard: (flashcard: Flashcard) => Promise<void>
}

const StudyDataContext = createContext<StudyDataContextValue | null>(null)

const legacyStarterFolderIds = new Set(["literature", "history", "languages", "science"])

export function StudyDataProvider(props: { children: ReactNode }) {
  const [folders, setFolders] = useState<Folder[]>([])
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null)
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [images, setImages] = useState<ImageRecord[]>([])
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const activeFolderIdRef = useRef<string | null>(null)
  const selectedTagIdsRef = useRef<string[]>([])

  useEffect(() => {
    let isActive = true

    const loadFolders = async () => {
      const savedFolders = await getFolders()
      const legacyFolders = savedFolders.filter((folder) => legacyStarterFolderIds.has(folder.id))
      await Promise.all(legacyFolders.map((folder) => deleteFolder(folder.id)))

      if (!isActive) return
      const currentFolders = savedFolders.filter((folder) => !legacyStarterFolderIds.has(folder.id))
      const foldersWithColors = await Promise.all(currentFolders.map(async (folder) => {
        if (folder.color) return folder

        const updatedFolder = { ...folder, color: getRandomTagColor() }
        await saveFolder(updatedFolder)
        return updatedFolder
      }))

      setFolders(foldersWithColors)
      setIsLoading(false)
    }

    void loadFolders()
    return () => { isActive = false }
  }, [])

  const loadFolderData = useCallback(async (folderId: string) => {
    activeFolderIdRef.current = folderId
    setActiveFolderId(folderId)
    setFlashcards([])
    setTags([])
    selectedTagIdsRef.current = []
    setSelectedTagIds([])

    const [savedFlashcards, savedTags, savedSelectedTagIds] = await Promise.all([
      getFlashcardsForFolder(folderId),
      getTagsForFolder(folderId),
      getSelectedTagIds(folderId),
    ])

    const imageIds = savedFlashcards.flatMap((flashcard) => [flashcard.rectoImageId, flashcard.versoImageId]).filter((id): id is string => Boolean(id))
    const savedImages = await getImages(imageIds)
    if (activeFolderIdRef.current !== folderId) return
    setFlashcards(savedFlashcards)
    setTags(savedTags)
    setImages(savedImages)
    selectedTagIdsRef.current = savedSelectedTagIds
    setSelectedTagIds(savedSelectedTagIds)
  }, [])

  const toggleSelectedTag = useCallback(async (tagId: string) => {
    const folderId = activeFolderIdRef.current
    if (!folderId) return

    const nextTagIds = selectedTagIdsRef.current.includes(tagId)
      ? selectedTagIdsRef.current.filter((currentTagId) => currentTagId !== tagId)
      : [...selectedTagIdsRef.current, tagId]

    selectedTagIdsRef.current = nextTagIds
    setSelectedTagIds(nextTagIds)
    await saveSelectedTagIds(folderId, nextTagIds)
  }, [])

  const clearSelectedTags = useCallback(async () => {
    const folderId = activeFolderIdRef.current
    if (!folderId) return

    selectedTagIdsRef.current = []
    setSelectedTagIds([])
    await saveSelectedTagIds(folderId, [])
  }, [])

  const createFolder = useCallback(async (name: string) => {
    const folder: Folder = { id: crypto.randomUUID(), name, color: getRandomTagColor(), createdAt: Date.now() }
    await saveFolder(folder)
    setFolders((currentFolders) => [...currentFolders, folder])
  }, [])

  const updateFolder = useCallback(async (id: string, name: string) => {
    const folder = folders.find((currentFolder) => currentFolder.id === id)
    if (!folder) return

    const updatedFolder = { ...folder, name }
    await saveFolder(updatedFolder)
    setFolders((currentFolders) => currentFolders.map((currentFolder) => currentFolder.id === id ? updatedFolder : currentFolder))
  }, [folders])

  const removeFolder = useCallback(async (id: string) => {
    await deleteFolder(id)
    setFolders((currentFolders) => currentFolders.filter((folder) => folder.id !== id))

    if (activeFolderIdRef.current === id) {
      activeFolderIdRef.current = null
      setActiveFolderId(null)
      setFlashcards([])
      setTags([])
      selectedTagIdsRef.current = []
      setSelectedTagIds([])
    }
  }, [])

  const createFlashcard = useCallback(async (folderId: string, recto: string, verso: string, flashcardTags: Tag[], rectoImage: ImageSelection, versoImage: ImageSelection) => {
    const flashcard: Flashcard = {
      id: `${folderId}/${crypto.randomUUID()}`,
      folderId,
      recto,
      verso,
      tags: flashcardTags.map((tag) => tag.id),
      createdAt: Date.now(),
    }

    await saveFlashcard(flashcard, rectoImage, versoImage)
    await saveTags(flashcardTags)
    await loadFolderData(folderId)
  }, [loadFolderData])

  const updateFlashcard = useCallback(async (flashcard: Flashcard, recto: string, verso: string, flashcardTags: Tag[], rectoImage: ImageSelection, versoImage: ImageSelection) => {
    await saveFlashcard({ ...flashcard, recto, verso, tags: flashcardTags.map((tag) => tag.id) }, rectoImage, versoImage)
    await saveTags(flashcardTags)
    await loadFolderData(flashcard.folderId)
  }, [loadFolderData])

  const removeFlashcard = useCallback(async (id: string) => {
    await deleteFlashcard(id)
    const folderId = id.slice(0, id.indexOf("/"))
    await loadFolderData(folderId)
  }, [loadFolderData])

  const duplicateFlashcard = useCallback(async (flashcard: Flashcard) => {
    await duplicateFlashcardInDB(flashcard)
    await loadFolderData(flashcard.folderId)
  }, [loadFolderData])

  const tagsById = useMemo(() => new Map(tags.map((tag) => [tag.id, tag])), [tags])
  const imagesById = useMemo(() => new Map(images.map((image) => [image.id, image])), [images])
  const getTagById = useCallback((tagId: string) => tagsById.get(tagId), [tagsById])
  const getImageById = useCallback((imageId: string) => imagesById.get(imageId), [imagesById])

  const value = useMemo(() => ({
    folders, activeFolderId, flashcards, tags, selectedTagIds, isLoading, getTagById, getImageById, loadFolderData, toggleSelectedTag, clearSelectedTags,
    createFolder, updateFolder, removeFolder, createFlashcard, updateFlashcard, removeFlashcard, duplicateFlashcard,
  }), [folders, activeFolderId, flashcards, tags, selectedTagIds, isLoading, getTagById, getImageById, loadFolderData, toggleSelectedTag, clearSelectedTags, createFolder, updateFolder, removeFolder, createFlashcard, updateFlashcard, removeFlashcard, duplicateFlashcard])

  return <StudyDataContext.Provider value={value}>{props.children}</StudyDataContext.Provider>
}

export function useStudyData() {
  const context = useContext(StudyDataContext)
  if (!context) throw new Error("useStudyData must be used within StudyDataProvider")
  return context
}
