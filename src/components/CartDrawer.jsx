import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, ArrowRight, Trash2, Package } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { getCart } from '../services/shopify'

export default function CartDrawer() {
  const { isOpen, closeCart, cartId, checkoutUrl, itemCount } = useCart()
  const [lines, setLines]     = useState([])
  const [total, setTotal]     = useState(null)
  const [fetching, setFetching] = useState(false)

  // Recharger le contenu du panier à chaque ouverture
  useEffect(() => {
    if (!isOpen || !cartId) return

    setFetching(true)
    getCart(cartId)
      .then((cart) => {
        if (!cart) return
        setLines(cart.lines?.edges?.map(({ node }) => node) ?? [])
        setTotal(cart.cost?.totalAmount ?? null)
      })
      .catch(console.error)
      .finally(() => setFetching(false))
  }, [isOpen, cartId])

  const handleCheckout = () => {
    if (checkoutUrl) window.location.href = checkoutUrl
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-black/60"
            style={{ backdropFilter: 'blur(4px)' }}
            onClick={closeCart}
          />

          {/* Tiroir */}
          <motion.aside
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 h-full z-[70] w-full sm:max-w-[420px] flex flex-col"
            style={{
              background: 'rgba(10,10,18,0.97)',
              borderLeft: '1px solid rgba(255,255,255,0.07)',
              backdropFilter: 'blur(24px)',
            }}
          >
            {/* ── En-tête ── */}
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center gap-3">
                <ShoppingCart size={18} className="text-brand-cyan" />
                <h2 className="font-display text-lg tracking-wider text-white">MON PANIER</h2>
                {itemCount > 0 && (
                  <span
                    className="w-5 h-5 rounded-full text-[11px] font-bold text-black flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #00e5ff, #06b6d4)' }}
                  >
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-brand-muted hover:text-white hover:bg-white/5 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* ── Corps ── */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {fetching ? (
                /* Skeleton loader */
                <div className="flex flex-col gap-4 mt-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex gap-4 animate-pulse">
                      <div className="w-16 h-16 rounded-xl bg-white/[0.05] flex-shrink-0" />
                      <div className="flex-1 space-y-2 pt-1">
                        <div className="h-3 bg-white/[0.06] rounded w-3/4" />
                        <div className="h-3 bg-white/[0.04] rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : lines.length === 0 ? (
                /* Panier vide */
                <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-20">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.15)' }}
                  >
                    <Package size={24} className="text-brand-cyan opacity-60" />
                  </div>
                  <p className="font-body text-brand-muted text-sm">Votre panier est vide</p>
                  <button
                    onClick={closeCart}
                    className="text-brand-cyan text-sm font-semibold hover:underline"
                  >
                    Continuer les achats
                  </button>
                </div>
              ) : (
                /* Liste des articles */
                <ul className="flex flex-col gap-4 mt-2">
                  {lines.map((line) => {
                    const price = parseFloat(line.merchandise?.priceV2?.amount ?? 0)
                    const lineTotal = (price * line.quantity).toFixed(2)
                    return (
                      <li
                        key={line.id}
                        className="flex items-start gap-4 py-4"
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                      >
                        {/* Icône produit */}
                        <div
                          className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: 'rgba(0,229,255,0.07)', border: '1px solid rgba(0,229,255,0.12)' }}
                        >
                          <ShoppingCart size={16} className="text-brand-cyan opacity-60" />
                        </div>

                        {/* Infos */}
                        <div className="flex-1 min-w-0">
                          <p className="font-display text-sm tracking-wide text-white truncate">
                            {line.merchandise?.product?.title ?? 'Produit'}
                          </p>
                          {line.merchandise?.title && line.merchandise.title !== 'Default Title' && (
                            <p className="font-body text-[11px] text-brand-muted mt-0.5">
                              {line.merchandise.title}
                            </p>
                          )}
                          <div className="flex items-center gap-3 mt-2">
                            <span className="font-body text-xs text-brand-muted">
                              Qté : {line.quantity}
                            </span>
                            <span
                              className="font-display text-sm"
                              style={{ color: '#00e5ff' }}
                            >
                              {lineTotal}€
                            </span>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            {/* ── Pied de page ── */}
            {lines.length > 0 && (
              <div
                className="px-6 py-5 flex flex-col gap-3"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
              >
                {/* Sous-total */}
                {total && (
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-body text-sm text-brand-muted">Sous-total</span>
                    <span className="font-display text-lg text-white">
                      {parseFloat(total.amount).toFixed(2)}€
                    </span>
                  </div>
                )}

                {/* Bouton commander */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  disabled={!checkoutUrl}
                  className="w-full py-4 rounded-xl font-bold text-[15px] text-black flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #00e5ff, #06b6d4)' }}
                >
                  Commander <ArrowRight size={16} />
                </motion.button>

                {/* Lien continuer */}
                <button
                  onClick={closeCart}
                  className="text-brand-muted text-sm text-center hover:text-white transition-colors py-1"
                >
                  Continuer les achats
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
