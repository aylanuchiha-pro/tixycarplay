import { useState } from 'react'
import { motion } from 'framer-motion'
import { useIntersection } from '../hooks/useScroll'

export default function GalleryCard({ item, index = 0 }) {
  const [ref, inView] = useIntersection({ threshold: 0.1 })
  const [showAfter, setShowAfter] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      className="group relative rounded-2xl overflow-hidden border border-white/[0.06] hover:border-brand-cyan/20 transition-all duration-500 cursor-pointer"
      onClick={() => setShowAfter(!showAfter)}
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={item.imageBefore}
          alt={`${item.voiture} avant`}
          className={`img-cover absolute inset-0 transition-opacity duration-700 ${showAfter ? 'opacity-0' : 'opacity-100'}`}
          loading="lazy"
        />
        <img
          src={item.imageAfter}
          alt={`${item.voiture} après`}
          className={`img-cover absolute inset-0 transition-opacity duration-700 ${showAfter ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute top-3 left-3 z-10">
          <span className={`inline-block text-[10px] tracking-[2px] uppercase font-bold px-3 py-1 rounded-full ${
            showAfter
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {showAfter ? '✓ Après' : 'Avant'}
          </span>
        </div>

        <div className="absolute bottom-3 left-4 right-4 z-10">
          <h3 className="font-display text-xl text-white tracking-wider mb-1">{item.voiture}</h3>
          <p className="font-body text-xs text-white/70 leading-relaxed line-clamp-2">
            {showAfter ? item.apres : item.avant}
          </p>
        </div>

        <div className="absolute bottom-3 right-3 z-10">
          <span className="text-[10px] text-white/40 font-body">
            {showAfter ? '← Retour' : 'Tap pour voir →'}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
