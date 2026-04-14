import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Search, ChevronDown, Package } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { useShopifyCollection } from '../hooks/useShopifyCollection'

const PAGE_SIZE = 6

const CAT_STYLE = {
  Tous:       { color: '#e2e8f0', activeBg: 'rgba(226,232,240,0.15)', activeBorder: 'rgba(226,232,240,0.4)' },
  Caméras:    { color: '#34d399', activeBg: 'rgba(16,185,129,0.15)',  activeBorder: 'rgba(16,185,129,0.4)'  },
  Câbles:     { color: '#00e5ff', activeBg: 'rgba(0,229,255,0.12)',   activeBorder: 'rgba(0,229,255,0.35)'  },
  Supports:   { color: '#f5c542', activeBg: 'rgba(245,197,66,0.12)',  activeBorder: 'rgba(245,197,66,0.35)' },
  Faisceaux:  { color: '#a78bfa', activeBg: 'rgba(124,58,237,0.15)',  activeBorder: 'rgba(124,58,237,0.4)'  },
}

export default function AccessoiresPage() {
  const [search, setSearch]       = useState('')
  const [categorie, setCategorie] = useState('Tous')
  const [visible, setVisible]     = useState(PAGE_SIZE)

  const { products, loading } = useShopifyCollection('accessoires', 'accessoire')

  const CATEGORIES = ['Tous', ...Array.from(new Set(products.map((p) => p.categorie).filter(Boolean)))]

  const filtered = products.filter((p) => {
    const q = search.toLowerCase()
    const matchSearch =
      p.nom.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.specs || []).some((s) => s.toLowerCase().includes(q))
    const matchCat = categorie === 'Tous' || p.categorie === categorie
    return matchSearch && matchCat
  })

  const shown   = filtered.slice(0, visible)
  const hasMore = visible < filtered.length

  const handleCat = (cat) => { setCategorie(cat); setVisible(PAGE_SIZE) }
  const handleSearch = (e) => { setSearch(e.target.value); setVisible(PAGE_SIZE) }

  return (
    <div className="grain min-h-screen">

      {/* ─── Header ─── */}
      <section className="relative pt-32 pb-16 px-5 md:px-8 overflow-hidden border-b border-white/[0.05]">
        {/* Fond dégradé subtil */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 60% at 80% 50%, rgba(245,197,66,0.06) 0%, transparent 70%)' }} />

        <div className="max-w-[1400px] mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-brand-gold transition-colors mb-8">
            <ArrowLeft size={16} /> Retour
          </Link>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase"
                style={{ background: 'rgba(245,197,66,0.12)', border: '1px solid rgba(245,197,66,0.35)', color: '#f5c542' }}>
                <Package size={11} />
                Accessoires
              </span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl text-white tracking-wider leading-none mb-4">ACCESSOIRES</h1>
            <p className="font-body text-brand-muted text-[15px] leading-relaxed max-w-[520px]">
              Caméras de recul, câbles, supports et faisceaux — tout ce qu'il faut pour compléter votre installation CarPlay.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Filtres + Recherche ─── */}
      <section className="py-8 px-5 md:px-8 border-b border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row gap-4 items-start sm:items-center">

          {/* Filtre catégories */}
          <div className="flex flex-wrap gap-2 flex-1">
            {CATEGORIES.map((cat) => {
              const s = CAT_STYLE[cat] || CAT_STYLE.Tous
              const active = categorie === cat
              return (
                <motion.button
                  key={cat}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCat(cat)}
                  className="px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all"
                  style={active
                    ? { background: s.activeBg, border: `1px solid ${s.activeBorder}`, color: s.color }
                    : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }
                  }
                >
                  {cat}
                </motion.button>
              )
            })}
          </div>

          {/* Barre de recherche */}
          <div className="relative w-full sm:w-64 flex-shrink-0">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher…"
              value={search}
              onChange={handleSearch}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm font-body text-brand-text placeholder:text-brand-muted outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              onFocus={(e) => (e.target.style.borderColor = 'rgba(245,197,66,0.4)')}
              onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
          </div>
        </div>
      </section>

      {/* ─── Grille produits ─── */}
      <section className="py-14 px-5 md:px-8 pb-24">
        <div className="max-w-[1400px] mx-auto">

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-white/[0.03] border border-white/[0.06] h-72 animate-pulse" />
              ))}
            </div>
          ) : shown.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 text-center">
              <p className="font-body text-brand-muted text-sm mb-3">Aucun accessoire trouvé.</p>
              {search && (
                <button onClick={() => { setSearch(''); setCategorie('Tous') }}
                  className="text-xs text-brand-gold hover:underline">
                  Réinitialiser la recherche
                </button>
              )}
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
                <AnimatePresence mode="popLayout">
                  {shown.map((p, i) => (
                    <ProductCard key={p.id} product={p} index={i} variant="accessoire" />
                  ))}
                </AnimatePresence>
              </div>

              {/* Compteur */}
              <p className="text-center text-xs text-brand-muted mt-8 font-body">
                {Math.min(visible, filtered.length)} / {filtered.length} accessoire{filtered.length > 1 ? 's' : ''}
              </p>

              {/* Bouton Voir plus */}
              {hasMore && (
                <div className="flex justify-center mt-6">
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setVisible((v) => v + PAGE_SIZE)}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all"
                    style={{ color: '#f5c542', border: '1px solid rgba(245,197,66,0.3)', background: 'rgba(245,197,66,0.05)' }}
                  >
                    Voir plus <ChevronDown size={15} />
                  </motion.button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-16 px-5 md:px-8 text-center border-t border-white/[0.05]">
        <p className="font-body text-brand-muted text-sm mb-6">
          Besoin d'un accessoire spécifique ou d'un conseil sur la compatibilité ?
        </p>
        <Link to="/contact">
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            className="px-10 py-4 rounded-2xl font-bold text-[15px] text-black"
            style={{ background: 'linear-gradient(135deg, #f5c542, #f59e0b)' }}
          >
            Nous contacter
          </motion.button>
        </Link>
      </section>

    </div>
  )
}
