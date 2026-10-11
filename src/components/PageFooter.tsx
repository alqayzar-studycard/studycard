import { WaveDivider } from "@/components/WaveDivider"

export function PageFooter() {
  return (
    <footer className="relative h-16 shrink-0 overflow-hidden" aria-hidden="true">
      <WaveDivider className="top-0 rotate-180 fill-primary" height={64} depth={0.2} frequency={2} />
    </footer>
  )
}
