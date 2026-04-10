import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, ShoppingCart, Check, Camera, Star,
  Package, ChevronRight, Play,
} from 'lucide-react'
import TutoModal from '../components/TutoModal'
import ProductCard from '../components/ProductCard'
import { getProductById, getRelatedProducts } from '../data/products'
import { useShopifyCart } from '../hooks/useShopifyCart'

/* ─── Couleurs par type ─── */
const ACCENT = {
  filaire:    { color: '#00e5ff', gradient: 'linear-gradient(135deg,#00e5ff,#06b6d4)', label: 'CarPlay Filaire',  to: '/carplay-filaire' },
  integre:    { color: '#a855f7', gradient: 'linear-gradient(135deg,#7c3aed,#a855f7)', label: 'CarPlay Intégré', to: '/carplay-integre' },
  accessoire: { color: '#f5c542', gradient: 'linear-gradient(135deg,#f5c542,#f59e0b)', label: 'Accessoires',     to: '/accessoires'     },
}

/* ─── Étoiles ─── */
function Stars({ note = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={13} fill={i < note ? '#f5c542' : 'none'} stroke={i < note ? '#f5c542' : '#334155'} />
      ))}
    </div>
  )
}

/* ─── Option caméra ─── */
function CameraOption({ option, selected, onToggle, accent }) {
  const isFree = option.prix === 0
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onToggle}
      className="w-full text-left rounded-2xl border p-4 flex items-center gap-4 transition-all"
      style={selected
        ? { background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.4)' }
        : { background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }
      }
    >
      {/* Checkbox custom */}
      <div
        className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all"
        style={selected
          ? { background: 'linear-gradient(135deg,#10b981,#059669)', border: 'none' }
          : { background: 'transparent', border: '1.5px solid rgba(255,255,255,0.2)' }
        }
      >
        {selected && <Check size={12} className="text-white" strokeWidth={3} />}
      </div>

      {/* Icône caméra */}
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>
        <Camera size={18} className="text-emerald-400" />
      </div>

      {/* Texte */}
      <div className="flex-1 min-w-0">
        <p className="font-body text-sm font-semibold text-brand-text">Ajouter une caméra de recul HD</p>
        <p className="font-body text-xs text-brand-muted mt-0.5">
          170° grand angle · Vision nocturne · IP67 · Plug & Play
        </p>
      </div>

      {/* Prix */}
      <div className="flex-shrink-0 text-right">
        {isFree ? (
          <span className="font-display text-lg text-emerald-400">{option.label ?? 'Offerte'}</span>
        ) : (
          <span className="font-display text-lg" style={{ color: '#34d399' }}>+{option.prix}€</span>
        )}
      </div>
    </motion.button>
  )
}

