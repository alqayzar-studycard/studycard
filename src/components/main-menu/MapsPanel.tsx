import { Map } from "lucide-react"

import { MainMenuPanel } from "@/components/main-menu/MainMenuPanel"

export function MapsPanel(props: { isActive: boolean }) {
  return (
    <MainMenuPanel tab="maps" isActive={props.isActive} count={0}>
      <div className="flex min-h-36 flex-col items-center justify-center border-2 border-dashed border-primary/45 bg-paper px-5 py-6 text-center sm:col-span-2">
        <span className="grid size-10 place-items-center rounded-[var(--radius)] bg-sage text-forest">
          <Map className="size-5" aria-hidden="true" />
        </span>
        <h2 className="mt-3 font-display text-xl font-bold">No maps yet</h2>
        <p className="mt-1 text-sm text-muted-foreground">Your maps will appear here.</p>
      </div>
    </MainMenuPanel>
  )
}
