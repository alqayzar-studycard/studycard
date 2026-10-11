const tagColorClasses = {
  primary: "border-primary/35 bg-primary text-white",
  secondary: "border-secondary/35 bg-secondary text-white",
  study: "border-study/35 bg-study text-white",
  destructive: "border-destructive/35 bg-destructive text-white",
  orange: "border-orange/35 bg-orange text-white",
  yellow: "border-yellow/35 bg-yellow text-white",
  greenAlt: "border-green-alt/35 bg-green-alt text-white",
} as const

const solidTagColorClasses: Record<keyof typeof tagColorClasses, string> = {
  primary: "border-paper/50 bg-primary text-white",
  secondary: "border-paper/50 bg-secondary text-white",
  study: "border-paper/50 bg-study text-white",
  destructive: "border-paper/50 bg-destructive text-white",
  orange: "border-paper/50 bg-orange text-white",
  yellow: "border-paper/50 bg-yellow text-white",
  greenAlt: "border-paper/50 bg-green-alt text-white",
}

const tagBackgroundClasses: Record<keyof typeof tagColorClasses, string> = {
  primary: "bg-primary text-white",
  secondary: "bg-secondary text-white",
  study: "bg-study text-white",
  destructive: "bg-destructive text-white",
  orange: "bg-orange text-white",
  yellow: "bg-yellow text-white",
  greenAlt: "bg-green-alt text-white",
}

export type TagColor = keyof typeof tagColorClasses

const tagColors = Object.keys(tagColorClasses) as TagColor[]

export function getRandomTagColor(): TagColor {
  return tagColors[Math.floor(Math.random() * tagColors.length)]
}

export function getTagColorClass(color?: TagColor) {
  return tagColorClasses[color ?? "primary"]
}

export function getSolidTagColorClass(color?: TagColor) {
  return solidTagColorClasses[color ?? "primary"]
}

export function getTagBackgroundClass(color?: TagColor) {
  return tagBackgroundClasses[color ?? "primary"]
}