/* ════════════════════════════════════════════════════════ */
export default function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = getProductById(id)

  const [cameraSelected, setCameraSelected] = useState(false)
  const [addedToCart, setAddedToCart]       = useState(false)
  const [tutoOpen, setTutoOpen]             = useState(false)
  const { addToCart, loading: cartLoading, error: cartError } = useShopifyCart()

  /* Produit introuvable */
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 grain">
        <div className="text-center">
          <Package size={48} className="text-brand-muted mx-auto mb-4" />
          <h1 className="font-display text-4xl text-white mb-3">Produit introuvable</h1>
          <p className="font-body text-brand-muted mb-8 text-sm">Ce produit n'existe pas ou a été retiré.</p>
          <Link to="/" className="px-8 py-3 rounded-xl font-semibold text-sm text-black inline-block"
            style={{ background: 'linear-gradient(135deg,#00e5ff,#06b6d4)' }}>
            Retour à l'accueil
          </Link>
        </div>
      </div>
    )
  }

  const acc     = ACCENT[product.type] ?? ACCENT.filaire
  const related = getRelatedProducts(product)
  const totalPrix = product.prix + (cameraSelected && product.cameraOption ? product.cameraOption.prix : 0)

  const handleAddToCart = async () => {
    if (product.shopifyHandle) {
      await addToCart(product, true)
    } else {
      // Fallback visuel si shopifyHandle n'est pas encore rempli
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 2200)
    }
  }

  return (
    <div className="grain min-h-screen">
      {tutoOpen && product.tutoEtapes && <TutoModal product={product} onClose={() => setTutoOpen(false)} />}

      {/* ─── Fil d'Ariane ─── */}
      <div className="pt-24 pb-4 px-5 md:px-8 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-2 text-xs text-brand-muted font-body flex-wrap">
          <Link to="/" className="hover:text-white transition-colors">Accueil</Link>
          <ChevronRight size={12} className="opacity-40" />
          <Link to={acc.to} className="hover:text-white transition-colors">{acc.label}</Link>
          <ChevronRight size={12} className="opacity-40" />
          <span className="text-brand-text truncate max-w-[200px]">{product.nom}</span>
        </div>
      </div>

      {/* ─── Contenu principal ─── */}
      <section className="py-8 px-5 md:px-8 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-start">

          {/* ── Image ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:sticky lg:top-24"
          >
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-black/20">
              <img src={product.image} alt={product.nom} className="img-cover" loading="eager" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* Badge */}
              {product.badge && (
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-[11px] font-bold text-white tracking-wider uppercase"
                  style={{ background: acc.gradient }}>
                  {product.badge}
                </div>
              )}

              {/* Prix barré */}
              {product.prixBarre && (
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-xl px-3 py-1.5">
                  <span className="font-body text-xs text-white/60 line-through">{product.prixBarre.toFixed(2)}€</span>
                  <span className="font-body text-xs text-emerald-400 ml-2">
                    -{Math.round((1 - product.prix / product.prixBarre) * 100)}%
                  </span>
                </div>
              )}
            </div>

            {/* Tuto bouton (si disponible) */}
            {product.tutoEtapes && (
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => setTutoOpen(true)}
                className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all"
                style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa' }}
              >
                <Play size={14} /> Voir le tutoriel d'installation
              </motion.button>
            )}
          </motion.div>

          {/* ── Infos produit ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-6"
          >
            {/* Catégorie */}
            <Link to={acc.to}>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full transition-opacity hover:opacity-80"
                style={{ background: `${acc.color}18`, border: `1px solid ${acc.color}44`, color: acc.color }}>
                {acc.label}
              </span>
            </Link>

            {/* Nom + note */}
            <div>
              <h1 className="font-display text-4xl md:text-5xl text-white tracking-wider leading-tight mb-3">
                {product.nom}
              </h1>
              <div className="flex items-center gap-3">
                <Stars note={5} />
                <span className="font-body text-xs text-brand-muted">(5.0 · 47 avis)</span>
              </div>
            </div>

            {/* Prix */}
            <div className="flex items-baseline gap-3">
              <span className="font-display text-5xl leading-none" style={{ color: acc.color }}>
                {totalPrix.toFixed(2)}€
              </span>
              {product.prixBarre && (
                <span className="font-body text-lg text-brand-muted line-through">{product.prixBarre.toFixed(2)}€</span>
              )}
            </div>

            {/* Description longue */}
            <p className="font-body text-brand-muted text-[15px] leading-relaxed">
              {product.descriptionLongue ?? product.description}
            </p>

            {/* Specs */}
            <div>
              <p className="font-body text-xs tracking-[2px] uppercase text-brand-muted mb-3">Caractéristiques</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(product.specs ?? []).map((s, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <Check size={13} style={{ color: acc.color, flexShrink: 0 }} />
                    <span className="font-body text-sm text-brand-text">{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Option caméra */}
            {product.cameraOption && (
              <div>
                <p className="font-body text-xs tracking-[2px] uppercase text-brand-muted mb-3">Option</p>
                <CameraOption
                  option={product.cameraOption}
                  selected={cameraSelected}
                  onToggle={() => setCameraSelected((v) => !v)}
                  accent={acc.color}
                />
                {cameraSelected && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                    className="font-body text-xs text-emerald-400 mt-2 pl-1"
                  >
                    Caméra de recul HD incluse dans votre commande.
                  </motion.p>
                )}
              </div>
            )}

            {/* Garantie + livraison */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '🛡️', label: 'Garantie 1 an', sub: 'Constructeur' },
                { icon: '🚚', label: 'Livraison 48h', sub: 'France entière' },
              ].map(({ icon, label, sub }) => (
                <div key={label} className="flex items-center gap-3 rounded-xl p-3"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="text-xl">{icon}</span>
                  <div>
                    <p className="font-body text-xs font-semibold text-brand-text">{label}</p>
                    <p className="font-body text-[10px] text-brand-muted">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            {cartError && (
              <p className="font-body text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-2">
                {cartError}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <motion.button
                whileHover={{ scale: cartLoading ? 1 : 1.02 }}
                whileTap={{ scale: cartLoading ? 1 : 0.97 }}
                onClick={handleAddToCart}
                disabled={cartLoading}
                className="flex-1 flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-base text-black transition-all disabled:opacity-70 disabled:cursor-wait"
                style={{ background: addedToCart ? 'linear-gradient(135deg,#10b981,#059669)' : acc.gradient }}
              >
                {cartLoading ? (
                  <><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Redirection…</>
                ) : addedToCart ? (
                  <><Check size={18} strokeWidth={3} /> Ajouté au panier</>
                ) : (
                  <><ShoppingCart size={18} /> Ajouter au panier — {totalPrix.toFixed(2)}€</>
                )}
              </motion.button>

              {product.type === 'integre' && (
                <Link to="/installation" className="flex-shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    className="w-full h-full px-6 py-4 rounded-2xl font-semibold text-sm text-white border border-white/10 hover:bg-white/5 transition-all whitespace-nowrap"
                  >
                    Réserver l'installation
                  </motion.button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Produits liés ─── */}
      {related.length > 0 && (
        <section className="py-16 px-5 md:px-8 border-t border-white/[0.05] mt-8">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="font-display text-2xl text-white tracking-wider">PRODUITS SIMILAIRES</h2>
              <div className="h-px flex-1 bg-white/[0.06]" />
              <Link to={acc.to} className="font-body text-xs hover:underline flex items-center gap-1"
                style={{ color: acc.color }}>
                Voir tout <ChevronRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} variant={p.type === 'integre' ? 'integre' : p.type === 'accessoire' ? 'accessoire' : 'filaire'} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
