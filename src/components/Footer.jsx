import { Link } from 'react-router-dom'
import { Camera, MessageCircle, Globe, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ background: 'linear-gradient(to bottom, #07070d, #05050a)', borderTop: '1px solid rgba(212,168,85,0.08)' }}>

      {/* Filet doré supérieur */}
      <div className="luxury-divider" />

      <div className="max-w-[1400px] mx-auto px-5 md:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">

          {/* Marque */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-black text-base relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #d4a855, #f0cc7a, #00e5ff)',
                  boxShadow: '0 0 16px rgba(212,168,85,0.25)',
                }}
              >
                <span className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, transparent 60%)' }} />
                <span className="relative z-10 text-white">T</span>
              </div>
              <span className="font-display text-[22px] tracking-[2px] text-brand-text">
                TIXY
                <span style={{
                  background: 'linear-gradient(110deg, #d4a855, #f0cc7a, #d4a855)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>CARS</span>
              </span>
            </div>
            <p className="text-brand-muted text-sm leading-relaxed max-w-[260px] mb-6">
              Spécialiste CarPlay en Île-de-France. Vente &amp; installation de systèmes Apple CarPlay et Android Auto.
            </p>
            <div className="flex gap-3">
              {[Camera, MessageCircle, Globe].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    color: '#7a7a95',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(212,168,85,0.35)'
                    e.currentTarget.style.color = '#d4a855'
                    e.currentTarget.style.background = 'rgba(212,168,85,0.08)'
                    e.currentTarget.style.boxShadow = '0 0 14px rgba(212,168,85,0.12)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                    e.currentTarget.style.color = '#7a7a95'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* Produits */}
          <div>
            <h4 className="text-[10px] tracking-[3px] uppercase font-semibold mb-5"
              style={{ color: '#d4a855' }}>Produits</h4>
            <div className="flex flex-col gap-3">
              {[
                { to: '/carplay-filaire', label: 'CarPlay Filaire' },
                { to: '/carplay-integre', label: 'CarPlay Intégré' },
                { to: '/accessoires',    label: 'Accessoires' },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-sm text-brand-muted hover:text-brand-text transition-colors duration-200 flex items-center gap-1.5 group"
                >
                  <span className="w-3 h-px opacity-0 group-hover:opacity-100 transition-all duration-200"
                    style={{ background: '#d4a855' }} />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[10px] tracking-[3px] uppercase font-semibold mb-5"
              style={{ color: '#d4a855' }}>Services</h4>
            <div className="flex flex-col gap-3">
              {[
                { to: '/installation',  label: 'Installation' },
                { to: '/realisations',  label: 'Réalisations' },
                { to: '#',              label: 'Garantie' },
              ].map(({ to, label }) => (
                <Link
                  key={label}
                  to={to}
                  className="text-sm text-brand-muted hover:text-brand-text transition-colors duration-200 flex items-center gap-1.5 group"
                >
                  <span className="w-3 h-px opacity-0 group-hover:opacity-100 transition-all duration-200"
                    style={{ background: '#d4a855' }} />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] tracking-[3px] uppercase font-semibold mb-5"
              style={{ color: '#d4a855' }}>Contact</h4>
            <div className="flex flex-col gap-4">
              <a href="tel:+33600000000"
                className="flex items-center gap-3 text-sm text-brand-muted hover:text-brand-text transition-colors group">
                <Phone size={15} style={{ color: '#d4a855' }} className="flex-shrink-0" />
                06 XX XX XX XX
              </a>
              <a href="mailto:contact@tixycarplay.fr"
                className="flex items-center gap-3 text-sm text-brand-muted hover:text-brand-text transition-colors group">
                <Mail size={15} style={{ color: '#d4a855' }} className="flex-shrink-0" />
                contact@tixycarplay.fr
              </a>
              <span className="flex items-center gap-3 text-sm text-brand-muted">
                <MapPin size={15} style={{ color: '#d4a855' }} className="flex-shrink-0" />
                Île-de-France
              </span>
            </div>
          </div>
        </div>

        {/* Séparateur luxe */}
        <div className="luxury-divider mb-6" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-brand-subtle">© {new Date().getFullYear()} TixyCarplay. Tous droits réservés.</p>
          <div className="flex gap-6">
            {['Mentions légales', 'CGV', 'Confidentialité'].map(t => (
              <a key={t} href="#"
                className="text-xs text-brand-subtle hover:text-brand-muted transition-colors">{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
