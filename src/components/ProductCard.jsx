import { forwardRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ShoppingCart, Play, ArrowUpRight, HelpCircle } from 'lucide-react'
import { useIntersection } from '../hooks/useScroll'
import { useShopifyCart } from '../hooks/useShopifyCart'

/* Couleurs accent selon variante */
const ACCENTS = {
  filaire:    { main: '#00e5ff', dark: '#00b8d4', gradient: 'linear-gradient(135deg, #00e5ff, #06b6d4)' },
  integre:    { main: '#a855f7', dark: '#7c3aed', gradient: 'linear-gradient(135deg, #7c3aed, #a855f7)' },
  accessoire: { main: '#d4a855', dark: '#b8892a', gradient: 'linear-gradient(135deg, #d4a855, #f0cc7a)' },
}

const ProductCard = forwardRef(function ProductCard({ product, index = 0, onTuto, variant = 'filaire' }, forwardedRef) {
  const [intersectionRef, inView] = useIntersection({ threshold: 0.1 })
  const { addToCart, loading } = useShopifyCart()
  const ac = ACCENTS[variant] ?? ACCENTS.filaire

  const variants = product.variants ?? []
  const hasVariants = variants.length > 1

  const [selectedVariant, setSelectedVariant] = useState(() =>
    variants.find(v => v.availableForSale) ?? variants[0] ?? null
  )
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const displayPrice = hasVariants && selectedVariant?.priceV2?.amount
    ? parseFloat(selectedVariant.priceV2.amount)
    : product.prix

  const handleCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (product.shopifyHandle) {
      await addToCart(product, { variantId: selectedVariant?.id })
    }
  }

  return (
    <Link ref={forwardedRef} to={`/produit/${product.shopifyHandle || product.id}`} className="block h-full">
      <motion.div
        ref={intersectionRef}
        initial={{ opacity: 0, y: 48 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ y: -6 }}
        className="luxury-border h-full cursor-pointer"
      >
        <div className="luxury-border-inner h-full flex flex-col">

          {/* ── Image ── */}
          <div className="relative h-36 sm:h-52 overflow-hidden bg-black/20 img-shimmer flex-shrink-0">
            {product.image
              ? <img src={product.image} alt={product.nom}
                  className="img-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy" />
              : <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #12121c, #1a1a2e)' }} />
            }
            {/* Overlay gradient bas */}
            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, #111120 0%, rgba(17,17,32,0.4) 40%, transparent 100%)' }} />

            {/* Badge */}
            {product.badge && (
              <div
                className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase"
                style={{
                  background: ac.gradient,
                  color: variant === 'accessoire' ? '#000' : '#fff',
                  boxShadow: `0 2px 12px ${ac.main}44`,
                  border: `1px solid ${ac.main}33`,
                }}
              >
                {product.badge}
              </div>
            )}

            {/* Prix barré */}
            {product.prixBarre && (
              <div className="absolute top-3 left-3 z-10 text-brand-muted/60 text-xs line-through bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm">
                {product.prixBarre.toFixed(2)}€
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.38)', backdropFilter: 'blur(3px)' }}>
              <span
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold text-white"
                style={{ background: `${ac.main}18`, border: `1px solid ${ac.main}44` }}
              >
                Voir le produit <ArrowUpRight size={13} style={{ color: ac.main }} />
              </span>
            </div>
          </div>

          {/* ── Contenu ── */}
          <div className="p-3 sm:p-5 flex flex-col flex-1">
            <h3 className="font-display text-[15px] sm:text-[20px] text-brand-text tracking-wider mb-1 sm:mb-1.5 leading-tight line-clamp-2">
              {product.nom}
            </h3>
            <p className="hidden sm:block font-body text-[13px] text-brand-muted leading-relaxed mb-3 line-clamp-2 flex-1">
              {product.description}
            </p>

            {product.specs?.length > 0 && (
              <div className="hidden sm:flex flex-wrap gap-1 mb-4">
                {product.specs.slice(0, 3).map((s, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md tracking-wide"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      color: '#7a7a95',
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}

            {/* ── Sélecteur de version (multi-variantes) ── */}
            {hasVariants && (
              <div
                className="mb-4"
                onClick={e => e.stopPropagation()}
                onMouseDown={e => e.stopPropagation()}
              >
                {/* Label + bouton aide */}
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-[11px] font-medium" style={{ color: '#7a7a95' }}>
                    Choisir la version
                  </span>
                  <div className="relative">
                    <button
                      type="button"
                      onMouseEnter={() => setTooltipOpen(true)}
                      onMouseLeave={() => setTooltipOpen(false)}
                      onClick={e => { e.preventDefault(); e.stopPropagation() }}
                      className="w-4 h-4 rounded-full flex items-center justify-center"
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.12)',
                      }}
                      aria-label="Comment choisir ?"
                    >
                      <HelpCircle size={10} style={{ color: '#7a7a95' }} />
                    </button>

                    {tooltipOpen && (
                      <div
                        className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 p-3 rounded-xl text-[11px] leading-relaxed z-50 pointer-events-none"
                        style={{
                          background: 'rgba(10,10,22,0.97)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                          color: '#a0a0b8',
                        }}
                      >
                        <span style={{ color: ac.main, fontWeight: 600 }}>Comment choisir ?</span>
                        <br />
                        Les produits importés peuvent proposer plusieurs versions selon le modèle de voiture ou le type de connexion. Vérifiez la compatibilité avec votre véhicule avant d'ajouter au panier.
                      </div>
                    )}
                  </div>
                </div>

                {/* Select */}
                <div className="relative">
                  <select
                    value={selectedVariant?.id ?? ''}
                    onChange={e => {
                      e.stopPropagation()
                      const v = variants.find(vv => vv.id === e.target.value)
                      if (v) setSelectedVariant(v)
                    }}
                    onClick={e => { e.preventDefault(); e.stopPropagation() }}
                    className="w-full text-[12px] py-1.5 pl-2.5 pr-7 rounded-lg outline-none cursor-pointer appearance-none"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: `1px solid ${ac.main}33`,
                      color: '#c5c5d8',
                    }}
                  >
                    {variants.map(v => (
                      <option
                        key={v.id}
                        value={v.id}
                        disabled={!v.availableForSale}
                        style={{ background: '#111120', color: v.availableForSale ? '#c5c5d8' : '#555570' }}
                      >
                        {v.title}{!v.availableForSale ? ' (épuisé)' : ''}
                      </option>
                    ))}
                  </select>
                  {/* Chevron */}
                  <svg
                    className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                    width="10" height="10" viewBox="0 0 10 10" fill="none"
                  >
                    <path d="M2 3.5L5 6.5L8 3.5" stroke={ac.main} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            )}

            {/* Prix + actions */}
            <div className="flex items-center justify-between mt-auto pt-1">
              <span
                className="font-display text-[20px] sm:text-[26px] leading-none"
                style={variant === 'accessoire' ? {
                  background: 'linear-gradient(110deg, #b8892a, #f0cc7a, #d4a855)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                } : { color: ac.main }}
              >
                {displayPrice?.toFixed(2)}€
              </span>

              <div className="flex gap-2">
                {product.tutoEtapes?.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onTuto?.(product) }}
                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                    style={{
                      background: 'rgba(124,58,237,0.12)',
                      border: '1px solid rgba(124,58,237,0.25)',
                    }}
                    title="Voir le tuto"
                  >
                    <Play size={13} style={{ color: '#a78bfa' }} />
                  </motion.button>
                )}
                {product.shopifyHandle && (
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={handleCart}
                    disabled={loading || !selectedVariant?.availableForSale}
                    className="w-9 h-9 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-wait relative overflow-hidden"
                    style={{
                      background: ac.gradient,
                      boxShadow: `0 2px 14px ${ac.main}33`,
                      color: '#000',
                    }}
                    title={selectedVariant?.availableForSale === false ? 'Version épuisée' : 'Ajouter au panier'}
                  >
                    <span className="absolute inset-0"
                      style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.20) 0%, transparent 60%)' }} />
                    {loading
                      ? <span className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin relative z-10" />
                      : <ShoppingCart size={13} className="relative z-10" />
                    }
                  </motion.button>
                )}
              </div>
            </div>

            {/* Trait de couleur en bas */}
            <div className="mt-2 sm:mt-4 h-px rounded-full opacity-40"
              style={{ background: `linear-gradient(90deg, ${ac.main}88, transparent)` }} />
          </div>
        </div>
      </motion.div>
    </Link>
  )
})

export default ProductCard
