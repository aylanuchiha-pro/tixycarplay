import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Clock, CheckCircle } from 'lucide-react'
import SectionTitle from '../components/SectionTitle'
import { images } from '../data/images'
import { services } from '../data/products'

export default function InstallationPage() {
  const [form, setForm] = useState({ nom: '', email: '', tel: '', voiture: '', service: '', date: '', message: '' })
  const [sent, setSent] = useState(false)

  const submit = (e) => { e.preventDefault(); setSent(true); setTimeout(() => setSent(false), 4000) }
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const inp = "w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-brand-text font-body text-sm outline-none focus:border-brand-gold/40 transition-colors placeholder:text-brand-subtle"

  return (
    <div className="grain min-h-screen">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[360px] flex items-end overflow-hidden">
        <img src={images.installation2} alt="Installation professionnelle" className="img-cover absolute inset-0" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/80 to-transparent" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 pb-12 w-full">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-brand-gold transition-colors mb-6"><ArrowLeft size={16} /> Retour</Link>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs tracking-[4px] uppercase text-brand-gold font-semibold mb-2">Île-de-France</p>
            <h1 className="font-display text-5xl md:text-7xl text-white tracking-wider leading-none mb-3">INSTALLATION PRO</h1>
            <p className="font-body text-white/50 max-w-[500px]">À domicile ou en atelier. Chaque pose est soignée, testée et garantie.</p>
          </motion.div>
        </div>
      </section>

      {/* Service cards with images */}
      <section className="py-20 px-5 md:px-8">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="bg-brand-card rounded-2xl overflow-hidden border border-brand-gold/10 hover:border-brand-gold/25 transition-all group">
              <div className="h-44 overflow-hidden img-shimmer relative">
                <img src={s.image} alt={s.titre} className="img-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-card via-transparent to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl text-brand-text tracking-wider mb-2">{s.titre}</h3>
                <p className="font-body text-[13px] text-brand-muted leading-relaxed mb-4">{s.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-display text-lg text-brand-gold">{s.prix}</span>
                  <span className="flex items-center gap-1 text-xs text-brand-muted"><Clock size={12} /> {s.duree}</span>
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => { setForm({ ...form, service: s.titre }); document.getElementById('reservation')?.scrollIntoView({ behavior: 'smooth' }) }}
                  className="w-full py-3 rounded-xl font-semibold text-sm text-black"
                  style={{ background: 'linear-gradient(135deg, #f5c542, #d4a030)' }}>Réserver</motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="py-20 px-5 md:px-8 bg-brand-bg/50 border-y border-white/[0.04]">
        <div className="max-w-[1000px] mx-auto">
          <SectionTitle subtitle="Le processus" title="EN 4 ÉTAPES" accentColor="#f5c542" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-4">
            {[
              { s: '01', t: 'Contactez-nous', d: 'Décrivez votre véhicule et le système souhaité.' },
              { s: '02', t: 'Rendez-vous', d: 'On fixe une date. Chez vous ou en atelier.' },
              { s: '03', t: 'Installation', d: 'Dépose, câblage, montage et tests complets.' },
              { s: '04', t: 'Garantie', d: 'Système testé, configuré et garanti.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="font-display text-5xl text-brand-gold/15 mb-2">{item.s}</div>
                <h3 className="font-display text-lg text-brand-text tracking-wider mb-1">{item.t}</h3>
                <p className="font-body text-xs text-brand-muted leading-relaxed">{item.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Zone */}
      <section className="py-20 px-5 md:px-8">
        <div className="max-w-[900px] mx-auto">
          <SectionTitle subtitle="Couverture" title="ZONE D'INTERVENTION" accentColor="#f5c542" />
          <div className="bg-brand-card rounded-2xl p-8 border border-brand-gold/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-display text-2xl text-brand-text tracking-wider mb-4"><MapPin size={18} className="inline text-brand-gold mr-2 -mt-1" />Île-de-France</h3>
                <div className="space-y-2.5">
                  {['Paris (75)', 'Hauts-de-Seine (92)', 'Seine-Saint-Denis (93)', 'Val-de-Marne (94)', 'Essonne (91)', 'Yvelines (78)', 'Val-d\'Oise (95)', 'Seine-et-Marne (77)'].map((z, i) => (
                    <div key={i} className="flex items-center gap-2"><CheckCircle size={14} className="text-brand-gold flex-shrink-0" /><span className="font-body text-sm text-brand-muted">{z}</span></div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.04]">
                  <p className="font-body text-sm font-semibold text-brand-text mb-1">🚗 Domicile</p>
                  <p className="font-body text-xs text-brand-muted">Gratuit &lt;30km, 1€/km au-delà</p>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.04]">
                  <p className="font-body text-sm font-semibold text-brand-text mb-1">🏢 Atelier</p>
                  <p className="font-body text-xs text-brand-muted">Sur RDV, adresse communiquée après confirmation</p>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.04]">
                  <p className="font-body text-sm font-semibold text-brand-text mb-1">📞 Horaires</p>
                  <p className="font-body text-xs text-brand-muted">Lun-Sam 9h-19h, Dim sur demande</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking form */}
      <section id="reservation" className="py-20 px-5 md:px-8 bg-brand-bg/50 border-t border-white/[0.04]">
        <div className="max-w-[700px] mx-auto">
          <SectionTitle subtitle="Prendre rendez-vous" title="RÉSERVER" accentColor="#f5c542" />
          <div className="bg-brand-card rounded-2xl p-8 border border-brand-gold/10">
            {sent ? (
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center py-12">
                <CheckCircle size={48} className="text-brand-gold mx-auto mb-4" />
                <h3 className="font-display text-2xl text-brand-text tracking-wider mb-2">Demande envoyée !</h3>
                <p className="font-body text-sm text-brand-muted">On vous recontacte sous 24h.</p>
              </motion.div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Nom *" required value={form.nom} onChange={set('nom')} className={inp} />
                  <input type="email" placeholder="Email *" required value={form.email} onChange={set('email')} className={inp} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="tel" placeholder="Téléphone *" required value={form.tel} onChange={set('tel')} className={inp} />
                  <input type="text" placeholder="Marque & modèle *" required value={form.voiture} onChange={set('voiture')} className={inp} />
                </div>
                <select value={form.service} onChange={set('service')} required className={inp + ' cursor-pointer'}>
                  <option value="">Type d'installation *</option>
                  {services.map(s => <option key={s.id} value={s.titre}>{s.titre} — {s.prix}</option>)}
                </select>
                <input type="date" value={form.date} onChange={set('date')} className={inp} />
                <textarea placeholder="Infos complémentaires..." value={form.message} onChange={set('message')} rows={4} className={inp + ' resize-vertical'} />
                <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-xl font-bold text-[15px] text-black"
                  style={{ background: 'linear-gradient(135deg, #f5c542, #d4a030)' }}>Envoyer la demande</motion.button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
