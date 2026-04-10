import { useState, useEffect } from 'react'
import { useIntersection } from '../hooks/useScroll'

export default function CountUp({ target, suffix = '', duration = 2 }) {
  const [count, setCount] = useState(0)
  const [ref, inView] = useIntersection({ once: true })
  useEffect(() => {
    if (!inView) return
    let v = 0; const step = target / (duration * 60)
    const id = setInterval(() => { v += step; if (v >= target) { setCount(target); clearInterval(id) } else setCount(Math.floor(v)) }, 1000/60)
    return () => clearInterval(id)
  }, [inView, target, duration])
  return <span ref={ref}>{count}{suffix}</span>
}
