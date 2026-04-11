import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send, CheckCircle, Instagram, MessageCircle } from 'lucide-react'
import SectionTitle from '../components/SectionTitle'
import { images } from '../data/images'

export default function ContactPage() {
  const [form, setForm] = useState({ nom: '', email: '', tel: '', sujet: '', voiture: '', message: '' })
  const [sent, setSent] = useState(false)

  const submit = (e) => { e.preventDefault(); console.log('Contact:', form); setSent(true); setTimeout(() => setSent(false), 5000) }
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const inp = "w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-brand-text font-body text-sm outline-none focus:border-brand-cyan/40 transition-colors placeholder:text-brand-subtle"

  return (
    <div className="grain min-h-screen">
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[300px] flex items-end overflow-hidden">
        <img src={images.bgRoad} alt="Route de nuit" className="img-cover absolute inset-0" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/80 to-transparent" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 pb-12 w-full">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-brand-cyan transition-colors mb-6"><ArrowLeft size={16} /> Retour</Link>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs tracking-[4px] uppercase text-brand-cyan font-semibold mb-2">Parlons de votre projet</p>
            <h1 className="font-display text-5xl md:text-7xl text-white tracking-wider leading-none">CONTACT</h1>
          </motion.div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-5 md:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="lg:col-span-3 bg-brand-card rounded-2xl p-8 border border-white/[0.06]">
            {sent ? (
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center py-16">
                <CheckCircle size={56} className="text-brand-cyan mx-auto mb-5" />
                <h3 className="font-display text-3xl text-brand-text tracking-wider mb-3">Envoyé !</h3>
                <p className="font-body text-sm text-brand-muted">Réponse sous 24h maximum.</p>
              </motion.div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="font-body text-xs text-brand-muted mb-1.5 block">Nom *</label>
                    <input type="text" required value={form.nom} onChange={set('nom')} className={inp} placeholder="Votre nom" /></div>
                  <div><label className="font-body text-xs text-brand-muted mb-1.5 block">Email *</label>
                    <input type="email" required value={form.email} onChange={set('email')} className={inp} placeholder="votre@email.com" /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="font-body text-xs text-brand-muted mb-1.5 block">Téléphone</label>
                    <input type="tel" value={form.tel} onChange={set('tel')} className={inp} placeholder="06 XX XX XX XX" /></div>
                  <div><label className="font-body text-xs text-brand-muted mb-1.5 block">Véhicule</label>
                    <input type="text" value={form.voiture} onChange={set('voiture')} className={inp} placeholder="Marque & modèle" /></div>
                </div>
                <div><label className="font-body text-xs text-brand-muted mb-1.5 block">Sujet *</label>
                  <select required value={form.sujet} onChange={set('sujet')} className={inp + ' cursor-pointer'}>
                    <option value="">Sélectionnez</option>
                    <option>Achat CarPlay filaire</option><option>Achat CarPlay intégré</option>
                    <option>Demande d'installation</option><option>Demande de devis</option>
                    <option>Compatibilité véhicule</option><option>SAV / Garantie</option><option>Autre</option>
                  </select>
                </div>
                <div><label className="font-body text-xs text-brand-muted mb-1.5 block">Message *</label>
                  <textarea required value={form.message} onChange={set('message')} rows={5} className={inp + ' resize-vertical'} placeholder="Décrivez votre demande..." /></div>
                <motion.button type="submit" whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0,229,255,0.15)' }} whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-xl font-bold text-[15px] text-black flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #00e5ff, #7c3aed)' }}><Send size={16} /> Envoyer</motion.button>
              </form>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="lg:col-span-2 flex flex-col gap-5">
            <div className="bg-brand-card rounded-2xl p-6 border border-white/[0.06]">
              <h3 className="font-display text-lg text-brand-text tracking-wider mb-5">Coordonnées</h3>
              <div className="space-y-4">
                {[
                  { icon: Phone, t1: '06 XX XX XX XX', t2: 'Appel & WhatsApp', href: 'tel:+33600000000' },
                  { icon: Mail, t1: 'contact@tixycarplay.fr', t2: 'Réponse sous 24h', href: 'mailto:contact@tixycarplay.fr' },
                  { icon: MapPin, t1: 'Île-de-France', t2: 'Domicile ou atelier', href: null },
                ].map(({ icon: Icon, t1, t2, href }, i) => {
                  const El = href ? 'a' : 'div'
                  return <El key={i} href={href || undefined} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-brand-cyan" /></div>
                    <div>
                      <p className="font-body text-sm text-brand-text group-hover:text-brand-cyan transition-colors">{t1}</p>
                      <p className="font-body text-xs text-brand-muted">{t2}</p>
                    </div>
                  </El>
                })}
              </div>
            </div>
            <div className="bg-brand-card rounded-2xl p-6 border border-white/[0.06]">
              <h3 className="font-display text-lg text-brand-text tracking-wider mb-4"><Clock size={16} className="inline mr-2 -mt-0.5 text-brand-cyan" />Horaires</h3>
              <div className="space-y-2">
                {[{ j: 'Lun — Ven', h: '9h — 19h' }, { j: 'Samedi', h: '10h — 18h' }, { j: 'Dimanche', h: 'Sur demande' }].map((r, i) => (
                  <div key={i} className="flex justify-between"><span className="font-body text-sm text-brand-muted">{r.j}</span><span className="font-body text-sm text-brand-text">{r.h}</span></div>
                ))}
              </div>
            </div>
            <div className="bg-brand-card rounded-2xl p-6 border border-white/[0.06]">
              <h3 className="font-display text-lg text-brand-text tracking-wider mb-4">Réseaux</h3>
              <div className="flex gap-3">
                {[{ icon: Instagram, label: 'Instagram' }, { icon: MessageCircle, label: 'TikTok' }].map(({ icon: Icon, label }, i) => (
                  <a key={i} href="#" className="flex-1 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center gap-2 text-brand-muted hover:text-brand-cyan hover:border-brand-cyan/30 transition-all">
                    <Icon size={16} /><span className="font-body text-sm">{label}</span></a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
