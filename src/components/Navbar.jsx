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
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="fixed z-50"
        style={{
          top:    scrolled ? '12px'  : '0px',
          left:   scrolled ? '20px'  : '0px',
          right:  scrolled ? '20px'  : '0px',
          borderRadius: scrolled ? '20px' : '0px',
          background: scrolled
            ? 'rgba(8,8,20,0.90)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(28px) saturate(1.5)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(28px) saturate(1.5)' : 'none',
          boxShadow: scrolled
            ? '0 8px 40px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.07), inset 0 1px 0 rgba(255,255,255,0.06)'
            : 'none',
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
        {/* Filet lumineux doré en bas quand non flottant */}
        {!scrolled && (
          <div className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,85,0.18), rgba(0,229,255,0.12), transparent)' }}
          />
        )}
        {/* Filet doré en haut quand flottant */}
        {scrolled && (
          <div className="absolute top-0 left-0 right-0 h-px rounded-t-[20px] overflow-hidden"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,85,0.30), rgba(0,229,255,0.22), transparent)' }}
          />
        )}

        {/* ─── Desktop layout ─── */}
        <div className="hidden lg:flex px-6 md:px-8 h-[68px] items-center justify-between">
          {/* Logo gauche */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <motion.div
              whileHover={{ rotate: 5, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-black text-base relative"
              style={{ background: 'linear-gradient(135deg, #d4a855, #f0cc7a, #00e5ff)', boxShadow: '0 0 18px rgba(212,168,85,0.30)' }}
            >
              T
              <span className="absolute inset-0 rounded-xl"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 60%)' }} />
            </motion.div>
            <span className="font-display text-[26px] tracking-[3px] text-brand-text">
              Tixy<span style={{ background: 'linear-gradient(110deg, #d4a855, #f0cc7a, #d4a855)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Carplay</span>
            </span>
          </Link>

          {/* Liens desktop centre */}
          <div className="flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <Link key={link.to} to={link.to}>
                <motion.div
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  className={`relative px-3.5 py-2 rounded-full text-[13px] font-medium tracking-wide transition-all duration-200 ${
                    isActive(link.to) ? 'text-white' : 'text-brand-muted hover:text-brand-text hover:bg-white/[0.04]'
                  }`}
                >
                  {link.label}
                  {isActive(link.to) && (
                    <motion.span layoutId="nav-active" className="absolute inset-0 rounded-full -z-10"
                      style={{ background: 'rgba(212,168,85,0.10)', border: '1px solid rgba(212,168,85,0.20)' }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Panier desktop droite */}
          <div className="relative flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={openCart}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-[13px] text-black relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #d4a855, #f0cc7a 50%, #d4a855)', backgroundSize: '200% auto', boxShadow: '0 0 20px rgba(212,168,85,0.22)' }}
            >
              <span className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 60%)' }} />
              <ShoppingCart className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Panier</span>
            </motion.button>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] rounded-full text-white text-[10px] font-black flex items-center justify-center leading-none px-1 z-20 pointer-events-none"
                style={{ background: '#e53e3e', border: '2px solid #0a0a14', boxShadow: '0 2px 6px rgba(0,0,0,0.5)' }}>
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </div>
        </div>

        {/* ─── Mobile layout : panier | logo centré | burger ─── */}
        <div className="lg:hidden px-4 h-[68px] flex items-center">

          {/* GAUCHE : bouton panier doré */}
          <div className="relative flex-shrink-0">
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={openCart}
              className="w-[42px] h-[42px] rounded-xl flex items-center justify-center relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #d4a855, #f0cc7a)', boxShadow: '0 0 16px rgba(212,168,85,0.30)' }}
            >
              <span className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, transparent 55%)' }} />
              <ShoppingCart className="w-[18px] h-[18px] text-black relative z-10" />
            </motion.button>
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] rounded-full text-white text-[9px] font-black flex items-center justify-center leading-none px-0.5 z-20 pointer-events-none"
                style={{ background: '#e53e3e', border: '2px solid #0a0a14' }}>
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </div>

          {/* CENTRE : logo TixyCars centré */}
          <Link to="/" className="flex-1 flex items-center justify-center gap-2 group">
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-black text-sm relative"
              style={{ background: 'linear-gradient(135deg, #d4a855, #f0cc7a)', boxShadow: '0 0 14px rgba(212,168,85,0.28)' }}
            >
              T
              <span className="absolute inset-0 rounded-xl"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 60%)' }} />
            </motion.div>
            <span className="font-display text-[20px] tracking-[2px] text-brand-text">
              Tixy<span style={{ background: 'linear-gradient(110deg, #d4a855, #f0cc7a, #d4a855)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Carplay</span>
            </span>
          </Link>

          {/* DROITE : burger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex-shrink-0 w-[42px] h-[42px] flex items-center justify-center rounded-xl transition-all"
            style={{
              background: mobileOpen ? 'rgba(212,168,85,0.10)' : 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              color: '#eeeef5',
            }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* ─── Menu mobile ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(7,7,13,0.97)', backdropFilter: 'blur(32px)' }}
          >
            {/* Filet doré en haut */}
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,85,0.45), rgba(0,229,255,0.30), transparent)' }}
            />

            {/* Bouton fermer */}
            <div className="flex justify-end px-4 pt-5">
              <button
                onClick={() => setMobileOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-xl transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#7a7a95' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col px-5 pt-4 gap-1">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.055, ease: [0.16,1,0.3,1] }}
                >
                  <Link
                    to={link.to}
                    className={`flex items-center py-3.5 px-4 rounded-2xl text-[17px] font-medium tracking-wide transition-all ${
                      isActive(link.to)
                        ? 'text-white'
                        : 'text-brand-muted hover:text-brand-text hover:bg-white/[0.04]'
                    }`}
                    style={isActive(link.to) ? {
                      background: 'rgba(212,168,85,0.08)',
                      border: '1px solid rgba(212,168,85,0.18)',
                    } : {}}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={() => { setMobileOpen(false); openCart() }}
                className="mt-6 w-full py-4 rounded-2xl font-bold text-black text-base flex items-center justify-center gap-2 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #d4a855, #f0cc7a 50%, #d4a855)',
                  backgroundSize: '200% auto',
                  boxShadow: '0 4px 24px rgba(212,168,85,0.25)',
                }}
              >
                <span className="absolute inset-0"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 60%)' }} />
                <ShoppingCart className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Voir le panier</span>
                {itemCount > 0 && (
                  <span className="relative z-10 ml-1 bg-black/20 text-black rounded-full px-2 text-xs font-black">
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
