import { ArrowRight, Plus } from "lucide-react"

const folders = [
  { name: "Littérature française", count: 24, flower: "#b84a28" },
  { name: "Histoire de l'art", count: 18, flower: "#ca7234" },
  { name: "Philosophie", count: 31, flower: "#9b5a36" },
  { name: "Vocabulaire anglais", count: 42, flower: "#bb492d" },
]

type BotanicalIllustrationProps = {
  flower: string
  variant: number
}

function BotanicalIllustration({ flower, variant }: BotanicalIllustrationProps) {
  const transform = variant % 2 === 0 ? "rotate(-8 100 115)" : "rotate(9 100 115)"

  return (
    <svg
      aria-hidden="true"
      className="absolute inset-x-0 top-7 h-52 w-full"
      viewBox="0 0 200 220"
      fill="none"
    >
      <g transform={transform} stroke="#33261d" strokeWidth="1.15">
        <path d="M98 214C99 157 91 113 105 16" />
        <path d="M98 166C73 147 52 132 31 126" />
        <path d="M100 139C124 119 145 106 174 105" />
        <path d="M102 99C81 82 65 70 46 62" />
        <path d="M104 72C129 53 148 45 171 41" />
        <path d="M94 183C116 172 134 161 151 143" />

        <path d="M31 126C35 105 55 100 70 117C56 131 42 135 31 126Z" fill="#eee1b2" />
        <path d="M174 105C159 84 139 88 130 106C145 116 161 115 174 105Z" fill="#eee1b2" />
        <path d="M46 62C49 43 68 42 79 57C68 70 55 71 46 62Z" fill="#eee1b2" />
        <path d="M171 41C159 25 142 30 136 46C149 55 162 52 171 41Z" fill="#eee1b2" />
        <path d="M151 143C145 124 128 124 119 141C129 151 142 152 151 143Z" fill="#eee1b2" />

        <path d="M34 123L67 117M136 106L169 105M49 60L76 58M139 46L168 41M122 140L148 143" opacity=".55" />
        <circle cx="103" cy="108" r="12" fill={flower} />
        <circle cx="103" cy="108" r="4" fill="#33261d" />
        <circle cx="98" cy="160" r="8" fill={flower} />
        <circle cx="107" cy="78" r="7" fill={flower} />
      </g>
    </svg>
  )
}

function App() {
  return (
    <main className="min-h-screen bg-[#e87f51] px-5 py-7 text-[#231a15] sm:px-9 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 flex items-center justify-between border-b border-[#f6b18d] pb-5 sm:mb-16">
          <div>
            <p className="text-[10px] font-bold tracking-[0.23em] text-[#fff0ca] uppercase">
              Carnet personnel
            </p>
            <h1 className="mt-1 font-serif text-3xl tracking-[-0.06em] text-[#fff4d4] sm:text-4xl">
              Mes dossiers
            </h1>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-[#291d17] bg-[#fff0c7] px-4 py-2.5 text-xs font-bold transition hover:bg-[#fff9e9] focus-visible:ring-2 focus-visible:ring-[#fff4d4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#e87f51] focus-visible:outline-none"
          >
            <Plus aria-hidden="true" size={15} strokeWidth={2.5} />
            Nouveau dossier
          </button>
        </header>

        <section aria-label="Liste des dossiers">
          <ul className="mx-auto grid max-w-5xl grid-cols-1 justify-items-center gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {folders.map((folder, index) => (
              <li key={folder.name} className={index % 2 === 1 ? "lg:pt-12" : ""}>
                <button
                  type="button"
                  className="group relative flex h-105 w-62 flex-col overflow-hidden rounded-[1.55rem] bg-[#fff0c4] text-left shadow-[0_13px_18px_rgb(91_44_28_/_0.2)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_19px_23px_rgb(91_44_28_/_0.24)] focus-visible:ring-3 focus-visible:ring-[#271a14] focus-visible:ring-offset-3 focus-visible:ring-offset-[#e87f51] focus-visible:outline-none"
                >
                  <span className="absolute top-5 left-5 flex size-7 items-center justify-center rounded-full border border-[#403126]/45">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: folder.flower }}
                    />
                  </span>
                  <span className="absolute top-5 right-5 font-serif text-sm">0{index + 1}</span>

                  <BotanicalIllustration flower={folder.flower} variant={index} />

                  <span className="relative mt-60 px-6">
                    <span className="block font-serif text-[1.7rem] leading-[1.02] tracking-[-0.06em]">
                      {folder.name}
                    </span>
                    <span className="mt-2 block text-[10px] font-medium tracking-wide text-[#715b43]">
                      Révision &amp; mémorisation
                    </span>
                  </span>

                  <span className="mt-auto flex h-15 items-center justify-between bg-[#211711] px-6 text-[#fff0c6]">
                    <span className="text-[10px] font-bold tracking-[0.13em] uppercase">
                      {folder.count} fiches
                    </span>
                    <span className="flex size-8 items-center justify-center rounded-full border border-[#fff0c6]/55 transition-transform group-hover:translate-x-1">
                      <ArrowRight aria-hidden="true" size={15} strokeWidth={1.7} />
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}

export default App
