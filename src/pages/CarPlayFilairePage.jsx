import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Zap, Plug, Clock, Smartphone, Search, ChevronDown } from 'lucide-react'
import SectionTitle from '../components/SectionTitle'
import ProductCard from '../components/ProductCard'
import { images } from '../data/images'
import { produitsFilaire } from '../data/products'

const PAGE_SIZE = 4

export default function CarPlayFilairePage() {
  const [search, setSearch]   = useState('')
  const [visible, setVisible] = useState(PAGE_SIZE)

  const filtered = produitsFilaire.filter((p) => {
    const q = search.toLowerCase()
    return (
      p.nom.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.specs || []).some((s) => s.toLowerCase().includes(q))
    )
  })

  const shown    = filtered.slice(0, visible)
  const hasMore  = visible < filtered.length

  return (
    <div className="grain min-h-screen">
      {/* Hero banner with real photo */}
      <section className="relative h-[50vh] min-h-[360px] flex items-end overflow-hidden">
        <img src={images.filaire1} alt="CarPlay filaire sur pare-brise" className="img-cover absolute inset-0" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/80 to-transparent" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 pb-12 w-full">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-brand-cyan transition-colors mb-6">
            <ArrowLeft size={16} /> Retour
          </Link>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs tracking-[4px] uppercase text-brand-cyan font-semibold mb-2">Plug & Play</p>
            <h1 className="font-display text-5xl md:text-7xl text-white tracking-wider leading-none mb-3">CARPLAY FILAIRE</h1>
            <p className="font-body text-white/50 max-w-[480px] leading-relaxed">
              Un écran CarPlay qui se fixe en 2 minutes. Aucune modification, compatible tous véhicules.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-14 border-b border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Clock, label: 'Installation 2 min', desc: 'Ventouse pare-brise' },
              { icon: Plug, label: 'Plug & Play', desc: 'Câble USB fourni' },
              { icon: Smartphone, label: 'iOS & Android', desc: 'CarPlay + Android Auto' },
              { icon: Zap, label: 'Sans modification', desc: 'Aucun câblage' },
            ].map(({ icon: Icon, label, desc }, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                className="bg-brand-card rounded-xl p-5 border border-brand-cyan/10 text-center">
                <Icon size={26} className="text-brand-cyan mx-auto mb-3" />
                <p className="font-body text-sm font-semibold text-brand-text">{label}</p>
                <p className="font-body text-xs text-brand-muted mt-1">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-20 px-5 md:px-8">
        <div className="max-w-[1400px] mx-auto">

          {/* Barre de recherche */}
          <div className="relative mb-8 max-w-lg">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher un produit… (ex: 7 pouces, bluetooth)"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setVisible(PAGE_SIZE) }}
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-body text-brand-text placeholder:text-brand-muted outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#00e5ff55')}
              onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
          </div>

          {/* Grille */}
          {shown.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-body text-brand-muted text-sm">Aucun produit pour « {search} ».</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <AnimatePresence mode="popLayout">
                {shown.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} variant="filaire" />
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Bouton Voir plus */}
          {hasMore && (
            <div className="flex justify-center mt-10">
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm text-brand-cyan border border-brand-cyan/30 hover:bg-brand-cyan/5 transition-all"
              >
                Voir plus <ChevronDown size={15} />
              </motion.button>
            </div>
          )}

          {/* Compteur */}
          {filtered.length > 0 && (
            <p className="text-center text-xs text-brand-muted mt-5 font-body">
              {Math.min(visible, filtered.length)} / {filtered.length} produit{filtered.length > 1 ? 's' : ''}
            </p>
          )}

        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-5 md:px-8 bg-brand-bg/50 border-y border-white/[0.04]">
        <div className="max-w-[900px] mx-auto">
          <SectionTitle subtitle="Simple comme bonjour" title="COMMENT ÇA MARCHE ?" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
            {[
              { step: '01', title: 'Fixez', desc: 'Placez le support ventouse sur votre pare-brise. Ajustez l\'angle idéal.' },
              { step: '02', title: 'Branchez', desc: 'Connectez le câble USB à votre iPhone ou Android. Alimentation allume-cigare incluse.' },
              { step: '03', title: 'Profitez', desc: 'CarPlay ou Android Auto se lance automatiquement. Navigation, musique, appels.' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="text-center">
                <div className="font-display text-6xl text-brand-cyan/15 mb-3">{s.step}</div>
                <h3 className="font-display text-2xl text-brand-text tracking-wider mb-2">{s.title}</h3>
                <p className="font-body text-sm text-brand-muted leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-5 md:px-8 text-center">
        <p className="font-body text-brand-muted mb-6">Besoin d'aide pour choisir ?</p>
        <Link to="/contact">
          <motion.button whileHover={{ scale: 1.04 }} className="px-10 py-4 rounded-2xl font-bold text-[15px] text-black"
            style={{ background: 'linear-gradient(135deg, #00e5ff, #06b6d4)' }}>Nous contacter</motion.button>
        </Link>
      </section>
    </div>
  )
}
