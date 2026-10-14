import { useLayoutEffect, useRef } from "react"

const COLLAPSE_SCROLL_DISTANCE = 240
const FOLLOW_DELAY_MS = 120

function getScrollProgress(scrollTop: number) {
  const progress = Math.min(1, Math.max(0, scrollTop / COLLAPSE_SCROLL_DISTANCE))
  // Ease by scroll distance, not elapsed time, so a paused scroll holds its position.
  return progress * progress * (3 - 2 * progress)
}

export function useFolderHeaderScroll(folderId: string) {
  const headerRef = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLElement>(null)
  const compensationRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const header = headerRef.current
    const list = listRef.current
    const compensation = compensationRef.current
    if (!header || !list || !compensation) return

    let frameId: number | null = null
    let targetProgress = 0
    let displayedProgress = 0
    let previousFrameTime = performance.now()

    const applyProgress = (progress: number) => {
      const value = String(progress)
      // Scope invalidation to these surfaces instead of the entire flashcard list.
      header.style.setProperty("--folder-header-progress", value)
      compensation.style.setProperty("--folder-header-progress", value)
    }

    applyProgress(0)
    list.scrollTop = 0

    const animateProgress = (frameTime: number) => {
      const elapsedTime = Math.min(frameTime - previousFrameTime, 64)
      previousFrameTime = frameTime
      const followAmount = 1 - Math.exp(-elapsedTime / FOLLOW_DELAY_MS)
      const nextProgress = displayedProgress + (targetProgress - displayedProgress) * followAmount

      if (Math.abs(targetProgress - nextProgress) < 0.0005) {
        displayedProgress = targetProgress
        applyProgress(displayedProgress)
        frameId = null
        return
      }

      displayedProgress = nextProgress
      applyProgress(displayedProgress)
      frameId = requestAnimationFrame(animateProgress)
    }

    const updateTargetProgress = () => {
      targetProgress = getScrollProgress(list.scrollTop)
      if (frameId === null) {
        previousFrameTime = performance.now()
        frameId = requestAnimationFrame(animateProgress)
      }
    }

    list.addEventListener("scroll", updateTargetProgress, { passive: true })
    const resizeObserver = new ResizeObserver(updateTargetProgress)
    resizeObserver.observe(list)

    return () => {
      list.removeEventListener("scroll", updateTargetProgress)
      resizeObserver.disconnect()
      if (frameId !== null) cancelAnimationFrame(frameId)
      header.style.removeProperty("--folder-header-progress")
      compensation.style.removeProperty("--folder-header-progress")
    }
  }, [folderId])

  return { headerRef, listRef, compensationRef }
}
