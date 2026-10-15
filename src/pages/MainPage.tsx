import { useEffect, useRef } from "react"

import { PageFooter } from "@/components/PageFooter"
import { FoldersPanel } from "@/components/main-menu/FoldersPanel"
import { MainMenuHeader } from "@/components/main-menu/MainMenuHeader"
import { MapsPanel } from "@/components/main-menu/MapsPanel"
import { useMainMenuNavigation } from "@/hooks/useMainMenuNavigation"

export function MainPage() {
  const { activeTab, pagerRef, selectTab, handleScroll, headerSwipeHandlers } = useMainMenuNavigation()
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

  return (
    <main className="relative flex h-full flex-col overflow-hidden bg-paper text-ink">
      <div className="shrink-0 touch-pan-y touch-pinch-zoom" {...headerSwipeHandlers}>
        <MainMenuHeader activeTab={activeTab} onSelectTab={selectTab} />
      </div>
      <div ref={pagerRef} className="flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain" onScroll={handleScroll}>
        <FoldersPanel isActive={activeTab === "folders"} />
        <MapsPanel isActive={activeTab === "maps"} />
      </div>
      <PageFooter />
    </main>
  )
}
