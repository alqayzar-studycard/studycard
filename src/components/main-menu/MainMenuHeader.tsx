import { BookOpen } from "lucide-react"
import { Link } from "react-router-dom"

import { MainMenuTabs } from "@/components/main-menu/MainMenuTabs"
import { mainMenuTabs, type MainMenuTab } from "@/lib/main-menu"

type MainMenuHeaderProps = {
  activeTab: MainMenuTab
  onSelectTab: (tab: MainMenuTab) => void
}

export function MainMenuHeader(props: MainMenuHeaderProps) {
  const goToFolders = () => props.onSelectTab("folders")

  return (
    <header className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-5xl px-5 pt-4 sm:px-8 sm:pt-5">
        <div className="pb-4 sm:pb-5">
          <Link className="inline-flex items-center gap-3" to="/" aria-label="Study home" onClick={goToFolders}>
            <span className="grid size-10 -rotate-3 place-items-center rounded-[var(--radius)] bg-secondary text-paper shadow-[3px_3px_0_var(--ink)]">
              <BookOpen className="size-5" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <span className="font-display text-2xl font-black tracking-tight">study</span>
          </Link>
        </div>
        <h1 className="sr-only">{mainMenuTabs.find((tab) => tab.id === props.activeTab)?.label}</h1>
        <div className="pt-9 sm:pt-11">
          <MainMenuTabs activeTab={props.activeTab} onSelectTab={props.onSelectTab} />
        </div>
      </div>
    </header>
  )
}
