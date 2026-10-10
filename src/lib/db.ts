import { openDB } from "idb"

/** Shared IndexedDB connection reserved for future application data. */
export const dbPromise = openDB("flashcards", 1)
