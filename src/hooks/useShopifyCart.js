import { useState, useCallback, useRef } from 'react'
import {
  createCart,
  addCartLines,
  getProductByHandle,
  getFirstAvailableVariant,
} from '../services/shopify'
import { useCart } from '../context/CartContext'

export function useShopifyCart() {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const inFlight              = useRef(false)

  const { cartId, syncCart, openCart } = useCart()

  const addToCart = useCallback(async (product, redirectToCheckout = false, quantity = 1) => {
    if (!product?.shopifyHandle) return null
    if (inFlight.current) return null

    inFlight.current = true
    setLoading(true)
    setError(null)

    try {
      const shopifyProduct = await getProductByHandle(product.shopifyHandle)
      if (!shopifyProduct) throw new Error(`Produit "${product.shopifyHandle}" introuvable.`)

      const variant = getFirstAvailableVariant(shopifyProduct)
      if (!variant) throw new Error('Aucune variante disponible.')

      const line = { merchandiseId: variant.id, quantity }

      let cart
      if (cartId) {
        try {
          cart = await addCartLines(cartId, [line])
        } catch {
          cart = await createCart([line])
        }
      } else {
        cart = await createCart([line])
      }

      syncCart(cart)

      if (redirectToCheckout && cart.checkoutUrl) {
        window.location.href = cart.checkoutUrl
      } else {
        openCart()
      }

      return cart

    } catch (err) {
      console.error('[Shopify Cart]', err)
      setError(err.message)
      return null
    } finally {
      setLoading(false)
      inFlight.current = false
    }
  }, [cartId, syncCart, openCart])

  return { addToCart, loading, error }
}
