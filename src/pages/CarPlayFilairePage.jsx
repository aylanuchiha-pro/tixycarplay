import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Zap, Plug, Clock, Smartphone, Search, ChevronDown } from 'lucide-react'
import SectionTitle from '../components/SectionTitle'
import ProductCard from '../components/ProductCard'
import { images } from '../data/images'
import { useShopifyCollection } from '../hooks/useShopifyCollection'

const PAGE_SIZE = 4

export default function CarPlayFilairePage() {
  const [search, setSearch]   = useState('')
  const [visible, setVisible] = useState(PAGE_SIZE)

  const { products, loading } = useShopifyCollection('carplay-filaire', 'filaire')

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

      {/* ── Hero banner ── */}
      <section className="relative h-[50vh] min-h-[360px] flex items-end overflow-hidden">
        <img src={images.filaire1} alt="CarPlay filaire" className="img-cover absolute inset-0" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/80 to-transparent" />
        {/* Filet doré en bas */}
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,85,0.35), rgba(212,168,85,0.20), transparent)' }} />
        <div className="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 pb-12 w-full">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-brand-gold transition-colors mb-6">
            <ArrowLeft size={16} /> Retour
          </Link>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-6 h-px" style={{ background: 'linear-gradient(90deg, #d4a855, transparent)' }} />
              <p className="text-[11px] tracking-[4px] uppercase font-semibold" style={{ color: '#d4a855' }}>Plug &amp; Play</p>
            </div>
            <h1 className="font-display font-semibold text-white leading-none mb-3" style={{ fontSize: 'clamp(40px, 7vw, 80px)', letterSpacing: '0.03em' }}>
              CarPlay Filaire
            </h1>
            <p className="font-body text-white/50 max-w-[480px] leading-relaxed">
              Un écran CarPlay qui se fixe en 2 minutes. Aucune modification, compatible tous véhicules.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Avantages ── */}
      <section className="py-14 border-b border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Clock,       label: 'Installation 2 min', desc: 'Ventouse pare-brise' },
              { icon: Plug,        label: 'Plug & Play',        desc: 'Câble USB fourni' },
              { icon: Smartphone,  label: 'iOS & Android',      desc: 'CarPlay + Android Auto' },
              { icon: Zap,         label: 'Sans modification',  desc: 'Aucun câblage' },
            ].map(({ icon: Icon, label, desc }, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="rounded-xl p-5 border text-center"
                style={{ background: 'rgba(212,168,85,0.04)', borderColor: 'rgba(212,168,85,0.14)' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: 'rgba(212,168,85,0.10)', border: '1px solid rgba(212,168,85,0.20)' }}>
                  <Icon size={20} style={{ color: '#d4a855' }} />
                </div>
                <p className="font-body text-sm font-semibold text-brand-text">{label}</p>
                <p className="font-body text-xs text-brand-muted mt-1">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Produits ── */}
      <section className="py-20 px-5 md:px-8">
        <div className="max-w-[1400px] mx-auto">

          <div className="relative mb-8 max-w-lg">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher un produit… (ex: 7 pouces, bluetooth)"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setVisible(PAGE_SIZE) }}
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-body text-brand-text placeholder:text-brand-muted outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              onFocus={(e) => (e.target.style.borderColor = 'rgba(212,168,85,0.40)')}
              onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-white/[0.03] border border-white/[0.06] h-72 animate-pulse" />
              ))}
            </div>
          ) : shown.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-body text-brand-muted text-sm mb-3">Aucun produit ne correspond à « {search} ».</p>
              <p className="font-body text-brand-muted text-sm">
                Vous ne trouvez pas ce que vous cherchez ?{' '}
                <Link to="/contact" className="hover:underline" style={{ color: '#d4a855' }}>Contactez-nous</Link>
                , on pourra peut-être vous le trouver.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              <AnimatePresence mode="popLayout">
                {shown.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} variant="filaire" />
                ))}
              </AnimatePresence>
            </div>
          )}

          {hasMore && (
            <div className="flex justify-center mt-10">
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all"
                style={{ color: '#d4a855', border: '1px solid rgba(212,168,85,0.30)', background: 'rgba(212,168,85,0.06)' }}
              >
                Voir plus <ChevronDown size={15} />
              </motion.button>
            </div>
          )}

          {filtered.length > 0 && (
            <p className="text-center text-xs text-brand-muted mt-5 font-body">
              {Math.min(visible, filtered.length)} / {filtered.length} produit{filtered.length > 1 ? 's' : ''}
            </p>
          )}
        </div>
      </section>

      {/* ── Comment ça marche ── */}
      <section className="py-20 px-5 md:px-8 border-y border-white/[0.04]"
        style={{ background: 'linear-gradient(180deg, rgba(212,168,85,0.03) 0%, transparent 100%)' }}>
        <div className="max-w-[900px] mx-auto">
          <SectionTitle subtitle="Simple comme bonjour" title="Comment ça marche ?" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
            {[
              { step: '01', title: 'Fixez',    desc: "Placez le support ventouse sur votre pare-brise. Ajustez l'angle idéal." },
              { step: '02', title: 'Branchez', desc: 'Connectez le câble USB à votre iPhone ou Android. Alimentation allume-cigare incluse.' },
              { step: '03', title: 'Profitez', desc: 'CarPlay ou Android Auto se lance automatiquement. Navigation, musique, appels.' },
            ].map((s, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="font-display font-bold mb-3 leading-none"
                  style={{ fontSize: '72px', color: 'rgba(212,168,85,0.12)' }}>{s.step}</div>
                <h3 className="font-display font-semibold text-brand-text mb-2"
                  style={{ fontSize: 'clamp(22px, 3vw, 28px)' }}>{s.title}</h3>
                <p className="font-body text-sm text-brand-muted leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-5 md:px-8 text-center">
        <p className="font-body text-brand-muted mb-6">Besoin d'aide pour choisir ?</p>
        <Link to="/contact">
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            className="px-10 py-4 rounded-2xl font-bold text-[15px] text-black relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #d4a855, #f0cc7a 50%, #d4a855)', backgroundSize: '200% auto', boxShadow: '0 4px 28px rgba(212,168,85,0.25)' }}
          >
            <span className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)' }} />
            <span className="relative z-10">Nous contacter</span>
          </motion.button>
        </Link>
      </section>
    </div>
  )
}
