/* ── the nebula · one particle field that becomes every world ──
   raw WebGL, zero dependencies: one program, one buffer, gl.POINTS */

import gsap from 'gsap'

export type WorldName = 'void' | 'mira' | 'gogo' | 'spy' | 'tdm' | 'kpinder'

const PALETTES: Record<WorldName, [string, string, number]> = {
  //           inner       outer      spread
  void: ['#6d7fa8', '#28304d', 0.16],
  mira: ['#8b5cf6', '#e8c878', 0.62],
  gogo: ['#3b6cff', '#8fb2ff', 0.58],
  spy: ['#ff9a3d', '#7a3f22', 0.5],
  tdm: ['#35d6ce', '#d63bd6', 0.62],
  kpinder: ['#ff6b8a', '#ffc2cf', 0.55],
}

const VERT = `
attribute vec4 aData;      // radius, theta0, y, rnd
uniform mat4 uMV;
uniform mat4 uProj;
uniform float uTime;
uniform float uSpread;
uniform float uScroll;
uniform float uPixelRatio;
varying float vRnd;
varying float vDepth;

void main() {
  float radius = aData.x;
  float theta0 = aData.y;
  float baseY  = aData.z;
  float rnd    = aData.w;
  vRnd = rnd;

  float speed = mix(0.03, 0.14, fract(rnd * 7.31));
  float theta = theta0 + uTime * speed + uScroll * 1.4;

  // ring -> nebula: spread pushes points off the torus into a cloud
  float wander = (fract(rnd * 13.7) - 0.5) * 2.0;
  float r = radius * max(0.32, 1.0 + uSpread * wander * 1.9);
  float y = baseY * (1.0 + uSpread * 5.5)
          + sin(uTime * 0.5 + rnd * 6.2832) * (0.05 + uSpread * 0.22);

  vec4 mv = uMV * vec4(cos(theta) * r, y, sin(theta) * r, 1.0);
  vDepth = -mv.z;
  gl_Position = uProj * mv;

  float size = mix(1.4, 3.4, fract(rnd * 3.17)) * uPixelRatio;
  gl_PointSize = size * (4.6 / vDepth);
}
`

const FRAG = `
precision mediump float;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uOpacity;
varying float vRnd;
varying float vDepth;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float disc = smoothstep(0.5, 0.08, length(uv));
  vec3 col = mix(uColorA, uColorB, fract(vRnd * 5.13));
  float tw = 0.65 + 0.35 * sin(vRnd * 40.0 + vDepth);
  gl_FragColor = vec4(col, disc * uOpacity * tw);
}
`

/* ── tiny mat4 helpers (column-major) ── */

function perspective(out: Float32Array, fovy: number, aspect: number, near: number, far: number): void {
  const f = 1 / Math.tan(fovy / 2)
  out.fill(0)
  out[0] = f / aspect
  out[5] = f
  out[10] = (far + near) / (near - far)
  out[11] = -1
  out[14] = (2 * far * near) / (near - far)
}

/* view matrix looking from eye at origin (up = +Y), multiplied by a fixed
   rotation of the ring around X — fused into one matrix by hand */
function viewTimesModel(out: Float32Array, ex: number, ey: number, ez: number, rotX: number): void {
  // camera basis
  let zx = ex, zy = ey, zz = ez
  const zl = Math.hypot(zx, zy, zz) || 1
  zx /= zl; zy /= zl; zz /= zl
  let xx = -zz, xy = 0, xz = zx // cross(up, z) with up=(0,1,0)
  const xl = Math.hypot(xx, xy, xz) || 1
  xx /= xl; xz /= xl
  const yx = zy * xz - zz * xy
  const yy = zz * xx - zx * xz
  const yz = zx * xy - zy * xx
  // view = [x y z | -basis·eye]
  const v = [
    xx, yx, zx, 0,
    xy, yy, zy, 0,
    xz, yz, zz, 0,
    -(xx * ex + xy * ey + xz * ez),
    -(yx * ex + yy * ey + yz * ez),
    -(zx * ex + zy * ey + zz * ez),
    1,
  ]
  // model = rotateX(rotX): columns (1,0,0),(0,c,s),(0,-s,c)
  const c = Math.cos(rotX)
  const s = Math.sin(rotX)
  // out = view * model  (only columns 1 and 2 change)
  out[0] = v[0]; out[1] = v[1]; out[2] = v[2]; out[3] = 0
  out[4] = v[4] * c + v[8] * s
  out[5] = v[5] * c + v[9] * s
  out[6] = v[6] * c + v[10] * s
  out[7] = 0
  out[8] = -v[4] * s + v[8] * c
  out[9] = -v[5] * s + v[9] * c
  out[10] = -v[6] * s + v[10] * c
  out[11] = 0
  out[12] = v[12]; out[13] = v[13]; out[14] = v[14]; out[15] = 1
}

function hex(hexStr: string): { r: number; g: number; b: number } {
  const n = parseInt(hexStr.slice(1), 16)
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 }
}

export interface Nebula {
  setWorld(name: WorldName): void
  setScroll(progress: number): void
  destroy(): void
}

