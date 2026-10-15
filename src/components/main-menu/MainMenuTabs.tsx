import { useRef, type KeyboardEvent } from "react"

import { mainMenuTabs, type MainMenuTab } from "@/lib/main-menu"

type MainMenuTabsProps = {
  activeTab: MainMenuTab
  onSelectTab: (tab: MainMenuTab) => void
}

export function MainMenuTabs(props: MainMenuTabsProps) {
  const tabsRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number
    switch (event.key) {
      case "ArrowRight": nextIndex = (index + 1) % mainMenuTabs.length; break
      case "ArrowLeft": nextIndex = (index + mainMenuTabs.length - 1) % mainMenuTabs.length; break
      case "Home": nextIndex = 0; break
      case "End": nextIndex = mainMenuTabs.length - 1; break
      default: return
    }

    event.preventDefault()
    const nextTab = mainMenuTabs[nextIndex].id
    props.onSelectTab(nextTab)
    tabsRef.current?.querySelector<HTMLButtonElement>(`#main-menu-tab-${nextTab}`)?.focus({ preventScroll: true })
  }

  return (
    <div ref={tabsRef} className="main-menu-tabs" data-active={props.activeTab} role="tablist" aria-label="Library sections">
      {mainMenuTabs.map((tab, index) => (
        <button
          key={tab.id}
          id={`main-menu-tab-${tab.id}`}
          type="button"
          role="tab"
          aria-selected={props.activeTab === tab.id}
          aria-controls={`main-menu-panel-${tab.id}`}
          tabIndex={props.activeTab === tab.id ? 0 : -1}
          data-tab={tab.id}
          className="main-menu-tab font-display text-5xl font-black leading-tight tracking-tight focus-visible:outline-2 focus-visible:outline-offset-2 sm:text-6xl"
          onClick={() => props.onSelectTab(tab.id)}
          onKeyDown={(event) => handleKeyDown(event, index)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
