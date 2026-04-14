import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, ArrowRight, Trash2, Package } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { getCart, removeCartLines } from '../services/shopify'

export default function CartDrawer() {
  const { isOpen, closeCart, cartId, checkoutUrl, itemCount, syncCart } = useCart()
  const [lines,    setLines]    = useState([])
  const [total,    setTotal]    = useState(null)
  const [fetching, setFetching] = useState(false)
  const [removing, setRemoving] = useState(null) // lineId en cours de suppression

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

  const handleRemove = useCallback(async (lineId) => {
    if (!cartId || removing) return
    setRemoving(lineId)
    try {
      const cart = await removeCartLines(cartId, [lineId])
      if (cart) {
        const newLines = cart.lines?.edges?.map(({ node }) => node) ?? []
        setLines(newLines)
        setTotal(cart.cost?.totalAmount ?? null)
        syncCart(cart)
      }
    } catch (err) {
      console.error('[CartDrawer] suppression échouée', err)
    } finally {
      setRemoving(null)
    }
  }, [cartId, removing, syncCart])

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
              style={{ borderBottom: '1px solid rgba(212,168,85,0.10)' }}
            >
              <div className="flex items-center gap-3">
                <ShoppingCart size={18} style={{ color: '#d4a855' }} />
                <h2 className="font-display text-lg tracking-wider text-white">MON PANIER</h2>
                {itemCount > 0 && (
                  <span
                    className="w-5 h-5 rounded-full text-[11px] font-bold text-black flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #d4a855, #f0cc7a)' }}
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
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {fetching ? (
                /* Skeleton loader */
                <div className="flex flex-col gap-4 mt-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex gap-4 animate-pulse">
                      <div className="w-20 h-20 rounded-xl bg-white/[0.05] flex-shrink-0" />
                      <div className="flex-1 space-y-2.5 pt-2">
                        <div className="h-3.5 bg-white/[0.06] rounded w-3/4" />
                        <div className="h-3 bg-white/[0.04] rounded w-1/2" />
                        <div className="h-3 bg-white/[0.04] rounded w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : lines.length === 0 ? (
                /* Panier vide */
                <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-20">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: 'rgba(212,168,85,0.08)', border: '1px solid rgba(212,168,85,0.18)' }}
                  >
                    <Package size={24} style={{ color: '#d4a855', opacity: 0.7 }} />
                  </div>
                  <p className="font-body text-brand-muted text-sm">Votre panier est vide</p>
                  <button
                    onClick={closeCart}
                    className="text-sm font-semibold hover:underline"
                    style={{ color: '#d4a855' }}
                  >
                    Continuer les achats
                  </button>
                </div>
              ) : (
                /* Liste des articles */
                <ul className="flex flex-col gap-1 mt-2">
                  <AnimatePresence initial={false}>
                    {lines.map((line) => {
                      const price      = parseFloat(line.merchandise?.priceV2?.amount ?? 0)
                      const lineTotal  = (price * line.quantity).toFixed(2)
                      const isRemoving = removing === line.id
                      const imgUrl     = line.merchandise?.product?.featuredImage?.url
                      const imgAlt     = line.merchandise?.product?.featuredImage?.altText
                        ?? line.merchandise?.product?.title ?? 'Produit'

                      return (
                        <motion.li
                          key={line.id}
                          initial={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="flex items-center gap-4 py-4 overflow-hidden"
                          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                        >
                          {/* Image produit */}
                          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0"
                            style={{ border: '1px solid rgba(212,168,85,0.15)', background: 'rgba(255,255,255,0.03)' }}>
                            {imgUrl ? (
                              <img src={imgUrl} alt={imgAlt} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ShoppingCart size={18} style={{ color: '#d4a855', opacity: 0.5 }} />
                              </div>
                            )}
                          </div>

                          {/* Infos */}
                          <div className="flex-1 min-w-0">
                            <p className="font-display text-[13px] tracking-wide text-white leading-snug line-clamp-2">
                              {line.merchandise?.product?.title ?? 'Produit'}
                            </p>
                            {line.merchandise?.title && line.merchandise.title !== 'Default Title' && (
                              <p className="font-body text-xs text-brand-muted mt-0.5">
                                {line.merchandise.title}
                              </p>
                            )}
                            <div className="flex items-center gap-3 mt-2">
                              <span className="font-body text-xs text-brand-muted">
                                Qté : {line.quantity}
                              </span>
                              <span className="font-display text-sm font-semibold" style={{ color: '#d4a855' }}>
                                {lineTotal}€
                              </span>
                            </div>
                          </div>

                          {/* Bouton supprimer */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleRemove(line.id)}
                            disabled={!!removing}
                            className="w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0 transition-all disabled:opacity-40"
                            style={{
                              background: 'rgba(239,68,68,0.08)',
                              border: '1px solid rgba(239,68,68,0.18)',
                            }}
                            title="Supprimer l'article"
                          >
                            {isRemoving
                              ? <span className="w-3 h-3 border-2 border-red-400/40 border-t-red-400 rounded-full animate-spin" />
                              : <Trash2 size={14} className="text-red-400" />
                            }
                          </motion.button>
                        </motion.li>
                      )
                    })}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* ── Pied de page ── */}
            {lines.length > 0 && (
              <div
                className="px-5 py-5 flex flex-col gap-3"
                style={{ borderTop: '1px solid rgba(212,168,85,0.10)' }}
              >
                {/* Sous-total */}
                {total && (
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-body text-sm text-brand-muted">Sous-total</span>
                    <span className="font-display text-xl text-white">
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
                  className="w-full py-4 rounded-xl font-bold text-[15px] text-black flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #d4a855, #f0cc7a 50%, #d4a855)', backgroundSize: '200% auto', boxShadow: '0 4px 24px rgba(212,168,85,0.25)' }}
                >
                  <span className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)' }} />
                  <span className="relative z-10 flex items-center gap-2">Commander <ArrowRight size={16} /></span>
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
