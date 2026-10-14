import { WaveDivider } from "@/components/WaveDivider"

export function PageFooter() {
  return (
    <footer className="relative z-20 h-16 shrink-0 bg-paper" aria-hidden="true">
      <WaveDivider className="top-0 fill-primary" height={64} depth={0.2} frequency={2} inverted />
    </footer>
  )
}
