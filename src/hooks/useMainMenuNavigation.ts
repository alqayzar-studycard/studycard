import { useCallback, useLayoutEffect, useRef, useState, type MouseEvent, type PointerEvent, type UIEvent } from "react"

import { mainMenuTabs, type MainMenuTab } from "@/lib/main-menu"

export function useMainMenuNavigation() {
  const [activeTab, setActiveTab] = useState<MainMenuTab>("folders")
  const activeTabRef = useRef<MainMenuTab>("folders")
  const pagerRef = useRef<HTMLDivElement>(null)
  const gestureRef = useRef<{ id: number; x: number; y: number; dragging: boolean } | null>(null)
  const suppressClickUntilRef = useRef(0)

  const selectTab = useCallback((tab: MainMenuTab) => {
    const pager = pagerRef.current
    if (!pager) return

    const index = mainMenuTabs.findIndex((item) => item.id === tab)
    pager.scrollTo({
      left: index * pager.clientWidth,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    })
  }, [])

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const pager = event.currentTarget
    if (!pager.clientWidth) return

    const index = Math.min(mainMenuTabs.length - 1, Math.max(0, Math.round(pager.scrollLeft / pager.clientWidth)))
    const tab = mainMenuTabs[index].id
    activeTabRef.current = tab
    setActiveTab(tab)
  }

  useLayoutEffect(() => {
    const pager = pagerRef.current
    if (!pager) return

    let previousWidth = pager.clientWidth
    const observer = new ResizeObserver(() => {
      if (pager.clientWidth === previousWidth) return
      previousWidth = pager.clientWidth
      const index = mainMenuTabs.findIndex((tab) => tab.id === activeTabRef.current)
      pager.scrollTo({ left: index * previousWidth, behavior: "instant" })
    })

    observer.observe(pager)
    return () => observer.disconnect()
  }, [])

  // Lists page horizontally with native scrolling. The stationary header also
  // accepts horizontal touch swipes, without taking over vertical gestures.
  const handleHeaderPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.pointerType === "mouse") return
    suppressClickUntilRef.current = 0
    gestureRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY, dragging: false }
  }

  const handleHeaderPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current
    if (!gesture || event.pointerId !== gesture.id) return

    const dx = event.clientX - gesture.x
    const dy = event.clientY - gesture.y
    if (!gesture.dragging && Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.25) {
      gesture.dragging = true
      event.currentTarget.setPointerCapture(event.pointerId)
    }
  }

  const handleHeaderPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current
    gestureRef.current = null
    if (!gesture || event.pointerId !== gesture.id || !gesture.dragging) return

    suppressClickUntilRef.current = performance.now() + 350
    const dx = event.clientX - gesture.x
    const dy = event.clientY - gesture.y
    if (Math.abs(dx) >= 50 && Math.abs(dx) > Math.abs(dy) * 1.25) {
      selectTab(dx < 0 ? "maps" : "folders")
    }
  }

  const handleHeaderPointerCancel = () => {
    gestureRef.current = null
  }

  const handleHeaderClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (performance.now() >= suppressClickUntilRef.current) return
    event.preventDefault()
    event.stopPropagation()
    suppressClickUntilRef.current = 0
  }

  return {
    activeTab,
    pagerRef,
    selectTab,
    handleScroll,
    headerSwipeHandlers: {
      onPointerDown: handleHeaderPointerDown,
      onPointerMove: handleHeaderPointerMove,
      onPointerUp: handleHeaderPointerUp,
      onPointerCancel: handleHeaderPointerCancel,
      onClickCapture: handleHeaderClickCapture,
    },
  }
}
