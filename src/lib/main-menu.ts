export const mainMenuTabs = [
  { id: "folders", label: "Folders", actionLabel: "New folder", listLabel: "Folder list" },
  { id: "maps", label: "Maps", actionLabel: "New map", listLabel: "Map list" },
] as const

export type MainMenuTab = typeof mainMenuTabs[number]["id"]
