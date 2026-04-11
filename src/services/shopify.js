/**
 * Client Shopify Storefront API (GraphQL)
 * Token public → sûr à exposer en frontend
 */

const DOMAIN  = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN
const TOKEN   = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN
const VERSION = import.meta.env.VITE_SHOPIFY_API_VERSION ?? '2026-07'

const ENDPOINT = `https://${DOMAIN}/api/${VERSION}/graphql.json`

async function shopifyFetch(query, variables = {}) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  })

  if (!res.ok) throw new Error(`Shopify API error: ${res.status}`)
  const { data, errors } = await res.json()
  if (errors?.length) throw new Error(errors[0].message)
  return data
}

/* ─────────────────────────────────────────────
   PRODUITS PAR COLLECTION
   handle = 'carplay-filaire' | 'carplay-integre' | 'accessoires'
───────────────────────────────────────────── */
export async function getCollectionProducts(collectionHandle, first = 50) {
  const data = await shopifyFetch(`
    query GetCollection($handle: String!, $first: Int!) {
      collection(handle: $handle) {
        title
        handle
        products(first: $first) {
          edges {
            node {
              id
              title
              handle
              productType
              availableForSale
              tags
              description(truncateAt: 200)
              descriptionHtml
              featuredImage {
                url
                altText
              }
              images(first: 5) {
                edges {
                  node { url altText }
                }
              }
              priceRange {
                minVariantPrice { amount currencyCode }
              }
              compareAtPriceRange {
                maxVariantPrice { amount currencyCode }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    availableForSale
                    priceV2 { amount currencyCode }
                    compareAtPriceV2 { amount currencyCode }
                  }
                }
              }
              metafield(namespace: "custom", key: "specs") {
                value
              }
              metafieldCategorie: metafield(namespace: "custom", key: "categorie") {
                value
              }
            }
          }
        }
      }
    }
  `, { handle: collectionHandle, first })

  return data.collection
}

/* ─────────────────────────────────────────────
   PRODUIT UNIQUE PAR HANDLE
───────────────────────────────────────────── */
const productCache = new Map()

export async function getProductByHandle(handle) {
  if (productCache.has(handle)) return productCache.get(handle)

  const data = await shopifyFetch(`
    query GetProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
        productType
        availableForSale
        tags
        description(truncateAt: 500)
        descriptionHtml
        featuredImage { url altText }
        images(first: 5) {
          edges { node { url altText } }
        }
        priceRange {
          minVariantPrice { amount currencyCode }
        }
        compareAtPriceRange {
          maxVariantPrice { amount currencyCode }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              availableForSale
              priceV2 { amount currencyCode }
              compareAtPriceV2 { amount currencyCode }
            }
          }
        }
        metafield(namespace: "custom", key: "specs") {
          value
        }
        metafieldCategorie: metafield(namespace: "custom", key: "categorie") {
          value
        }
      }
    }
  `, { handle })

  const product = data.productByHandle
  if (product) productCache.set(handle, product)
  return product
}

