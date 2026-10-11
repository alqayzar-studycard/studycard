import { Route, Routes } from "react-router-dom"

import { FolderPage } from "@/pages/FolderPage"
import { MainPage } from "@/pages/MainPage"

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/:folderId" element={<FolderPage />} />
    </Routes>
  )
}
