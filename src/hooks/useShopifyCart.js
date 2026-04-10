import { useState, useCallback } from 'react'
import {
  createCart,
  addCartLines,
  getProductByHandle,
  getFirstAvailableVariant,
} from '../services/shopify'

const CART_ID_KEY = 'tixycars_cart_id'

/**
 * Hook pour gérer le panier Shopify.
 *
 * Usage dans un composant :
 *   const { addToCart, loading, error } = useShopifyCart()
 *   await addToCart(product)          // ajoute et redirige vers checkout
 *   await addToCart(product, false)   // ajoute sans rediriger
 */
export function useShopifyCart() {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  /**
   * Ajoute un produit au panier Shopify.
   * @param {object} product        - Le produit de products.js (doit avoir shopifyHandle)
   * @param {boolean} redirectToCheckout - Rediriger vers le checkout Shopify après ajout
   * @param {number} quantity
   */
  const addToCart = useCallback(async (product, redirectToCheckout = true, quantity = 1) => {
    if (!product.shopifyHandle) {
      console.warn(`[Shopify] shopifyHandle manquant pour le produit : ${product.id}`)
      return null
    }

    setLoading(true)
    setError(null)

    try {
      // 1. Récupérer le produit Shopify pour avoir l'ID de la variante
      const shopifyProduct = await getProductByHandle(product.shopifyHandle)
      if (!shopifyProduct) throw new Error(`Produit "${product.shopifyHandle}" introuvable dans Shopify.`)

      const variant = getFirstAvailableVariant(shopifyProduct)
      if (!variant) throw new Error('Aucune variante disponible.')

      const line = { merchandiseId: variant.id, quantity }

      // 2. Créer ou réutiliser un panier
      const existingCartId = sessionStorage.getItem(CART_ID_KEY)
      let cart

      if (existingCartId) {
        try {
          cart = await addCartLines(existingCartId, [line])
        } catch {
          // Le panier a expiré → en créer un nouveau
          cart = await createCart([line])
        }
      } else {
        cart = await createCart([line])
      }

      sessionStorage.setItem(CART_ID_KEY, cart.id)

      if (redirectToCheckout && cart.checkoutUrl) {
        window.location.href = cart.checkoutUrl
      }

      return cart

    } catch (err) {
      console.error('[Shopify Cart]', err)
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Construire une URL de checkout direct (sans créer de panier).
   * Utile pour un bouton "Acheter maintenant" simple.
   */
  const buildCheckoutUrl = useCallback(async (product, quantity = 1) => {
    if (!product.shopifyHandle) return null

    const shopifyProduct = await getProductByHandle(product.shopifyHandle)
    const variant = getFirstAvailableVariant(shopifyProduct)
    if (!variant) return null

    const domain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN
    // Décoder l'ID GID → numérique (ex: gid://shopify/ProductVariant/12345 → 12345)
    const numericId = atob(variant.id).split('/').pop()
    return `https://${domain}/cart/${numericId}:${quantity}`
  }, [])

  return { addToCart, buildCheckoutUrl, loading, error }
}
