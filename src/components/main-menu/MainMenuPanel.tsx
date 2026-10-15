import type { ReactNode } from "react"
import { Plus } from "lucide-react"

import { WaveDivider } from "@/components/WaveDivider"
import { Button } from "@/components/ui/button"
import { mainMenuTabs, type MainMenuTab } from "@/lib/main-menu"

type MainMenuPanelProps = {
  tab: MainMenuTab
  isActive: boolean
  count: number
  onCreate?: () => void
  children: ReactNode
}

export function MainMenuPanel(props: MainMenuPanelProps) {
  const tab = mainMenuTabs.find((item) => item.id === props.tab)!

  return (
    <section
      id={`main-menu-panel-${props.tab}`}
      role="tabpanel"
      aria-labelledby={`main-menu-tab-${props.tab}`}
      aria-hidden={!props.isActive}
      inert={!props.isActive}
      tabIndex={props.isActive ? 0 : -1}
      className="relative isolate flex h-full w-full min-w-0 shrink-0 snap-start snap-always flex-col"
    >
      <div className="relative z-0 shrink-0 bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-5xl items-end justify-between gap-5 px-5 pb-12 pt-2 sm:px-8 sm:pb-15">
          <Button
            type="button"
            onClick={props.onCreate}
            disabled={!props.onCreate}
            title={props.onCreate ? undefined : "Map creation will be added next"}
            className="h-auto border-4 border-primary-foreground/45 bg-secondary py-2.5 font-bold text-paper hover:bg-accent hover:text-ink"
          >
            <Plus className="size-4" strokeWidth={2} aria-hidden="true" />
            {tab.actionLabel}
          </Button>
          <p className="text-sm font-bold">{props.count} {tab.id}</p>
        </div>
        <WaveDivider className="fill-primary" height={50} depth={0.1} frequency={4} />
      </div>
      <section className="relative z-10 -mt-5 min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-5 pb-7 sm:-mt-6 sm:px-8 sm:pb-9" aria-label={tab.listLabel}>
        <div className="mx-auto grid max-w-5xl gap-2 sm:grid-cols-2">
          {props.children}
        </div>
      </section>
    </section>
  )
}
