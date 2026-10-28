
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

type Props = {
  theta: number
  phi: number
}

export default function BlochSphere({ theta, phi }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const state = useRef({ theta, phi })

  useEffect(() => {
    state.current = { theta, phi }
  }, [theta, phi])

  useEffect(() => {
    if (!host.current) return

    const el = host.current
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#0d141d')

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100)
    camera.position.set(3.5, 2.5, 4.5)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(el.clientWidth, el.clientHeight)
    el.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.06

    scene.add(new THREE.AmbientLight('#ffffff', 1.8))

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(1, 48, 32),
      new THREE.MeshBasicMaterial({
        color: '#152535',
        transparent: true,
        opacity: 0.32,
        side: THREE.DoubleSide,
      }),
    )
    scene.add(sphere)

    const guideMaterial = new THREE.LineBasicMaterial({
      color: '#526b82',
      transparent: true,
      opacity: 0.65,
    })

    function addLine(points: THREE.Vector3[], material = guideMaterial) {
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      scene.add(new THREE.Line(geometry, material))
    }

    // Equator
    const circle = (radius: number, y: number, vertical = false) => {
      const points: THREE.Vector3[] = []
      for (let i = 0; i <= 160; i++) {
        const a = (i / 160) * Math.PI * 2
        points.push(
          vertical
            ? new THREE.Vector3(radius * Math.cos(a), radius * Math.sin(a), 0)
            : new THREE.Vector3(radius * Math.cos(a), y, radius * Math.sin(a)),
        )
      }
      addLine(points)
    }

    circle(1, 0)
    circle(1, 0, true)

    // Latitude rings
    for (let deg = -60; deg <= 60; deg += 30) {
      const lat = (deg * Math.PI) / 180
      circle(Math.cos(lat), Math.sin(lat))
    }

    // Longitude guides
    for (let deg = 30; deg < 180; deg += 30) {
      const angle = (deg * Math.PI) / 180
      const points: THREE.Vector3[] = []
      for (let i = 0; i <= 100; i++) {
        const t = (i / 100) * Math.PI
        points.push(new THREE.Vector3(
          Math.sin(t) * Math.cos(angle),
          Math.cos(t),
          Math.sin(t) * Math.sin(angle),
        ))
      }
      addLine(points)
    }

    // Cartesian axes
    const axisMaterial = new THREE.LineBasicMaterial({
      color: '#91a5b9',
    })

    addLine(
      [new THREE.Vector3(-1.3, 0, 0), new THREE.Vector3(1.3, 0, 0)],
      axisMaterial,
    )
    addLine(
      [new THREE.Vector3(0, -1.3, 0), new THREE.Vector3(0, 1.3, 0)],
      axisMaterial,
    )
    addLine(
      [new THREE.Vector3(0, 0, -1.3), new THREE.Vector3(0, 0, 1.3)],
      axisMaterial,
    )

    // Axis labels: Three.js Y is the vertical Bloch Z axis.
    function addAxisLabel(
      label: string,
      position: THREE.Vector3,
      color = '#d7e3ef',
    ) {
      const canvas = document.createElement('canvas')
      canvas.width = 128
      canvas.height = 64

      const context = canvas.getContext('2d')
      if (!context) return

      context.clearRect(0, 0, canvas.width, canvas.height)
      context.font = 'bold 40px Arial'
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      context.fillStyle = color
      context.fillText(label, 64, 32)

      const texture = new THREE.CanvasTexture(canvas)
      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false,
      })
      const sprite = new THREE.Sprite(material)
      sprite.position.copy(position)
      sprite.scale.set(0.35, 0.175, 1)
      scene.add(sprite)
    }

    addAxisLabel('X', new THREE.Vector3(1.45, 0, 0))
    addAxisLabel('Z', new THREE.Vector3(0, 1.45, 0), '#67d5e8')
    addAxisLabel('Y', new THREE.Vector3(0, 0, 1.45))

    const vectorMaterial = new THREE.LineBasicMaterial({
      color: '#67d5e8',
    })
    const vectorGeometry = new THREE.BufferGeometry()
    const vector = new THREE.Line(vectorGeometry, vectorMaterial)
    scene.add(vector)

    const tip = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 20, 16),
      new THREE.MeshBasicMaterial({ color: '#67d5e8' }),
    )
    scene.add(tip)

    const poleMaterial = new THREE.MeshBasicMaterial({ color: '#d7e3ef' })
    for (const y of [-1, 1]) {
      const pole = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 16, 12),
        poleMaterial,
      )
      pole.position.y = y
      scene.add(pole)
    }

    let frame = 0
    let width = 0
    let height = 0

    const updateSize = () => {
      width = el.clientWidth
      height = el.clientHeight
      if (!width || !height) return
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    const observer = new ResizeObserver(updateSize)
    observer.observe(el)
    updateSize()

    const animate = () => {
      frame = requestAnimationFrame(animate)
      const t = state.current.theta * Math.PI / 180
      const p = state.current.phi * Math.PI / 180
      const end = new THREE.Vector3(
        Math.sin(t) * Math.cos(p),
        Math.cos(t),
        Math.sin(t) * Math.sin(p),
      )

      vectorGeometry.setFromPoints([new THREE.Vector3(0, 0, 0), end])
      tip.position.copy(end)

      controls.update()
      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      controls.dispose()
      scene.traverse(object => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
          object.geometry.dispose()
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material]
          materials.forEach(material => material.dispose())
        }
      })
      renderer.dispose()
      if (renderer.domElement.parentElement === el) {
        el.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div className="sphere-stage">
      <div className="sphere-label sphere-label-top">|0⟩</div>
      <div className="sphere-label sphere-label-bottom">|1⟩</div>
      <div className="sphere-canvas" ref={host} />
      <div className="sphere-hint">DRAG TO ROTATE · SCROLL TO ZOOM</div>
    </div>
  )
}
