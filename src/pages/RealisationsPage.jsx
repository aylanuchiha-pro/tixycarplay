import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import SectionTitle from '../components/SectionTitle'
import GalleryCard from '../components/GalleryCard'
import { images } from '../data/images'
import { galerie } from '../data/products'

export default function RealisationsPage() {
  return (
    <div className="grain min-h-screen">
      {/* Hero */}
      <section className="relative h-[45vh] min-h-[320px] flex items-end overflow-hidden">
        <img src={images.bgCarClose} alt="Détail voiture" className="img-cover absolute inset-0" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/80 to-transparent" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 pb-12 w-full">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-emerald-400 transition-colors mb-6"><ArrowLeft size={16} /> Retour</Link>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs tracking-[4px] uppercase text-emerald-400 font-semibold mb-2">Photos clients</p>
            <h1 className="font-display text-5xl md:text-7xl text-white tracking-wider leading-none mb-3">RÉALISATIONS</h1>
            <p className="font-body text-white/50 max-w-[440px]">Avant / après de nos installations. Cliquez pour comparer.</p>
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 px-5 md:px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {galerie.map((item, i) => <GalleryCard key={item.id} item={item} index={i} />)}
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="mt-10 p-5 rounded-xl bg-emerald-400/[0.04] border border-emerald-400/12 text-center">
            <p className="font-body text-sm text-brand-text">📸 Photos réelles — remplace les images Unsplash par tes propres photos dans <code className="text-emerald-400/80 text-xs">src/data/images.js</code></p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-5 md:px-8 text-center border-t border-white/[0.04]">
        <h3 className="font-display text-3xl md:text-4xl text-brand-text tracking-wider mb-4">ENVIE DU MÊME RÉSULTAT ?</h3>
        <p className="font-body text-brand-muted mb-8 max-w-[360px] mx-auto">Réservez votre installation et transformez votre véhicule.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/installation">
            <motion.button whileHover={{ scale: 1.04 }} className="px-10 py-4 rounded-2xl font-bold text-[15px] text-black"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>Réserver</motion.button>
          </Link>
          <Link to="/carplay-integre">
            <motion.button whileHover={{ scale: 1.04 }}
              className="px-10 py-4 rounded-2xl font-semibold text-[15px] text-emerald-400 border border-emerald-400/30 hover:bg-emerald-400/5 transition-all">Voir les produits</motion.button>
          </Link>
        </div>
      </section>
    </div>
  )
}
