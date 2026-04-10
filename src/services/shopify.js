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

/* ── Récupérer un produit + ses variantes par handle ── */
export async function getProductByHandle(handle) {
  const data = await shopifyFetch(`
    query GetProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
        variants(first: 10) {
          edges {
            node {
              id
              title
              priceV2 { amount currencyCode }
              availableForSale
            }
          }
        }
      }
    }
  `, { handle })
  return data.productByHandle
}

/* ── Créer un panier Shopify ── */
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
          cost {
            totalAmount { amount currencyCode }
          }
        }
        userErrors { field message }
      }
    }
  `, { lines })

  if (data.cartCreate.userErrors?.length)
    throw new Error(data.cartCreate.userErrors[0].message)

  return data.cartCreate.cart
}

/* ── Ajouter des articles à un panier existant ── */
export async function addCartLines(cartId, lines) {
  const data = await shopifyFetch(`
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
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

/* ── Récupérer un panier existant ── */
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

/* ── Helper : extraire les variantes d'un produit Shopify ── */
export function extractVariants(shopifyProduct) {
  return shopifyProduct?.variants?.edges?.map(({ node }) => node) ?? []
}

/* ── Helper : première variante disponible ── */
export function getFirstAvailableVariant(shopifyProduct) {
  const variants = extractVariants(shopifyProduct)
  return variants.find((v) => v.availableForSale) ?? variants[0] ?? null
}
