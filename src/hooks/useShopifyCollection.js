import { useState, useEffect } from 'react'
import { getCollectionProducts, normalizeShopifyProduct } from '../services/shopify'

/**
 * Récupère les produits d'une collection Shopify.
 * Shopify est la source de vérité — les données statiques ne servent
 * que de fallback si Shopify est inaccessible (ex: dev sans réseau).
 *
 * @param {string} collectionHandle  ex: 'carplay-filaire'
 * @param {string} fallbackType      type par défaut si non défini sur le produit Shopify
 * @param {Array}  staticFallback    données affichées si Shopify échoue
 */
export function useShopifyCollection(collectionHandle, fallbackType, staticFallback = []) {
  const [products,    setProducts]    = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const collection = await getCollectionProducts(collectionHandle)

        if (cancelled) return

        if (!collection || collection.products.edges.length === 0) {
          // Collection vide ou inexistante → fallback statique
          setProducts(staticFallback)
        } else {
          const normalized = collection.products.edges.map(({ node }) =>
            normalizeShopifyProduct(node, fallbackType)
          )
          setProducts(normalized)
        }
      } catch (err) {
        if (cancelled) return
        console.warn(`[Shopify] "${collectionHandle}" indisponible, fallback statique.`, err.message)
        setError(err.message)
        setProducts(staticFallback)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [collectionHandle])

  return { products, loading, error }
}
