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

      {/* ══════════════════════════════════════
          HERO MOBILE — layout style AURA
          ══════════════════════════════════════ */}
      <section className="md:hidden relative flex flex-col" style={{ minHeight: '100dvh', background: '#07070d' }}>

        {/* Fond image flouté très sombre */}
        <div className="absolute inset-0 overflow-hidden">
          <img src={images.integre1} alt="" className="absolute inset-0 img-cover opacity-15 blur-md scale-110" loading="eager" aria-hidden />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(7,7,13,0.4) 0%, rgba(7,7,13,0.92) 80%)' }} />
        </div>

        {/* Filet doré — haut */}
        <div className="absolute top-0 left-0 right-0 h-px z-10"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,85,0.60), rgba(240,204,122,0.40), transparent)' }}
        />

        {/* ── ZONE HAUTE : label + titre ── */}
        <div className="relative z-10 flex flex-col items-center pt-[88px] px-6">

          {/* Label doré */}
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-body text-[10px] tracking-[4px] uppercase font-semibold mb-6"
            style={{ color: '#d4a855' }}
          >
            La solution premium intégrée
          </motion.p>

          {/* Titre principal centré */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-center tracking-wider leading-none mb-5"
            style={{ fontSize: 'clamp(54px, 16vw, 76px)' }}
          >
            <span className="block text-white">DÉCOUVREZ</span>
            {/* L'EXCELLENCE avec logo CarPlay inline */}
            <span className="flex items-center justify-center gap-2" style={{ lineHeight: 1 }}>
              <span style={{
                background: 'linear-gradient(110deg, #b8892a 0%, #f0cc7a 35%, #d4a855 55%, #f5e09a 75%, #c9a44a 100%)',
                backgroundSize: '220% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'gold-shimmer 4s linear infinite',
              }}>L'EXCELLENCE</span>
              {/* Logo CarPlay compact */}
              <span className="inline-flex items-center self-center mb-1 flex-shrink-0">
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1" y="6" width="30" height="20" rx="3" fill="rgba(212,168,85,0.12)" stroke="#d4a855" strokeWidth="1.4"/>
                  {/* Route */}
                  <path d="M16 22 L16 14" stroke="#f0cc7a" strokeWidth="1.8" strokeLinecap="round"/>
                  <path d="M16 14 C16 14 13 12 10 14" stroke="#d4a855" strokeWidth="1.4" strokeLinecap="round"/>
                  <path d="M16 14 C16 14 19 12 22 14" stroke="#d4a855" strokeWidth="1.4" strokeLinecap="round"/>
                  {/* Cercle central */}
                  <circle cx="16" cy="13" r="2.5" fill="none" stroke="#f0cc7a" strokeWidth="1.4"/>
                  <circle cx="16" cy="13" r="0.8" fill="#d4a855"/>
                  {/* Antennes / détails */}
                  <path d="M7 6 L9 3" stroke="#d4a855" strokeWidth="1.2" strokeLinecap="round"/>
                  <path d="M25 6 L23 3" stroke="#d4a855" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </span>
            </span>
            <span className="block text-white">INTÉGRÉE.</span>
          </motion.h1>

          {/* Sous-titre */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="font-body text-center text-sm leading-relaxed max-w-[260px]"
            style={{ color: 'rgba(238,238,245,0.50)' }}
          >
            La solution CarPlay premium pour votre véhicule d'exception.
          </motion.p>
        </div>

        {/* ── ZONE CENTRALE : image CarPlay ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex-1 flex items-center justify-center px-6 py-6"
        >
          <div className="w-full max-w-[310px] relative">
            {/* Glow doré derrière l'image */}
            <div className="absolute inset-0 rounded-2xl blur-2xl opacity-25"
              style={{ background: 'linear-gradient(135deg, #d4a855, #f0cc7a)' }}
            />
            {/* Cadre image */}
            <div className="relative rounded-2xl overflow-hidden"
              style={{
                border: '1px solid rgba(212,168,85,0.35)',
                boxShadow: '0 8px 48px rgba(0,0,0,0.70), 0 0 0 1px rgba(212,168,85,0.08)',
              }}
            >
              {/* Filet doré en haut du cadre */}
              <div className="absolute top-0 left-0 right-0 h-px z-10"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(240,204,122,0.70), transparent)' }}
              />
              <img
                src={images.integre3}
                alt="Interface Apple CarPlay intégrée"
                className="w-full object-cover"
                style={{ aspectRatio: '16/10' }}
                loading="eager"
              />
              {/* Overlay léger sur l'image */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </div>
        </motion.div>

        {/* ── ZONE BASSE : bouton CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="relative z-10 flex flex-col items-center gap-3 px-6 pb-10"
        >
          <Link to="/installation" className="w-full max-w-[300px]">
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="w-full py-4 rounded-2xl font-bold text-black text-[14px] tracking-widest uppercase relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #d4a855, #f0cc7a 50%, #d4a855)',
                backgroundSize: '200% auto',
                boxShadow: '0 4px 32px rgba(212,168,85,0.38)',
              }}
            >
              <span className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, transparent 55%)' }} />
              <span className="relative z-10">DÉCOUVRIR VOS MODÈLES</span>
            </motion.button>
          </Link>
          <Link to="/" className="inline-flex items-center gap-1.5 font-body text-[11px] tracking-wide"
            style={{ color: 'rgba(238,238,245,0.30)' }}>
            <ArrowLeft size={12} /> Retour à l'accueil
          </Link>
        </motion.div>

        {/* Filet doré — bas */}
        <div className="absolute bottom-0 left-0 right-0 h-px z-10"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,85,0.45), transparent)' }}
        />
      </section>

      {/* ══════════════════════════════════════
          HERO DESKTOP — layout original
          ══════════════════════════════════════ */}
      <section className="hidden md:flex relative h-[50vh] min-h-[360px] items-end overflow-hidden">
        <img src={images.integre1} alt="Intérieur voiture avec écran intégré" className="img-cover absolute inset-0" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/80 to-transparent" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-8 pb-12 w-full">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-brand-violetLight transition-colors mb-6">
            <ArrowLeft size={16} /> Retour
          </Link>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs tracking-[4px] uppercase font-semibold mb-2" style={{ color: '#d4a855' }}>
              Remplacement autoradio
            </p>
            <h1 className="font-display text-7xl text-white tracking-wider leading-none mb-3">CARPLAY INTÉGRÉ</h1>
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
