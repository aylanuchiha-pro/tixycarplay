import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Play, ChevronDown, Search, Car } from 'lucide-react'

/* ─── Données véhicules / tutos ─── */
const TUTOS = [
  {
    marque: 'Renault',
    modeles: [
      { nom: 'Clio 4', type: 'Filaire', videoUrl: null, etapes: [] },
      { nom: 'Mégane 3', type: 'Filaire', videoUrl: null, etapes: [] },
    ],
  },
  {
    marque: 'Peugeot',
    modeles: [
      { nom: '208 (2014-2019)', type: 'Filaire', videoUrl: null, etapes: [] },
      { nom: '3008 (2017-2022)', type: 'Intégré', videoUrl: null, etapes: [] },
    ],
  },
  {
    marque: 'Citroën',
    modeles: [
      { nom: 'C3 III', type: 'Filaire', videoUrl: null, etapes: [] },
      { nom: 'C5 Aircross', type: 'Intégré', videoUrl: null, etapes: [] },
    ],
  },
  {
    marque: 'Volkswagen',
    modeles: [
      { nom: 'Golf 7', type: 'Intégré', videoUrl: null, etapes: [] },
      { nom: 'Polo 6', type: 'Filaire', videoUrl: null, etapes: [] },
    ],
  },
]

const TYPE_STYLE = {
  Filaire: {
    bg: 'rgba(0,229,255,0.12)',
    border: 'rgba(0,229,255,0.35)',
    color: '#00e5ff',
  },
  Intégré: {
    bg: 'rgba(124,58,237,0.15)',
    border: 'rgba(124,58,237,0.4)',
    color: '#a78bfa',
  },
}

function FadeUp({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function TutoCard({ modele, marque }) {
  const [open, setOpen] = useState(false)
  const style = TYPE_STYLE[modele.type] || TYPE_STYLE.Filaire
  const isEmpty = !modele.videoUrl && modele.etapes.length === 0

  return (
    <motion.div
      layout
      className="rounded-2xl border overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.025)', borderColor: 'rgba(255,255,255,0.07)' }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/[0.03] transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <Car size={16} className="text-brand-muted flex-shrink-0" />
          <span className="font-body text-brand-text text-sm font-medium truncate">
            {marque} {modele.nom}
          </span>
          <span
            className="hidden sm:inline-flex text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full flex-shrink-0"
            style={{ background: style.bg, border: `1px solid ${style.border}`, color: style.color }}
          >
            {modele.type}
          </span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown size={16} className="text-brand-muted flex-shrink-0" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-5 pb-5 pt-2 border-t border-white/[0.06]">
              {isEmpty ? (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <Play size={20} className="text-brand-muted" />
                  </div>
                  <p className="font-body text-sm text-brand-muted">Tutoriel à venir.</p>
                  <Link to="/contact">
                    <span className="text-xs text-brand-cyan hover:underline">Nous contacter pour ce véhicule</span>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4 pt-3">
                  {modele.videoUrl && (
                    <div className="aspect-video rounded-xl overflow-hidden bg-black/40">
                      <iframe
                        src={modele.videoUrl}
                        className="w-full h-full"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        title={`Tuto CarPlay ${marque} ${modele.nom}`}
                      />
                    </div>
                  )}
                  {modele.etapes.length > 0 && (
                    <ol className="flex flex-col gap-2">
                      {modele.etapes.map((e, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5"
                            style={{ background: style.bg, color: style.color }}>
                            {i + 1}
                          </span>
                          <span className="font-body text-sm text-brand-muted leading-relaxed">{e}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function TutorielsPage() {
  const [search, setSearch] = useState('')

  const filtered = TUTOS.map((g) => ({
    ...g,
    modeles: g.modeles.filter((m) =>
      `${g.marque} ${m.nom}`.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((g) => g.modeles.length > 0)

  return (
    <div className="grain min-h-screen">

      {/* ─── Header ─── */}
      <section className="pt-32 pb-16 px-5 md:px-8 border-b border-white/[0.05]">
        <div className="max-w-[900px] mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-brand-cyan transition-colors mb-8">
            <ArrowLeft size={16} /> Retour
          </Link>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <p className="text-xs tracking-[4px] uppercase text-brand-cyan font-semibold mb-3">Guide d'installation</p>
            <h1 className="font-display text-5xl md:text-7xl text-white tracking-wider leading-none mb-5">TUTORIELS</h1>
            <p className="font-body text-brand-muted text-[15px] leading-relaxed max-w-[480px]">
              Retrouvez les tutoriels d'installation CarPlay filaire et intégré, classés par marque et modèle de véhicule.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Recherche ─── */}
      <section className="py-8 px-5 md:px-8">
        <div className="max-w-[900px] mx-auto">
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher un véhicule… (ex: Renault, Golf, 208)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3.5 rounded-xl text-sm font-body text-brand-text placeholder:text-brand-muted outline-none focus:ring-1"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                focusRingColor: '#00e5ff',
              }}
            />
          </div>
        </div>
      </section>

      {/* ─── Liste tutos ─── */}
      <section className="pb-24 px-5 md:px-8">
        <div className="max-w-[900px] mx-auto flex flex-col gap-10">
          {filtered.length === 0 ? (
            <FadeUp className="text-center py-20">
              <p className="font-body text-brand-muted text-sm">Aucun véhicule trouvé pour « {search} ».</p>
              <Link to="/contact" className="mt-4 inline-block text-xs text-brand-cyan hover:underline">
                Demander un tutoriel pour ce véhicule
              </Link>
            </FadeUp>
          ) : (
            filtered.map((groupe, gi) => (
              <FadeUp key={groupe.marque} delay={gi * 0.05}>
                {/* En-tête marque */}
                <div className="flex items-center gap-4 mb-4">
                  <h2 className="font-display text-2xl text-white tracking-wider">{groupe.marque.toUpperCase()}</h2>
                  <div className="h-px flex-1 bg-white/[0.06]" />
                  <span className="font-body text-xs text-brand-muted">{groupe.modeles.length} modèle{groupe.modeles.length > 1 ? 's' : ''}</span>
                </div>

                {/* Cards */}
                <div className="flex flex-col gap-2">
                  {groupe.modeles.map((m) => (
                    <TutoCard key={m.nom} modele={m} marque={groupe.marque} />
                  ))}
                </div>
              </FadeUp>
            ))
          )}
        </div>
      </section>

    </div>
  )
}
