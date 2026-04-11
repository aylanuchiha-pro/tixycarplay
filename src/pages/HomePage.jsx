import { useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowRight, ArrowUpRight, Star, ChevronDown,
  Zap, Shield, Truck, Headphones,
  ShoppingCart, Check, Flame, Users, Package, Camera,
} from 'lucide-react'
import ProductCard from '../components/ProductCard'
import GalleryCard from '../components/GalleryCard'
import CountUp from '../components/CountUp'
import TutoModal from '../components/TutoModal'
import { images } from '../data/images'
import { services, galerie, temoignages, faq } from '../data/products'
import { useShopifyCollection } from '../hooks/useShopifyCollection'
import { useShopifyCart } from '../hooks/useShopifyCart'

/* ─── Fade + slide au scroll ─── */
function FadeUp({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Numéro de section en filigrane ─── */
function SectionNum({ num }) {
  return (
    <span
      aria-hidden
      className="font-display select-none pointer-events-none absolute top-0 left-0 text-white/[0.03] leading-none -translate-y-1/2"
      style={{ fontSize: 'clamp(90px, 14vw, 140px)' }}
    >
      {num}
    </span>
  )
}

/* ─── Bannière parallaxe ─── */
function ParallaxBanner({ image, children }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-14%', '14%'])
  return (
    <section ref={ref} className="relative h-[52vh] min-h-[400px] overflow-hidden flex items-center">
      <motion.div className="absolute inset-0 scale-125" style={{ y }}>
        <img src={image} alt="" className="img-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/92 via-brand-dark/70 to-brand-dark/30" />
      </motion.div>
      <div className="relative z-10 w-full">{children}</div>
    </section>
  )
}

/* ─── CTA finale ─── */
function FinalCTA({ image }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])
  return (
    <section ref={ref} className="relative py-44 px-6 md:px-10 overflow-hidden">
      <motion.div className="absolute inset-0 scale-125" style={{ y }}>
        <img src={image} alt="" className="img-cover" loading="lazy" />
        <div className="absolute inset-0 bg-black/80" />
      </motion.div>
      <div className="relative z-10 max-w-[900px] mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 56 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[11px] tracking-[4px] uppercase text-brand-cyan mb-8">Passez à l'action</p>
          <h2 className="font-display text-white tracking-wider mb-8 leading-none" style={{ fontSize: 'clamp(48px,10vw,100px)' }}>
            UPGRADEZ<br />VOTRE AUTO
          </h2>
          <p className="font-body text-white/40 text-sm mb-12 max-w-[360px] mx-auto leading-relaxed">
            Devis gratuit en 24h. Commandez en ligne ou prenez rendez-vous pour l'installation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="px-10 py-4 rounded-2xl font-bold text-[15px] text-black"
                style={{ background: 'linear-gradient(135deg, #00e5ff, #7c3aed)' }}>
                Nous contacter
              </motion.button>
            </Link>
            <Link to="/carplay-filaire">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="px-10 py-4 rounded-2xl font-semibold text-[15px] text-white border border-white/15 hover:bg-white/5 transition-all">
                Voir les produits
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════
   PAGE PRINCIPALE
════════════════════════════════════════════════════════ */
export default function HomePage() {
  const [tutoProduct, setTutoProduct] = useState(null)
  const [openFaq, setOpenFaq]         = useState(null)
  const [qty, setQty]                 = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  const { products: produitsFilaire } = useShopifyCollection('carplay-filaire', 'filaire')
  const { products: produitsIntegre } = useShopifyCollection('carplay-integre', 'integre')
  const { addToCart, loading: cartLoading } = useShopifyCart()

  // Premier produit filaire dispo = bestseller, null si collection vide
  const bestseller = produitsFilaire[0] ?? null

  const handleAddToCart = async () => {
    if (bestseller?.shopifyHandle) {
      await addToCart(bestseller, false, qty)
    } else {
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 2200)
    }
  }

  /* Parallaxe hero */
  const heroRef = useRef(null)
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroImgY  = useTransform(heroScroll, [0, 1], ['0%', '25%'])
  const heroOpacity = useTransform(heroScroll, [0, 0.85], [1, 0])

  return (
    <div className="grain">
      {tutoProduct && <TutoModal product={tutoProduct} onClose={() => setTutoProduct(null)} />}

      {/* ═══════════ HERO ═══════════ */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col overflow-hidden bg-brand-dark">

        {/* ── Background image ── */}
        <motion.div className="absolute inset-0 scale-110" style={{ y: heroImgY }}>
          <img src={images.bgDark} alt="" className="img-cover" loading="eager" />

          {/* Mobile : photo visible en haut, fade vers bas */}
          <div className="absolute inset-0 md:hidden" style={{
            background: 'linear-gradient(to bottom, rgba(7,7,13,0.3) 0%, rgba(7,7,13,0.5) 40%, rgba(7,7,13,0.92) 70%, #07070d 100%)'
          }} />
          {/* Desktop : fade horizontal gauche → droite */}
          <div className="absolute inset-0 hidden md:block" style={{
            background: 'linear-gradient(105deg, #07070d 40%, rgba(7,7,13,0.80) 65%, rgba(7,7,13,0.35) 100%)'
          }} />
        </motion.div>

        {/* ── Contenu ── */}
        {/* Mobile : ancré en bas de l'écran (photo visible au-dessus) */}
        {/* Desktop : centré verticalement */}
        <motion.div
          className="relative z-10 flex-1 flex items-end md:items-center"
          style={{ opacity: heroOpacity }}
        >
          <div className="w-full max-w-[1400px] mx-auto px-5 md:px-12 pb-6 md:pt-36 md:pb-16">

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="flex items-center gap-2 mb-4 md:mb-10"
            >
              <span className="w-5 md:w-8 h-px bg-brand-cyan flex-shrink-0" />
              <span className="text-[10px] md:text-[11px] tracking-[2px] md:tracking-[4px] uppercase font-semibold" style={{ color: '#00e5ff' }}>
                Installation à domicile<span className="hidden sm:inline"> · Île-de-France</span>
              </span>
            </motion.div>

            {/* Titres */}
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: '110%' }} animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-white leading-none"
                style={{ fontSize: 'clamp(48px, 14vw, 160px)' }}
              >
                TIXYCARS
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-5 md:mb-10">
              <motion.h1
                initial={{ y: '110%' }} animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="font-display leading-none"
                style={{
                  fontSize: 'clamp(48px, 14vw, 160px)',
                  background: 'linear-gradient(90deg, #00e5ff, #7c3aed)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                CARPLAY
              </motion.h1>
            </div>

            {/* Description — desktop uniquement */}
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="hidden sm:block font-body text-brand-muted text-[15px] leading-relaxed mb-8 max-w-[480px]"
            >
              Boîtier plug&amp;play ou autoradio intégré —{' '}
              <span className="text-white/75">on se déplace chez vous</span>.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-2.5"
            >
              <Link to="/carplay-filaire" className="w-full sm:w-auto">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-[14px] text-black flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #00e5ff, #06b6d4)' }}
                >
                  Découvrir les offres <ArrowRight size={15} />
                </motion.button>
              </Link>
              <Link to="/installation" className="w-full sm:w-auto">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-[14px] text-white border border-white/20 hover:bg-white/[0.06] transition-all text-center"
                >
                  Réserver une installation
                </motion.button>
              </Link>
            </motion.div>

            {/* Badges — desktop uniquement */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.7 }}
              className="hidden sm:flex flex-wrap gap-2 mt-10"
            >
              {[
                { label: 'CarPlay Filaire',  color: '#00e5ff', bg: 'rgba(0,229,255,0.08)',  border: 'rgba(0,229,255,0.25)' },
                { label: 'CarPlay Intégré',  color: '#a78bfa', bg: 'rgba(124,58,237,0.10)', border: 'rgba(124,58,237,0.30)' },
                { label: 'Caméra de recul',  color: '#34d399', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)' },
              ].map(b => (
                <span key={b.label}
                  className="px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-wide uppercase"
                  style={{ background: b.bg, border: `1px solid ${b.border}`, color: b.color }}
                >
                  {b.label}
                </span>
              ))}
            </motion.div>

          </div>
        </motion.div>

        {/* ── Bande stats ── */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="relative z-10 border-t border-white/[0.06]"
        >
          <div className="max-w-[1400px] mx-auto px-5 md:px-12 py-4 md:py-6 grid grid-cols-4 md:flex md:divide-x divide-white/[0.06]">
            {[
              { val: 500, suf: '+',    label: 'Installations' },
              { val: 98,  suf: '%',    label: 'Satisfaits' },
              { val: 48,  suf: 'h',    label: 'Livraison' },
              { val: 2,   suf: ' ans', label: 'Garantie' },
            ].map((s, i) => (
              <div key={i} className="md:flex-1 md:px-8 text-center md:text-left first:pl-0 last:pr-0">
                <p className="font-display text-xl md:text-3xl text-white leading-none">
                  <CountUp target={s.val} suffix={s.suf} />
                </p>
                <p className="font-body text-[10px] md:text-xs text-brand-muted mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </section>

      {/* ═══════════ BESTSELLER ═══════════ */}
      {bestseller && <section className="py-20 px-5 md:px-8 border-b border-white/[0.05]" style={{ background: 'linear-gradient(180deg, #0a0a14 0%, #07070d 100%)' }}>
        <div className="max-w-[1400px] mx-auto">

          {/* En-tête de section */}
          <FadeUp className="flex items-center gap-3 mb-10">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full" style={{ background: 'linear-gradient(135deg, rgba(245,197,66,0.15), rgba(245,197,66,0.05))', border: '1px solid rgba(245,197,66,0.25)' }}>
              <Flame size={14} className="text-brand-gold" />
              <span className="text-[11px] tracking-[2px] uppercase text-brand-gold font-bold">Meilleure vente</span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-brand-gold/20 to-transparent" />
          </FadeUp>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* ── Image produit ── */}
            <FadeUp>
              <div className="relative rounded-3xl overflow-hidden group" style={{ background: '#10101e' }}>
                {/* Badge bestseller */}
                <div className="absolute top-5 left-5 z-20 flex flex-col gap-2">
                  <span className="px-3 py-1.5 rounded-full text-[10px] font-bold text-black tracking-wider uppercase"
                    style={{ background: 'linear-gradient(135deg, #f5c542, #f59e0b)' }}>
                    🔥 Bestseller
                  </span>
                  <span className="px-3 py-1.5 rounded-full text-[10px] font-bold text-white tracking-wider uppercase"
                    style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
                    -25% ce mois
                  </span>
                </div>

                {/* Image */}
                <div className="h-80 md:h-[420px] img-shimmer">
                  <img
                    src={bestseller.image}
                    alt={bestseller.nom}
                    className="img-cover group-hover:scale-105 transition-transform duration-700"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#10101e]/60 via-transparent to-transparent" />
                </div>

                {/* Barre stock en bas de l'image */}
                <div className="p-5 border-t border-white/[0.06]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-brand-muted font-body">Stock disponible</span>
                    <span className="text-xs font-semibold text-red-400 font-body">⚠ Plus que 12 unités</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '22%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                      className="h-full rounded-full"
                      style={{ background: 'linear-gradient(90deg, #ef4444, #f87171)' }}
                    />
                  </div>
                </div>
              </div>
            </FadeUp>

            {/* ── Infos produit ── */}
            <FadeUp delay={0.15}>
              {/* Nom & étoiles */}
              <h2 className="font-display text-4xl md:text-5xl text-brand-text tracking-wider mb-3 leading-none">
                {bestseller.nom}
              </h2>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-5">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={15} fill="#f5c542" className="text-brand-gold" />
                  ))}
                </div>
                <span className="font-body text-sm text-brand-muted">4.9 · <span className="text-brand-text font-semibold">127 avis</span></span>
                <span className="hidden sm:block text-brand-subtle">|</span>
                <div className="flex items-center gap-1.5 text-sm text-brand-muted font-body">
                  <Users size={13} className="text-brand-cyan" />
                  <span><span className="text-brand-text font-semibold">384</span> vendus ce mois</span>
                </div>
              </div>

              {/* Prix */}
              <div className="flex items-end gap-4 mb-7">
                <span className="font-display text-5xl md:text-6xl text-brand-cyan leading-none">
                  {bestseller.prix.toFixed(2)}€
                </span>
                {bestseller.prixBarre && (
                  <div className="pb-2">
                    <span className="font-body text-xl text-brand-muted line-through">{bestseller.prixBarre.toFixed(2)}€</span>
                    <p className="text-xs text-emerald-400 font-semibold mt-0.5">
                      Vous économisez {(bestseller.prixBarre - bestseller.prix).toFixed(2)}€
                    </p>
                  </div>
                )}
              </div>

              {/* Bénéfices */}
              <div className="flex flex-col gap-2.5 mb-8">
                {[
                  '7" IPS 1024×600 — image nette même en plein soleil',
                  'Compatible Apple CarPlay & Android Auto filaire',
                  'Bluetooth 5.0 + transmetteur FM intégré',
                  'Fixation ventouse premium — installation en 2 minutes',
                  'Compatible Siri & Google Assistant',
                ].map((b, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: 'rgba(0,229,255,0.12)' }}>
                      <Check size={11} className="text-brand-cyan" />
                    </div>
                    <span className="font-body text-sm text-brand-muted leading-relaxed">{b}</span>
                  </motion.div>
                ))}
              </div>

              {/* Sélecteur quantité + CTA */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 mb-6">
                {/* Quantité */}
                <div className="flex items-center rounded-xl border border-white/[0.08] overflow-hidden self-start">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-11 h-12 flex items-center justify-center text-brand-muted hover:text-white hover:bg-white/5 transition-all font-body text-lg"
                  >−</button>
                  <span className="w-11 h-12 flex items-center justify-center font-body font-semibold text-brand-text text-sm border-x border-white/[0.08]">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(q => q + 1)}
                    className="w-11 h-12 flex items-center justify-center text-brand-muted hover:text-white hover:bg-white/5 transition-all font-body text-lg"
                  >+</button>
                </div>

                {/* Bouton panier */}
                <motion.button
                  onClick={handleAddToCart}
                  disabled={cartLoading}
                  whileHover={{ scale: cartLoading ? 1 : 1.03, boxShadow: '0 0 30px rgba(0,229,255,0.25)' }}
                  whileTap={{ scale: cartLoading ? 1 : 0.97 }}
                  className="w-full sm:flex-1 h-12 rounded-xl font-bold text-[15px] text-black flex items-center justify-center gap-2 transition-all duration-300 pulse-glow disabled:opacity-70 disabled:cursor-wait"
                  style={{ background: addedToCart ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #00e5ff, #06b6d4)' }}
                >
                  {cartLoading ? (
                    <><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Ajout en cours…</>
                  ) : addedToCart ? (
                    <><Check size={16} /> Ajouté au panier !</>
                  ) : (
                    <><ShoppingCart size={16} /> Ajouter au panier</>
                  )}
                </motion.button>
              </div>

              {/* Acheter maintenant */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => bestseller?.shopifyHandle && addToCart(bestseller, true, qty)}
                disabled={cartLoading}
                className="w-full h-12 rounded-xl font-semibold text-[14px] text-white border border-white/10 hover:bg-white/5 transition-all mb-7 disabled:opacity-60 disabled:cursor-wait"
              >
                Acheter maintenant
              </motion.button>

              {/* Trust signals */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: Truck,     label: 'Livraison',  sub: 'Gratuite 48h' },
                  { icon: Shield,    label: 'Garantie',   sub: '2 ans' },
                  { icon: Package,   label: 'Retours',    sub: '30 jours' },
                  { icon: Headphones,label: 'Support',    sub: '7j/7' },
                ].map(({ icon: Icon, label, sub }, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-white/[0.05]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <Icon size={16} className="text-brand-cyan" />
                    <span className="font-body text-[11px] font-semibold text-brand-text">{label}</span>
                    <span className="font-body text-[10px] text-brand-muted">{sub}</span>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>

        </div>
      </section>}

      {/* ═══════════ TRUST BAR ═══════════ */}
      <section className="py-14 border-y border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck,      label: 'Livraison 48h',  desc: 'France métropolitaine' },
              { icon: Shield,     label: 'Garantie 2 ans', desc: 'Installation Premium' },
              { icon: Zap,        label: 'Plug & Play',    desc: 'Installez en 2 min' },
              { icon: Headphones, label: 'SAV 7j/7',       desc: 'Réponse sous 24h' },
            ].map(({ icon: Icon, label, desc }, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-brand-cyan/[0.07] border border-brand-cyan/15 flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-brand-cyan" />
                </div>
                <div>
                  <p className="font-body text-sm font-semibold text-brand-text">{label}</p>
                  <p className="font-body text-xs text-brand-muted">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CAMÉRA DE RECUL ═══════════ */}
      <section className="px-5 md:px-8 pb-16">
        <div className="max-w-[1400px] mx-auto">
          <FadeUp>
            <div className="relative rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d0d1f 0%, #12121c 100%)' }}>
              {/* Fond image atténué */}
              <div className="absolute inset-0 opacity-10">
                <img src={images.installation1} alt="" className="img-cover" loading="lazy" />
              </div>
              {/* Bordure dégradée */}
              <div className="absolute inset-0 rounded-3xl" style={{ padding: '1px', background: 'linear-gradient(135deg, rgba(0,229,255,0.25), rgba(124,58,237,0.15), transparent)', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-8 md:p-12">
                {/* Texte */}
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 border border-brand-cyan/20" style={{ background: 'rgba(0,229,255,0.06)' }}>
                    <Camera size={13} className="text-brand-cyan" />
                    <span className="text-[11px] tracking-[2px] uppercase text-brand-cyan font-semibold">Service inclus</span>
                  </div>

                  <h2 className="font-display text-white tracking-wider leading-none mb-4" style={{ fontSize: 'clamp(28px,4vw,52px)' }}>
                    CAMÉRA DE<br />
                    <span className="text-gradient">RECUL INCLUSE</span>
                  </h2>

                  <p className="font-body text-brand-muted text-sm leading-relaxed max-w-[380px] mb-8">
                    Plusieurs de nos CarPlay intégrés sont livrés avec une caméra de recul HD.
                    On se charge de l'installation à domicile — câblage propre, angle réglé, image nette dès la marche arrière.
                  </p>

                  <div className="flex flex-col gap-3 mb-8">
                    {[
                      "Image HD en marche arrière, intégrée à l'écran CarPlay",
                      'Câblage discret, aucune modification visible',
                      'Installation à domicile en Île-de-France',
                    ].map((txt, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(0,229,255,0.12)' }}>
                          <Check size={9} className="text-brand-cyan" />
                        </div>
                        <span className="font-body text-sm text-brand-muted">{txt}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link to="/carplay-integre">
                      <motion.button
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-black"
                        style={{ background: 'linear-gradient(135deg, #00e5ff, #06b6d4)' }}
                      >
                        <Camera size={14} /> Voir les CarPlay compatibles
                      </motion.button>
                    </Link>
                    <Link to="/installation">
                      <motion.button
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white border border-white/10 hover:bg-white/5 transition-all"
                      >
                        Réserver l'installation <ArrowRight size={13} />
                      </motion.button>
                    </Link>
                  </div>
                </div>

                {/* Visuel */}
                <div className="relative">
                  <div className="rounded-2xl overflow-hidden img-shimmer" style={{ aspectRatio: '16/10' }}>
                    <img src={images.installation3} alt="Caméra de recul installée" className="img-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-tl from-brand-dark/40 to-transparent" />
                  </div>
                  {/* Badge flottant */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="hidden sm:flex absolute -bottom-4 -left-4 px-4 py-3 rounded-2xl border border-brand-cyan/20 items-center gap-3"
                    style={{ background: 'rgba(7,7,13,0.92)', backdropFilter: 'blur(12px)' }}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,229,255,0.1)' }}>
                      <Camera size={16} className="text-brand-cyan" />
                    </div>
                    <div>
                      <p className="font-body text-xs font-semibold text-brand-text">Caméra HD incluse</p>
                      <p className="font-body text-[10px] text-brand-muted">sur modèles compatibles</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ═══════════ 01 — CARPLAY FILAIRE ═══════════ */}
      <section className="py-24 px-5 md:px-8 overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between mb-14">
            <FadeUp className="relative">
              <SectionNum num="01" />
              <p className="text-[11px] tracking-[3px] uppercase text-brand-cyan mb-3">Plug &amp; Play</p>
              <h2 className="font-display text-white tracking-wider leading-none" style={{ fontSize: 'clamp(32px,5vw,56px)' }}>
                CARPLAY<br />FILAIRE
              </h2>
            </FadeUp>
            <FadeUp delay={0.15} className="hidden md:block pb-2">
              <Link to="/carplay-filaire">
                <motion.span whileHover={{ x: 5 }} className="flex items-center gap-1.5 text-sm text-brand-muted hover:text-white transition-colors cursor-pointer">
                  Voir tout <ArrowRight size={13} />
                </motion.span>
              </Link>
            </FadeUp>
          </div>
          {produitsFilaire.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {produitsFilaire.map((p, i) => <ProductCard key={p.id} product={p} index={i} variant="filaire" />)}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════ BANNIÈRE ═══════════ */}
      <ParallaxBanner image={images.bgDark}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 w-full">
          <FadeUp>
            <p className="text-[11px] tracking-[3px] uppercase text-[#a855f7] mb-5">Transformation complète</p>
            <h2 className="font-display text-white tracking-wider leading-none mb-8" style={{ fontSize: 'clamp(36px,7vw,82px)' }}>
              REMPLACEZ<br />VOTRE AUTORADIO
            </h2>
            <Link to="/carplay-integre">
              <motion.span whileHover={{ x: 6 }} className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors cursor-pointer">
                Découvrir les systèmes intégrés <ArrowUpRight size={15} />
              </motion.span>
            </Link>
          </FadeUp>
        </div>
      </ParallaxBanner>

      {/* ═══════════ 02 — CARPLAY INTÉGRÉ ═══════════ */}
      <section className="py-24 px-5 md:px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between mb-14">
            <FadeUp className="relative">
              <SectionNum num="02" />
              <p className="text-[11px] tracking-[3px] uppercase text-[#a855f7] mb-3">Sur mesure</p>
              <h2 className="font-display text-white tracking-wider leading-none" style={{ fontSize: 'clamp(32px,5vw,56px)' }}>
                CARPLAY<br />INTÉGRÉ
              </h2>
            </FadeUp>
            <FadeUp delay={0.15} className="hidden md:block pb-2">
              <Link to="/carplay-integre">
                <motion.span whileHover={{ x: 5 }} className="flex items-center gap-1.5 text-sm text-brand-muted hover:text-white transition-colors cursor-pointer">
                  Voir tout <ArrowRight size={13} />
                </motion.span>
              </Link>
            </FadeUp>
          </div>
          {produitsIntegre.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {produitsIntegre.map((p, i) => <ProductCard key={p.id} product={p} index={i} variant="integre" onTuto={setTutoProduct} />)}
            </div>
          )}
          <FadeUp delay={0.3} className="text-center mt-6">
            <p className="text-xs text-[#a855f7]/60">▶ Cliquez sur lecture pour voir le tuto d'installation</p>
          </FadeUp>
        </div>
      </section>

      {/* ═══════════ 03 — INSTALLATION ═══════════ */}
      <section className="py-24 px-5 md:px-8 border-t border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <FadeUp className="relative lg:sticky lg:top-32">
              <SectionNum num="03" />
              <p className="text-[11px] tracking-[3px] uppercase text-brand-gold mb-4">Île-de-France</p>
              <h2 className="font-display text-white tracking-wider leading-none mb-6" style={{ fontSize: 'clamp(32px,5vw,56px)' }}>
                INSTALLATION<br />À DOMICILE
              </h2>
              <p className="font-body text-brand-muted leading-relaxed max-w-[380px] text-sm mb-8">
                CarPlay intégré ou caméra de recul — on se déplace chez vous en Île-de-France. Câblage soigné, test complet, départ serein.
              </p>
              <Link to="/installation">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="px-6 py-3.5 rounded-2xl font-semibold text-sm text-black"
                  style={{ background: 'linear-gradient(135deg, #f5c542, #f59e0b)' }}>
                  Réserver une installation <ArrowRight size={13} className="inline ml-1" />
                </motion.button>
              </Link>
            </FadeUp>
            <div className="flex flex-col gap-3">
              {services.map((s, i) => (
                <FadeUp key={s.id} delay={i * 0.12}>
                  <div className="group flex items-center gap-5 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-brand-gold/20 transition-all duration-500">
                    <div className="h-16 w-16 rounded-xl overflow-hidden flex-shrink-0 img-shimmer">
                      <img src={s.image} alt={s.titre} className="img-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1 gap-2">
                        <h3 className="font-display text-sm tracking-wider text-brand-text">{s.titre}</h3>
                        <span className="font-display text-brand-gold text-sm whitespace-nowrap">{s.prix}</span>
                      </div>
                      <p className="font-body text-xs text-brand-muted line-clamp-2">{s.description}</p>
                    </div>
                    <span className="text-xs text-brand-muted/50 pl-2 whitespace-nowrap">{s.duree}</span>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 04 — RÉALISATIONS ═══════════ */}
      <section className="py-24 px-5 md:px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between mb-14">
            <FadeUp className="relative">
              <SectionNum num="04" />
              <p className="text-[11px] tracking-[3px] uppercase text-emerald-400 mb-4">Nos réalisations</p>
              <h2 className="font-display text-white tracking-wider leading-none" style={{ fontSize: 'clamp(32px,5vw,56px)' }}>
                AVANT /<br />APRÈS
              </h2>
            </FadeUp>
            <FadeUp delay={0.15} className="hidden md:block pb-2">
              <Link to="/realisations">
                <motion.span whileHover={{ x: 5 }} className="flex items-center gap-1.5 text-sm text-brand-muted hover:text-white transition-colors cursor-pointer">
                  Voir tout <ArrowRight size={13} />
                </motion.span>
              </Link>
            </FadeUp>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {galerie.map((item, i) => <GalleryCard key={item.id} item={item} index={i} />)}
          </div>
        </div>
      </section>

      {/* ═══════════ 05 — AVIS ═══════════ */}
      <section className="py-24 px-5 md:px-8 border-t border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto">
          <FadeUp className="relative mb-14">
            <SectionNum num="05" />
            <p className="text-[11px] tracking-[3px] uppercase text-brand-gold mb-4">Ils nous font confiance</p>
            <h2 className="font-display text-white tracking-wider leading-none" style={{ fontSize: 'clamp(32px,5vw,56px)' }}>
              AVIS CLIENTS
            </h2>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {temoignages.map((t, i) => (
              <FadeUp key={i} delay={i * 0.07}>
                <div className="p-6 rounded-2xl bg-brand-card border border-white/[0.05] h-full flex flex-col">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.note }).map((_, j) => <Star key={j} size={13} fill="#f5c542" className="text-brand-gold" />)}
                  </div>
                  <p className="font-body text-[13px] text-brand-muted leading-relaxed italic flex-1">"{t.texte}"</p>
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/[0.05]">
                    <span className="font-body text-sm font-semibold text-brand-text">{t.nom}</span>
                    <span className="font-body text-xs text-brand-muted">{t.voiture}</span>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 06 — FAQ ═══════════ */}
      <section className="py-24 px-5 md:px-8">
        <div className="max-w-[740px] mx-auto">
          <FadeUp className="relative mb-14">
            <SectionNum num="06" />
            <p className="text-[11px] tracking-[3px] uppercase text-brand-cyan mb-4">Questions fréquentes</p>
            <h2 className="font-display text-white tracking-wider leading-none" style={{ fontSize: 'clamp(32px,5vw,56px)' }}>FAQ</h2>
          </FadeUp>
          <div className="flex flex-col divide-y divide-white/[0.05]">
            {faq.map((item, i) => (
              <FadeUp key={i} delay={i * 0.04}>
                <div className="py-5">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 text-left group">
                    <span className="font-body text-sm font-medium text-brand-text group-hover:text-brand-cyan transition-colors pr-4">
                      {item.question}
                    </span>
                    <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.3 }}>
                      <ChevronDown size={14} className="text-brand-muted flex-shrink-0" />
                    </motion.div>
                  </button>
                  <motion.div initial={false}
                    animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden">
                    <p className="pt-3 font-body text-sm text-brand-muted leading-relaxed">{item.reponse}</p>
                  </motion.div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA FINAL ═══════════ */}
      <FinalCTA image={images.bgRoad} />
    </div>
  )
}
