import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export default function TutoModal({ product, onClose }) {
  if (!product) return null
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
        className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(12px)' }}>
        <motion.div initial={{ scale: 0.85, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85, y: 30 }}
          onClick={e => e.stopPropagation()}
          className="bg-brand-card rounded-3xl max-w-[600px] w-full max-h-[90vh] overflow-y-auto border border-brand-violet/20">
          <div className="flex items-center justify-between p-6 pb-0">
            <div>
              <p className="text-xs tracking-[3px] uppercase text-brand-violetLight font-semibold mb-1">Tutoriel installation</p>
              <h3 className="font-display text-3xl text-brand-text tracking-wider">{product.nom}</h3>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-brand-muted hover:text-brand-text transition-colors"><X size={20} /></button>
          </div>
          <div className="p-6">
            {/* Video area */}
            <div className="w-full aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-brand-violet/10 to-brand-cyan/5 border border-brand-violet/15 mb-6">
              {product.tutoVideo ? (
                <iframe src={product.tutoVideo} title={`Tuto ${product.nom}`} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <img src={product.image} alt={product.nom} className="w-full h-full object-cover absolute inset-0 opacity-30" />
                    <div className="relative z-10">
                      <p className="text-3xl mb-2">▶️</p>
                      <p className="text-brand-muted text-sm">Vidéo tuto — {product.nom}</p>
                      <p className="text-brand-violetLight text-xs mt-1">Ajoute le lien YouTube dans products.js</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Steps */}
            {product.tutoEtapes && (
              <div>
                <h4 className="font-display text-xl text-brand-text tracking-wider mb-4">Étapes d'installation</h4>
                <div className="flex flex-col gap-2.5">
                  {product.tutoEtapes.map((etape, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <div className="w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white mt-0.5"
                        style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>{i + 1}</div>
                      <p className="text-sm text-brand-muted leading-relaxed">{etape}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-6 flex gap-3">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 rounded-xl font-semibold text-sm text-black"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>Commander ce produit</motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="py-3 px-5 rounded-xl font-semibold text-sm text-brand-violetLight border border-brand-violet/30 hover:bg-brand-violet/10 transition-colors">
                Demander l'installation</motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
