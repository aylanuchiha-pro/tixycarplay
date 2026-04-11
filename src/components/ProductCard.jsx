import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ShoppingCart, Play, ArrowUpRight, Check } from 'lucide-react'
import { useIntersection } from '../hooks/useScroll'
import { useShopifyCart } from '../hooks/useShopifyCart'

export default function ProductCard({ product, index = 0, onTuto, variant = 'filaire' }) {
  const [ref, inView] = useIntersection({ threshold: 0.1 })
  const { addToCart, loading } = useShopifyCart()
  const accent = variant === 'filaire' ? '#00e5ff' : variant === 'accessoire' ? '#f5c542' : '#a855f7'

  const handleCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (product.shopifyHandle) {
      await addToCart(product)
    }
  }

  return (
    <Link to={`/produit/${product.shopifyHandle || product.id}`} className="block">
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8 }}
      className="relative bg-brand-card rounded-2xl overflow-hidden border border-white/[0.06] hover:border-white/[0.12] transition-all duration-500 group w-full cursor-pointer"
    >
      {product.badge && (
        <div
          className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full text-[10px] font-bold text-white tracking-wider uppercase"
          style={{ background: variant === 'filaire' ? 'linear-gradient(135deg,#00e5ff,#06b6d4)' : variant === 'accessoire' ? 'linear-gradient(135deg,#f5c542,#f59e0b)' : 'linear-gradient(135deg,#7c3aed,#a855f7)' }}
        >
          {product.badge}
        </div>
      )}

      {product.prixBarre && (
        <div className="absolute top-3 left-3 z-10 text-brand-muted/60 text-xs line-through">
          {product.prixBarre.toFixed(2)}€
        </div>
      )}

      <div className="h-48 overflow-hidden bg-black/20 img-shimmer">
        {product.image
          ? <img src={product.image} alt={product.nom} className="img-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
          : <div className="w-full h-full bg-white/[0.03]" />
        }
        <div className="absolute inset-0 bg-gradient-to-t from-brand-card via-transparent to-transparent" />
      </div>

      <div className="p-5">
        <h3 className="font-display text-xl text-brand-text tracking-wider mb-1.5">{product.nom}</h3>
        <p className="font-body text-[13px] text-brand-muted leading-relaxed mb-3 line-clamp-2">
          {product.description}
        </p>

        {product.specs?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {product.specs.slice(0, 3).map((s, i) => (
              <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/[0.04] text-brand-muted">
                {s}
              </span>
            ))}
          </div>
        )}

        <div className="relative z-10 flex items-center justify-between">
          <span className="font-display text-2xl" style={{ color: accent }}>
            {product.prix?.toFixed(2)}€
          </span>
          <div className="flex gap-2">
            {product.tutoEtapes?.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onTuto?.(product) }}
                className="w-9 h-9 rounded-lg flex items-center justify-center border border-brand-violet/30 bg-brand-violet/10"
                title="Voir le tuto"
              >
                <Play size={14} className="text-brand-violetLight" />
              </motion.button>
            )}
            {product.shopifyHandle && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCart}
                disabled={loading}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-black disabled:opacity-60 disabled:cursor-wait"
                style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}
                title="Ajouter au panier"
              >
                {loading
                  ? <span className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  : <ShoppingCart size={14} />
                }
              </motion.button>
            )}
          </div>
        </div>

        {/* Hover overlay "Voir le produit" — couvre uniquement la zone image + titre, pas les boutons */}
        <div className="absolute inset-0 bottom-[72px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-t-2xl"
          style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(2px)' }}>
          <span className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background: accent + '22', border: `1px solid ${accent}55` }}>
            Voir le produit <ArrowUpRight size={14} style={{ color: accent }} />
          </span>
        </div>
      </div>
    </motion.div>
    </Link>
  )
}