/* ─────────────────────────────────────────────
   NORMALISATION : Shopify → format local TixyCars
   Convertit un produit Shopify au format attendu par
   les composants React (ProductCard, ProductPage, etc.)
───────────────────────────────────────────── */
export function normalizeShopifyProduct(node, fallbackType = 'filaire') {
  const variants    = node.variants?.edges?.map(({ node: v }) => v) ?? []
  const firstVariant = variants.find((v) => v.availableForSale) ?? variants[0]

  // Prix principal (première variante dispo)
  const prix = firstVariant
    ? parseFloat(firstVariant.priceV2.amount)
    : parseFloat(node.priceRange?.minVariantPrice?.amount ?? 0)

  // Prix barré
  const compareRaw = firstVariant?.compareAtPriceV2?.amount
    ?? node.compareAtPriceRange?.maxVariantPrice?.amount
  const prixBarre  = compareRaw && parseFloat(compareRaw) > prix
    ? parseFloat(compareRaw)
    : null

  // Badge depuis les tags (tag "badge:Bestseller" → "Bestseller")
  const badgeTag = (node.tags ?? []).find((t) => t.startsWith('badge:'))
  const badge    = badgeTag ? badgeTag.replace('badge:', '') : null

  // Type de produit
  const typeMap = {
    'carplay filaire': 'filaire',
    'filaire':         'filaire',
    'carplay intégré': 'integre',
    'integre':         'integre',
    'intégré':         'integre',
    'accessoire':      'accessoire',
    'accessoires':     'accessoire',
  }
  const type = typeMap[(node.productType ?? '').toLowerCase()] ?? fallbackType

  // Specs depuis métachamp "custom.specs" (une spec par ligne)
  const specsRaw = node.metafield?.value ?? ''
  const specs    = specsRaw
    ? specsRaw.split('\n').map((s) => s.trim()).filter(Boolean)
    : []

  // Catégorie (pour les accessoires) depuis métachamp ou tags
  const categorieTag = (node.tags ?? []).find((t) => t.startsWith('categorie:'))
  const categorie    = node.metafieldCategorie?.value
    ?? (categorieTag ? categorieTag.replace('categorie:', '') : null)

  // Images
  const allImages = node.images?.edges?.map(({ node: img }) => img.url) ?? []
  const image     = node.featuredImage?.url ?? allImages[0] ?? null

  return {
    // Identifiants
    id:             node.handle,           // on utilise le handle comme id local
    shopifyId:      node.id,
    shopifyHandle:  node.handle,

    // Contenu
    nom:              node.title,
    description:      node.description ?? '',
    descriptionLongue: node.descriptionHtml
      ? node.descriptionHtml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
      : node.description ?? '',

    // Prix
    prix,
    prixBarre,

    // Visuels
    image,
    images:   allImages,

    // Méta
    badge,
    type,
    categorie,
    specs,
    availableForSale: node.availableForSale ?? true,

    // Shopify variants (pour le checkout)
    variants,

    // Champs spécifiques TixyCars (à compléter via static data si besoin)
    cameraOption: null,
    tutoEtapes:   [],
    tutoVideo:    '',
  }
}

/* ─────────────────────────────────────────────
   PANIER — créer
───────────────────────────────────────────── */
export async function createCart(lines = []) {
  const data = await shopifyFetch(`
    mutation CartCreate($lines: [CartLineInput!]) {
      cartCreate(input: { lines: $lines }) {
        cart {
          id
          checkoutUrl
          lines(first: 20) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    priceV2 { amount currencyCode }
                    product { title }
                  }
                }
              }
            }
          }
          cost { totalAmount { amount currencyCode } }
        }
        userErrors { field message }
      }
    }
  `, { lines })

  if (data.cartCreate.userErrors?.length)
    throw new Error(data.cartCreate.userErrors[0].message)

  return data.cartCreate.cart
}

/* ─────────────────────────────────────────────
   PANIER — ajouter des articles
───────────────────────────────────────────── */
export async function addCartLines(cartId, lines) {
  const data = await shopifyFetch(`
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          lines(first: 20) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    priceV2 { amount currencyCode }
                    product { title handle }
                  }
                }
              }
            }
          }
          cost { totalAmount { amount currencyCode } }
        }
        userErrors { field message }
      }
    }
  `, { cartId, lines })

  if (data.cartLinesAdd.userErrors?.length)
    throw new Error(data.cartLinesAdd.userErrors[0].message)

  return data.cartLinesAdd.cart
}

/* ─────────────────────────────────────────────
   PANIER — récupérer
───────────────────────────────────────────── */
export async function getCart(cartId) {
  const data = await shopifyFetch(`
    query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        lines(first: 20) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  priceV2 { amount currencyCode }
                  product { title handle }
                }
              }
            }
          }
        }
        cost { totalAmount { amount currencyCode } }
      }
    }
  `, { cartId })
  return data.cart
}

/* ─────────────────────────────────────────────
   HELPERS variantes
───────────────────────────────────────────── */
export function extractVariants(shopifyProduct) {
  return shopifyProduct?.variants?.edges?.map(({ node }) => node) ?? []
}

export function getFirstAvailableVariant(shopifyProduct) {
  const variants = extractVariants(shopifyProduct)
  return variants.find((v) => v.availableForSale) ?? variants[0] ?? null
}
