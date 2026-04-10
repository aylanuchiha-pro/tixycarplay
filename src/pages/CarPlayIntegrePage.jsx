import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Cpu, Monitor, Camera, Navigation, Search, ChevronDown } from 'lucide-react'
import SectionTitle from '../components/SectionTitle'
import ProductCard from '../components/ProductCard'
import TutoModal from '../components/TutoModal'
import { images } from '../data/images'
import { useShopifyCollection } from '../hooks/useShopifyCollection'

const PAGE_SIZE = 4

export default function CarPlayIntegrePage() {
  const [tutoProduct, setTutoProduct] = useState(null)
  const [search, setSearch]           = useState('')
  const [visible, setVisible]         = useState(PAGE_SIZE)

  const { products, loading } = useShopifyCollection('carplay-integre', 'integre')

  const filtered = products.filter((p) => {
    const q = search.toLowerCase()
    return (
      p.nom.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.specs || []).some((s) => s.toLowerCase().includes(q))
    )
  })

  const shown   = filtered.slice(0, visible)
  const hasMore = visible < filtered.length

  return (
    <div className="grain min-h-screen">
      {tutoProduct && <TutoModal product={tutoProduct} onClose={() => setTutoProduct(null)} />}

      {/* Hero banner */}
      <section className="relative h-[50vh] min-h-[360px] flex items-end overflow-hidden">
        <img src={images.integre1} alt="Intérieur voiture avec écran intégré" className="img-cover absolute inset-0" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/80 to-transparent" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 pb-12 w-full">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-brand-violetLight transition-colors mb-6">
            <ArrowLeft size={16} /> Retour
          </Link>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs tracking-[4px] uppercase text-brand-violetLight font-semibold mb-2">Remplacement autoradio</p>
            <h1 className="font-display text-5xl md:text-7xl text-white tracking-wider leading-none mb-3">CARPLAY INTÉGRÉ</h1>
            <p className="font-body text-white/50 max-w-[520px] leading-relaxed">
              Remplacez votre autoradio d'origine. Écran tactile, GPS, caméra de recul — finition OEM.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-14 border-b border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Monitor, label: 'Grand écran tactile', desc: 'Jusqu\'à 10.25"' },
              { icon: Cpu, label: 'Android 13', desc: 'Processeur 8-core' },
              { icon: Camera, label: 'Caméra de recul', desc: 'HD incluse' },
              { icon: Navigation, label: 'GPS offline', desc: 'Cartes préchargées' },
            ].map(({ icon: Icon, label, desc }, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                className="bg-brand-card rounded-xl p-5 border border-brand-violet/10 text-center">
                <Icon size={26} className="text-brand-violetLight mx-auto mb-3" />
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
              placeholder="Rechercher un produit… (ex: BMW, Mercedes, 10 pouces)"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setVisible(PAGE_SIZE) }}
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-body text-brand-text placeholder:text-brand-muted outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#a855f755')}
              onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
          </div>

          {/* Grille */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-white/[0.03] border border-white/[0.06] h-72 animate-pulse" />
              ))}
            </div>
          ) : shown.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-body text-brand-muted text-sm">Aucun produit pour « {search} ».</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <AnimatePresence mode="popLayout">
                {shown.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} variant="integre" onTuto={setTutoProduct} />
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
                className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm border transition-all"
                style={{ color: '#a855f7', borderColor: 'rgba(168,85,247,0.3)' }}
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

          <p className="text-center text-xs text-brand-violetLight mt-4 font-body">▶ Cliquez sur lecture pour voir le tutoriel d'installation</p>
        </div>
      </section>

      {/* Compatibility */}
      <section className="py-20 px-5 md:px-8 bg-brand-bg/50 border-y border-white/[0.04]">
        <div className="max-w-[900px] mx-auto">
          <SectionTitle subtitle="Compatibilité" title="TROUVEZ VOTRE MODÈLE" accentColor="#a855f7" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {['BMW Série 3 E90', 'VW Golf 7', 'Mercedes W204', 'Audi A3 / A4', 'Peugeot 308 / 3008', 'Renault Clio / Megane', 'Ford Focus / Fiesta', 'Toyota / Honda'].map((car, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                className="bg-brand-card rounded-lg p-3 border border-white/[0.06] text-center">
                <p className="font-body text-sm text-brand-text">{car}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-xs text-brand-muted mt-5">
            Votre véhicule n'est pas listé ? <Link to="/contact" className="text-brand-violetLight hover:underline">Contactez-nous</Link>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-5 md:px-8 text-center">
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/installation">
            <motion.button whileHover={{ scale: 1.04 }} className="px-10 py-4 rounded-2xl font-bold text-[15px] text-black"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>Réserver l'installation</motion.button>
          </Link>
          <Link to="/contact">
            <motion.button whileHover={{ scale: 1.04 }}
              className="px-10 py-4 rounded-2xl font-semibold text-[15px] text-brand-violetLight border border-brand-violet/30 hover:bg-brand-violet/5 transition-all">Nous contacter</motion.button>
          </Link>
        </div>
      </section>
    </div>
  )
}
