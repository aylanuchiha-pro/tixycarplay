import { Link } from 'react-router-dom'
import { Camera, MessageCircle, Globe, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.04] bg-brand-dark">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-white text-base"
                style={{ background: 'linear-gradient(135deg, #00e5ff, #7c3aed)' }}>T</div>
              <span className="font-display text-[22px] tracking-[2px] text-brand-text">TIXY<span className="text-brand-cyan">CARS</span></span>
            </div>
            <p className="text-brand-muted text-sm leading-relaxed max-w-[260px] mb-6">
              Spécialiste CarPlay en Île-de-France. Vente &amp; installation de systèmes Apple CarPlay et Android Auto.
            </p>
            <div className="flex gap-3">
              {[Camera, MessageCircle, Globe].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-brand-muted hover:text-brand-cyan hover:border-brand-cyan/30 transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs tracking-[3px] uppercase text-brand-cyan font-semibold mb-5">Produits</h4>
            <div className="flex flex-col gap-3">
              <Link to="/carplay-filaire" className="text-sm text-brand-muted hover:text-brand-text transition-colors">CarPlay Filaire</Link>
              <Link to="/carplay-integre" className="text-sm text-brand-muted hover:text-brand-text transition-colors">CarPlay Intégré</Link>
              <a href="#" className="text-sm text-brand-muted hover:text-brand-text transition-colors">Accessoires</a>
            </div>
          </div>

          <div>
            <h4 className="text-xs tracking-[3px] uppercase text-brand-cyan font-semibold mb-5">Services</h4>
            <div className="flex flex-col gap-3">
              <Link to="/installation" className="text-sm text-brand-muted hover:text-brand-text transition-colors">Installation</Link>
              <Link to="/realisations" className="text-sm text-brand-muted hover:text-brand-text transition-colors">Réalisations</Link>
              <a href="#" className="text-sm text-brand-muted hover:text-brand-text transition-colors">Garantie</a>
            </div>
          </div>

          <div>
            <h4 className="text-xs tracking-[3px] uppercase text-brand-cyan font-semibold mb-5">Contact</h4>
            <div className="flex flex-col gap-4">
              <a href="tel:+33600000000" className="flex items-center gap-3 text-sm text-brand-muted hover:text-brand-text transition-colors">
                <Phone size={16} className="text-brand-cyan" /> 06 XX XX XX XX
              </a>
              <a href="mailto:contact@tixycars.fr" className="flex items-center gap-3 text-sm text-brand-muted hover:text-brand-text transition-colors">
                <Mail size={16} className="text-brand-cyan" /> contact@tixycars.fr
              </a>
              <span className="flex items-center gap-3 text-sm text-brand-muted">
                <MapPin size={16} className="text-brand-cyan" /> Île-de-France
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.04] pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-brand-muted">© {new Date().getFullYear()} TixyCars. Tous droits réservés.</p>
          <div className="flex gap-6">
            {['Mentions légales', 'CGV', 'Confidentialité'].map(t => (
              <a key={t} href="#" className="text-xs text-brand-muted hover:text-brand-text transition-colors">{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
