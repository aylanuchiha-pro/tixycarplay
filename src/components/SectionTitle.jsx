import { motion } from 'framer-motion'
import { useIntersection } from '../hooks/useScroll'

export default function SectionTitle({ subtitle, title, accentColor = '#00e5ff', align = 'center' }) {
  const [ref, inView] = useIntersection({ threshold: 0.3 })
  return (
    <div ref={ref} className={`mb-14 ${align === 'center' ? 'text-center' : 'text-left'}`}>
      <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
        className="font-body text-xs tracking-[5px] uppercase mb-3 font-semibold" style={{ color: accentColor }}>{subtitle}</motion.p>
      <motion.h2 initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.1 }}
        className="font-display text-brand-text leading-none" style={{ fontSize: 'clamp(36px, 6vw, 64px)', letterSpacing: '3px' }}>{title}</motion.h2>
      <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 0.8, delay: 0.3 }}
        className={`h-[3px] w-20 mt-5 ${align === 'center' ? 'mx-auto' : ''}`}
        style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)`, transformOrigin: align === 'center' ? 'center' : 'left' }} />
    </div>
  )
}
