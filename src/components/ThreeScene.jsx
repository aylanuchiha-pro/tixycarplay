import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Subtle floating particles + light streaks — used as background accents only
export default function ThreeScene({ className = '' }) {
  const mountRef = useRef(null)
  const frameRef = useRef(null)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const w = container.clientWidth
    const h = container.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100)
    camera.position.z = 6

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Subtle particles
    const count = 120
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const mat = new THREE.PointsMaterial({
      color: 0x00e5ff, size: 0.02, transparent: true, opacity: 0.35,
      blending: THREE.AdditiveBlending,
    })
    const particles = new THREE.Points(geo, mat)
    scene.add(particles)

    // A few thin ring shapes (like dashboard bezels)
    const rings = []
    for (let i = 0; i < 3; i++) {
      const rGeo = new THREE.TorusGeometry(1.5 + i * 0.8, 0.015, 8, 80)
      const rMat = new THREE.MeshBasicMaterial({
        color: i === 0 ? 0x00e5ff : i === 1 ? 0x7c3aed : 0xf5c542,
        transparent: true, opacity: 0.08 + i * 0.02,
      })
      const ring = new THREE.Mesh(rGeo, rMat)
      ring.rotation.x = Math.PI / 2.5 + i * 0.15
      ring.rotation.z = i * 0.3
      scene.add(ring)
      rings.push(ring)
    }

    let time = 0
    const animate = () => {
      time += 0.008
      particles.rotation.y += 0.0003
      particles.rotation.x += 0.0001
      rings.forEach((r, i) => {
        r.rotation.z += 0.0005 * (i % 2 === 0 ? 1 : -1)
      })
      renderer.render(scene, camera)
      frameRef.current = requestAnimationFrame(animate)
    }
    animate()

    const handleResize = () => {
      const nw = container.clientWidth, nh = container.clientHeight
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
    }
    window.addEventListener('resize', handleResize)
    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div ref={mountRef} className={className}
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
    />
  )
}
