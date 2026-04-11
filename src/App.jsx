import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollProgress } from './hooks/useScroll'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import CartDrawer from './components/CartDrawer'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import CarPlayFilairePage from './pages/CarPlayFilairePage'
import CarPlayIntegrePage from './pages/CarPlayIntegrePage'
import InstallationPage from './pages/InstallationPage'
import RealisationsPage from './pages/RealisationsPage'
import ContactPage from './pages/ContactPage'
import TutorielsPage from './pages/TutorielsPage'
import AccessoiresPage from './pages/AccessoiresPage'
import ProductPage from './pages/ProductPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function PageWrap({ children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>{children}</motion.div>
  )
}

export default function App() {
  const progress = useScrollProgress()
  const location = useLocation()

  return (
    <CartProvider>
    <div className="min-h-screen bg-brand-dark text-brand-text">
      <div className="fixed top-0 left-0 h-[3px] z-[100]"
        style={{ width: `${progress * 100}%`, background: 'linear-gradient(90deg, #00e5ff, #7c3aed, #f5c542)', transition: 'width 0.1s linear' }} />
      <Navbar />
      <CartDrawer />
      <ScrollToTop />
      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrap><HomePage /></PageWrap>} />
            <Route path="/carplay-filaire" element={<PageWrap><CarPlayFilairePage /></PageWrap>} />
            <Route path="/carplay-integre" element={<PageWrap><CarPlayIntegrePage /></PageWrap>} />
            <Route path="/installation" element={<PageWrap><InstallationPage /></PageWrap>} />
            <Route path="/realisations" element={<PageWrap><RealisationsPage /></PageWrap>} />
            <Route path="/contact" element={<PageWrap><ContactPage /></PageWrap>} />
            <Route path="/tutoriels" element={<PageWrap><TutorielsPage /></PageWrap>} />
            <Route path="/accessoires" element={<PageWrap><AccessoiresPage /></PageWrap>} />
            <Route path="/produit/:id" element={<PageWrap><ProductPage /></PageWrap>} />
            <Route path="*" element={
              <PageWrap>
                <div className="min-h-screen flex items-center justify-center pt-20">
                  <div className="text-center">
                    <h1 className="font-display text-8xl text-brand-cyan mb-4">404</h1>
                    <p className="font-body text-brand-muted mb-8">Page introuvable.</p>
                    <a href="/" className="px-8 py-3 rounded-xl text-sm font-semibold text-black inline-block"
                      style={{ background: 'linear-gradient(135deg, #00e5ff, #06b6d4)' }}>Retour à l'accueil</a>
                  </div>
                </div>
              </PageWrap>
            } />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
    </CartProvider>
  )
}