export function createNebula(canvas: HTMLCanvasElement): Nebula | null {
  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: false,
    depth: false,
    powerPreference: 'high-performance',
  })
  if (!gl) return null

  /* software rasterizers (SwiftShader, llvmpipe…) can't afford the party;
     ?forcegl overrides the check for testing */
  const force = new URLSearchParams(location.search).has('forcegl')
  const dbg = gl.getExtension('WEBGL_debug_renderer_info')
  if (dbg && !force) {
    const rendererName = String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL))
    if (/swiftshader|llvmpipe|software|basic render/i.test(rendererName)) return null
  }

  const compile = (type: number, src: string) => {
    const sh = gl.createShader(type)!
    gl.shaderSource(sh, src)
    gl.compileShader(sh)
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) return null
    return sh
  }
  const vs = compile(gl.VERTEX_SHADER, VERT)
  const fs = compile(gl.FRAGMENT_SHADER, FRAG)
  if (!vs || !fs) return null

  const prog = gl.createProgram()!
  gl.attachShader(prog, vs)
  gl.attachShader(prog, fs)
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null
  gl.useProgram(prog)

  const coarse = matchMedia('(pointer: coarse)').matches
  const COUNT = coarse ? 5200 : 12500
  let dpr = Math.min(devicePixelRatio, 1.75)

  /* geometry: torus core + halo scatter */
  const data = new Float32Array(COUNT * 4)
  for (let i = 0; i < COUNT; i++) {
    const halo = Math.random() > 0.82
    const radius = halo
      ? 1.2 + Math.random() * 4.6
      : 2.15 + (Math.random() + Math.random() + Math.random() - 1.5) * 0.5
    const y = halo ? (Math.random() - 0.5) * 1.6 : (Math.random() + Math.random() - 1) * 0.16
    data[i * 4 + 0] = radius
    data[i * 4 + 1] = Math.random() * Math.PI * 2
    data[i * 4 + 2] = y
    data[i * 4 + 3] = Math.random()
  }

  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
  const locData = gl.getAttribLocation(prog, 'aData')
  gl.enableVertexAttribArray(locData)
  gl.vertexAttribPointer(locData, 4, gl.FLOAT, false, 0, 0)

  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE) // additive
  gl.clearColor(0, 0, 0, 0)

  const U = (name: string) => gl.getUniformLocation(prog, name)
  const uMV = U('uMV')
  const uProj = U('uProj')
  const uTime = U('uTime')
  const uSpread = U('uSpread')
  const uScroll = U('uScroll')
  const uPixelRatio = U('uPixelRatio')
  const uColorA = U('uColorA')
  const uColorB = U('uColorB')
  const uOpacity = U('uOpacity')

  const proj = new Float32Array(16)
  const mv = new Float32Array(16)

  const state = {
    spread: PALETTES.void[2],
    scroll: 0,
    opacity: 0,
    colA: hex(PALETTES.void[0]),
    colB: hex(PALETTES.void[1]),
  }

  const resize = () => {
    canvas.width = Math.round(innerWidth * dpr)
    canvas.height = Math.round(innerHeight * dpr)
    gl.viewport(0, 0, canvas.width, canvas.height)
    perspective(proj, (46 * Math.PI) / 180, innerWidth / innerHeight, 0.1, 60)
  }
  resize()
  addEventListener('resize', resize)

  gsap.to(state, { opacity: 1, duration: 2.2, ease: 'power2.out', delay: 0.25 })

  /* pointer parallax */
  let mx = 0
  let my = 0
  const onPointer = (e: PointerEvent) => {
    mx = (e.clientX / innerWidth - 0.5) * 2
    my = (e.clientY / innerHeight - 0.5) * 2
  }
  addEventListener('pointermove', onPointer, { passive: true })

  /* render loop with adaptive quality */
  let raf = 0
  let last = performance.now()
  let slowFrames = 0
  let drawCount = COUNT
  let camX = 0
  let camY = 0.75

  const loop = (now: number) => {
    raf = requestAnimationFrame(loop)
    const dt = now - last
    last = now

    if (drawCount === COUNT && dt > 34 && ++slowFrames > 45) {
      drawCount = Math.floor(COUNT * 0.55)
      dpr = 1
      resize()
    }

    camX += (mx * 0.42 - camX) * 0.03
    camY += (0.75 - my * 0.3 - camY) * 0.03
    viewTimesModel(mv, camX, camY, 5.4, 0.42)

    gl.uniformMatrix4fv(uMV, false, mv)
    gl.uniformMatrix4fv(uProj, false, proj)
    gl.uniform1f(uTime, now * 0.001)
    gl.uniform1f(uSpread, state.spread)
    gl.uniform1f(uScroll, state.scroll)
    gl.uniform1f(uPixelRatio, dpr)
    gl.uniform1f(uOpacity, state.opacity)
    gl.uniform3f(uColorA, state.colA.r, state.colA.g, state.colA.b)
    gl.uniform3f(uColorB, state.colB.r, state.colB.g, state.colB.b)

    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.POINTS, 0, drawCount)
  }
  raf = requestAnimationFrame(loop)

  const onVis = () => {
    if (document.hidden) cancelAnimationFrame(raf)
    else {
      last = performance.now()
      raf = requestAnimationFrame(loop)
    }
  }
  document.addEventListener('visibilitychange', onVis)

  return {
    setWorld(name) {
      const [a, b, spread] = PALETTES[name]
      gsap.to(state.colA, { ...hex(a), duration: 1.4, ease: 'power2.inOut', overwrite: 'auto' })
      gsap.to(state.colB, { ...hex(b), duration: 1.4, ease: 'power2.inOut', overwrite: 'auto' })
      gsap.to(state, { spread, duration: 1.6, ease: 'power2.inOut', overwrite: 'auto' })
    },
    setScroll(progress) {
      state.scroll = progress
    },
    destroy() {
      cancelAnimationFrame(raf)
      removeEventListener('pointermove', onPointer)
      removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVis)
      gl.deleteBuffer(buf)
      gl.deleteProgram(prog)
    },
  }
}
