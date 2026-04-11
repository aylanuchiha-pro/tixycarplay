import { createContext, useContext, useState, useCallback } from 'react'

const CartCtx = createContext(null)

const CART_ID_KEY = 'tixycars_cart_id'

export function CartProvider({ children }) {
  const [isOpen, setIsOpen]           = useState(false)
  const [cartId, setCartId]           = useState(() => sessionStorage.getItem(CART_ID_KEY) || null)
  const [checkoutUrl, setCheckoutUrl] = useState(null)
  const [itemCount, setItemCount]     = useState(0)

  const openCart  = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  /**
   * Appelé après chaque mutation panier pour synchroniser l'état global.
   * @param {object} cart - Objet cart retourné par Shopify
   */
  const syncCart = useCallback((cart) => {
    if (!cart) return
    if (cart.id) {
      setCartId(cart.id)
      sessionStorage.setItem(CART_ID_KEY, cart.id)
    }
    if (cart.checkoutUrl) setCheckoutUrl(cart.checkoutUrl)
    const count = cart.lines?.edges?.reduce((s, { node }) => s + node.quantity, 0) ?? 0
    setItemCount(count)
  }, [])

  return (
    <CartCtx.Provider value={{ isOpen, openCart, closeCart, cartId, checkoutUrl, itemCount, syncCart }}>
      {children}
    </CartCtx.Provider>
  )
}

export const useCart = () => useContext(CartCtx)
