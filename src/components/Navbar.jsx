import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'

const NAV_LINKS = [
  { to: '/',                label: 'Accueil' },
  { to: '/carplay-filaire', label: 'CarPlay Filaire' },
  { to: '/carplay-integre', label: 'CarPlay Intégré' },
  { to: '/accessoires',     label: 'Accessoires' },
  { to: '/installation',    label: 'Installation' },
  { to: '/realisations',    label: 'Réalisations' },
  { to: '/tutoriels',       label: 'Tutoriels' },
  { to: '/contact',         label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { openCart, itemCount } = useCart()

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const isActive = (to) => location.pathname === to

  return (
    <>
      {/* ─── Barre de navigation ─── */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed z-50"
        style={{
          /* Position : pleine largeur → flottant */
          top:    scrolled ? '12px'  : '0px',
          left:   scrolled ? '16px'  : '0px',
          right:  scrolled ? '16px'  : '0px',
          /* Forme */
          borderRadius: scrolled ? '18px' : '0px',
          /* Fond */
          background:     scrolled ? 'rgba(10,10,18,0.88)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px) saturate(1.3)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.3)' : 'none',
          /* Ombre & bordure */
          boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.07)' : 'none',
          /* Transition CSS fluide */
          transition: [
            'top 0.5s cubic-bezier(0.16,1,0.3,1)',
            'left 0.5s cubic-bezier(0.16,1,0.3,1)',
            'right 0.5s cubic-bezier(0.16,1,0.3,1)',
            'border-radius 0.5s cubic-bezier(0.16,1,0.3,1)',
            'background 0.4s ease',
            'box-shadow 0.4s ease',
          ].join(', '),
        }}
      >
        {/* Trait du bas quand pas encore flottant */}
        {!scrolled && (
          <div className="absolute bottom-0 left-0 right-0 h-px bg-white/[0.05]" />
        )}

        <div className="px-4 sm:px-6 md:px-8 h-[68px] flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <motion.div
              whileHover={{ rotate: 6, scale: 1.08 }}
              className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-base"
              style={{ background: 'linear-gradient(135deg, #00e5ff, #7c3aed)' }}
            >T</motion.div>
            <span className="font-display text-[20px] sm:text-[22px] md:text-[26px] tracking-[1px] sm:tracking-[2px] md:tracking-[3px] text-brand-text">
              Tixycars<span className="hidden sm:inline text-brand-cyan"> CarPlay</span>
            </span>
          </Link>

          {/* Liens desktop */}
          <div className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <Link key={link.to} to={link.to}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive(link.to)
                      ? 'bg-brand-cyan/10 text-brand-cyan'
                      : 'text-brand-muted hover:text-brand-text hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Panier + burger */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openCart}
              className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-black relative"
              style={{ background: 'linear-gradient(135deg, #00e5ff, #06b6d4)' }}
            >
              <ShoppingCart className="w-4 h-4" /> Panier
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-white text-black text-[10px] font-black flex items-center justify-center leading-none">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </motion.button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-brand-text rounded-xl hover:bg-white/5 transition-all"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ─── Menu mobile ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(7,7,13,0.97)', backdropFilter: 'blur(24px)' }}
          >
            {/* Bouton fermer */}
            <div className="flex justify-end px-4 pt-5">
              <button
                onClick={() => setMobileOpen(false)}
                className="w-10 h-10 flex items-center justify-center text-brand-muted hover:text-white rounded-xl hover:bg-white/5 transition-all"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex flex-col px-5 pt-4 gap-1">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    to={link.to}
                    className={`flex items-center py-4 px-4 rounded-2xl text-lg font-medium transition-all ${
                      isActive(link.to)
                        ? 'bg-brand-cyan/10 text-brand-cyan'
                        : 'text-brand-muted hover:text-brand-text hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38 }}
                onClick={() => { setMobileOpen(false); openCart() }}
                className="mt-6 w-full py-4 rounded-2xl font-bold text-black text-base flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #00e5ff, #06b6d4)' }}
              >
                <ShoppingCart className="w-5 h-5" /> Voir le panier
                {itemCount > 0 && (
                  <span className="ml-1 bg-black/20 text-black rounded-full px-2 text-xs font-black">
                    {itemCount}
                  </span>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
