# 🚗 TixyCars — Site CarPlay

Site vitrine + e-commerce pour TixyCars, spécialiste CarPlay en Île-de-France.

## 🛠️ Stack technique

- **React 18** + **Vite** — build ultra-rapide
- **Tailwind CSS** — styling utilitaire
- **Framer Motion** — animations scroll, hover, transitions de pages
- **Three.js** — scènes 3D (hero, produits, services)
- **React Router** — navigation multi-pages
- **Lucide React** — icônes

## 📁 Structure du projet

```
tixycars/
├── public/
│   ├── images/
│   │   ├── products/      ← Photos produits (.webp)
│   │   └── gallery/       ← Photos avant/après (.webp)
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Navbar.jsx         → Navigation responsive + mobile
│   │   ├── Footer.jsx         → Pied de page complet
│   │   ├── ThreeScene.jsx     → Scènes 3D (hero/products/services)
│   │   ├── SectionTitle.jsx   → Titre de section animé
│   │   ├── ProductCard.jsx    → Carte produit (filaire & intégré)
│   │   ├── GalleryCard.jsx    → Carte avant/après avec flip 3D
│   │   ├── TutoModal.jsx      → Modal vidéo tuto d'installation
│   │   └── CountUp.jsx        → Compteur animé
│   ├── pages/
│   │   ├── HomePage.jsx           → Accueil (toutes les sections)
│   │   ├── CarPlayFilairePage.jsx → Page dédiée filaire
│   │   ├── CarPlayIntegrePage.jsx → Page dédiée intégré + tutos
│   │   ├── InstallationPage.jsx   → Services + formulaire réservation
│   │   ├── RealisationsPage.jsx   → Galerie avant/après
│   │   └── ContactPage.jsx        → Formulaire contact complet
│   ├── data/
│   │   └── products.js       → ⭐ TOUTES LES DONNÉES PRODUITS/SERVICES
│   ├── hooks/
│   │   └── useScroll.js       → Hooks scroll & intersection
│   ├── App.jsx                → Router + layout global
│   ├── main.jsx               → Point d'entrée
│   └── index.css              → Styles globaux + Tailwind
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🚀 Installation & lancement

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer en développement
npm run dev

# 3. Build pour production
npm run build

# 4. Prévisualiser le build
npm run preview
```

## 📝 Comment ajouter/modifier des produits

Tout se passe dans **`src/data/products.js`** :

### Ajouter un CarPlay filaire
```js
{
  id: 'fil-005',
  nom: 'TixyScreen Wireless',
  prix: 139.99,
  prixBarre: 179.99,     // null si pas de prix barré
  description: 'Description du produit...',
  caracteristiques: ['Sans fil', '9" IPS', '...'],
  badge: 'Nouveau',      // null si pas de badge
  image: '/images/products/screen-wireless.webp',
  stock: true,
  shopifyHandle: '',      // → Handle Shopify du produit
}
```

### Ajouter un CarPlay intégré (avec tuto)
```js
{
  id: 'int-005',
  nom: 'TixyDash Audi A3',
  prix: 319.99,
  prixBarre: 399.99,
  description: 'Description...',
  caracteristiques: ['10" IPS', 'Android 13', '...'],
  badge: 'Audi',
  image: '/images/products/dash-audi.webp',
  stock: true,
  tutoVideo: 'https://www.youtube.com/embed/VIDEO_ID',  // ← Lien embed YouTube
  tutoEtapes: [
    'Étape 1...',
    'Étape 2...',
  ],
  shopifyHandle: '',
}
```

### Ajouter une réalisation (avant/après)
```js
{
  id: 'gal-007',
  voiture: 'Toyota Corolla',
  avant: 'Description de l\'état avant...',
  apres: 'Description de l\'état après...',
  imageBefore: '/images/gallery/toyota-before.webp',
  imageAfter: '/images/gallery/toyota-after.webp',
}
```

## 🔗 Intégration Shopify

### Option 1 : Shopify Buy Button (recommandé pour commencer)
1. Crée tes produits sur Shopify
2. Installe le **Shopify Buy Button** channel
3. Récupère le script d'intégration pour chaque produit
4. Dans `ProductCard.jsx`, remplace le bouton panier par le Buy Button

### Option 2 : Shopify Storefront API
1. Crée une app privée Shopify → récupère le **Storefront Access Token**
2. Installe `shopify-buy` : `npm install shopify-buy`
3. Crée un fichier `src/lib/shopify.js` :
```js
import Client from 'shopify-buy'

const client = Client.buildClient({
  domain: 'tixycars.myshopify.com',
  storefrontAccessToken: 'TON_TOKEN_ICI',
})

export default client
```
4. Utilise `client.product.fetchByHandle(handle)` pour récupérer les produits
5. Utilise `client.checkout.create()` pour gérer le panier

### Option 3 : Redirection simple
Dans `ProductCard.jsx`, le bouton panier redirige vers :
```
https://tixycars.myshopify.com/products/{shopifyHandle}
```

## 🔗 Intégration AliExpress (Dropshipping)

1. **DSers** (recommandé) : Installe l'app DSers sur Shopify
2. Lie tes produits AliExpress à tes produits Shopify
3. Les commandes sont automatiquement transmises au fournisseur

## 📸 Ajouter des images

1. Place tes images dans `public/images/products/` et `public/images/gallery/`
2. Format recommandé : `.webp` (meilleure compression)
3. Résolution : 800×600px minimum
4. Dans `ProductCard.jsx`, décommente la balise `<img>` et commente le placeholder

## 📱 Responsive

Le site est entièrement responsive :
- Mobile : menu hamburger, cards empilées
- Tablette : grille 2 colonnes
- Desktop : grille 3-4 colonnes, navigation complète

## 🎨 Personnalisation

### Couleurs
Modifie `tailwind.config.js` → `theme.extend.colors.brand`

### Polices
Modifie dans `index.html` (Google Fonts) et `tailwind.config.js` → `fontFamily`

### Scènes 3D
Modifie `src/components/ThreeScene.jsx` pour ajuster les formes, couleurs, vitesses

## 📋 Checklist avant déploiement

- [ ] Ajouter les vraies images produits
- [ ] Ajouter les photos avant/après
- [ ] Remplir les liens YouTube des tutos
- [ ] Configurer Shopify (produits + Buy Button ou API)
- [ ] Configurer DSers pour le dropshipping AliExpress
- [ ] Mettre à jour le numéro de téléphone
- [ ] Mettre à jour l'email de contact
- [ ] Ajouter les liens Instagram / TikTok
- [ ] Connecter le formulaire de contact (Formspree, EmailJS, etc.)
- [ ] Connecter le formulaire de réservation
- [ ] Rédiger les mentions légales & CGV
- [ ] Configurer un nom de domaine (tixycars.fr)
- [ ] Déployer (Vercel, Netlify, ou Shopify Hydrogen)

## 🌐 Déploiement

### Vercel (le plus simple)
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload du dossier dist/ sur Netlify
```

### Sur Shopify directement
Utilise **Shopify Hydrogen** pour héberger une app React custom sur Shopify.

---

Développé pour **TixyCars** 🚗✨
