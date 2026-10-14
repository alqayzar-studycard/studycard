import { cn } from "@/lib/utils"

type WaveDividerProps = {
  className?: string
  height?: number
  depth?: number
  frequency?: number
  inverted?: boolean
}

/** A full-width SVG wave that can be used between two page sections. */
export function WaveDivider(props: WaveDividerProps) {
  const height = props.height ?? 88
  const depth = props.depth ?? 1
  const frequency = props.frequency ?? 2
  const clampedDepth = Math.min(Math.max(depth, 0), 1)
  const waveCount = Math.min(Math.max(Math.round(frequency), 1), 100)
  const amplitude = 12 + clampedDepth * 38
  const crest = 50 - amplitude
  const trough = 50 + amplitude
  const waveWidth = 1440 / waveCount

  const waveSegments = Array.from({ length: waveCount }, (_, index) => {
    const start = (waveCount - index - 1) * waveWidth
    const end = start + waveWidth
    const middle = start + waveWidth / 2
    const firstControl = end - waveWidth / 4
    const secondControl = start + waveWidth / 4

    const firstCurveHeight = props.inverted ? crest : trough
    const secondCurveHeight = props.inverted ? trough : crest

    return `C${firstControl} ${firstCurveHeight} ${firstControl} ${firstCurveHeight} ${middle} 50C${secondControl} ${secondCurveHeight} ${secondControl} ${secondCurveHeight} ${start} 50`
  }).join("")

  const path = props.inverted
    ? `M0 100H1440V50${waveSegments}Z`
    : `M0 0H1440V50${waveSegments}Z`

  return (
    <svg
       className={cn("pointer-events-none absolute left-0 top-full w-full", props.className)}
      style={{ height }}
      viewBox="0 0 1440 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  )
}
