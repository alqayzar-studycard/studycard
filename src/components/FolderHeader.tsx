import { useLayoutEffect, useRef, type Ref } from "react"
import { ArrowLeft, Tag } from "lucide-react"
import { Link } from "react-router-dom"

import { SelectedTags } from "@/components/SelectedTags"
import { WaveDivider } from "@/components/WaveDivider"
import { Button } from "@/components/ui/button"
import { useStudyData } from "@/contexts/StudyDataContext"

type FolderHeaderProps = {
  ref?: Ref<HTMLElement>
  title: string
  cardCount: number
  onOpenTags: () => void
}

export function FolderHeader(props: FolderHeaderProps) {
  const { selectedTagIds, toggleSelectedTag } = useStudyData()
  const headingRef = useRef<HTMLDivElement>(null)
  const backLinkRef = useRef<HTMLAnchorElement>(null)

  useLayoutEffect(() => {
    const heading = headingRef.current
    const backLink = backLinkRef.current
    if (!heading || !backLink) return

    const measureBackLink = () => {
      heading.style.setProperty("--folder-back-link-width", `${backLink.getBoundingClientRect().width}px`)
    }

    measureBackLink()
    const observer = new ResizeObserver(measureBackLink)
    observer.observe(backLink)
    return () => observer.disconnect()
  }, [])

  const removeSelectedTag = (tagId: string) => {
    void toggleSelectedTag(tagId)
  }

  return (
    <header ref={props.ref} className="folder-header relative z-0 mx-3 mt-3 shrink-0 rounded-t-[var(--radius)] bg-primary text-primary-foreground sm:mx-5 sm:mt-5" aria-labelledby="folder-title">
      <div className="mx-auto max-w-5xl px-5 py-4 sm:px-8 sm:py-5">
        <div className="pt-3 pb-8 sm:pt-5 sm:pb-10">
          <div ref={headingRef} className="folder-header-heading">
            <Link ref={backLinkRef} className="absolute left-0 top-0 inline-flex items-center gap-2 text-sm font-bold transition-opacity hover:opacity-80" to="/">
              <ArrowLeft className="size-4" aria-hidden="true" />
              All folders
            </Link>
            <div className="folder-header-title" tabIndex={0} role="region" aria-label="Folder title">
              <h1 id="folder-title" className="w-max font-display text-5xl font-black leading-none tracking-tight sm:text-6xl">{props.title}</h1>
            </div>
          </div>
          <div className="mt-4 min-w-0">
            <div className="flex items-center gap-3">
              <Button type="button" variant="ghost" onClick={props.onOpenTags} className="relative h-8 border border-primary-foreground/35 bg-primary-foreground/10 px-3 font-bold text-primary-foreground hover:bg-primary-foreground/20">
                <Tag className="size-3.5" aria-hidden="true" />
                Tags
                {selectedTagIds.length > 0 && (
                  <span className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-paper text-xs font-black text-primary shadow-sm">
                    {selectedTagIds.length}
                  </span>
                )}
              </Button>
              <p className="rounded-[var(--radius)] text-sm font-bold">{props.cardCount} cards</p>
            </div>
            <SelectedTags tagIds={selectedTagIds} onRemove={removeSelectedTag} />
          </div>
        </div>
      </div>
      <WaveDivider className="fill-primary" height={50} depth={0.1} frequency={4} />
    </header>
  )
}
