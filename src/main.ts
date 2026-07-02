/* ── NETHER · worlds inside Telegram · orchestration ── */

import './styles/fonts.css'
import './styles/main.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { createNebula, type Nebula, type WorldName } from './webgl'
import { initWorlds } from './worlds'
import { applyLang, initialLang, t } from './i18n'

gsap.registerPlugin(ScrollTrigger)

const RM = matchMedia('(prefers-reduced-motion: reduce)').matches
const $ = <T extends HTMLElement = HTMLElement>(sel: string) => document.querySelector<T>(sel)
const $$ = <T extends HTMLElement = HTMLElement>(sel: string) => Array.from(document.querySelectorAll<T>(sel))

/* ═══════════ language ═══════════ */

applyLang(initialLang())
$('#langUA')?.addEventListener('click', () => applyLang('ua'))
$('#langEN')?.addEventListener('click', () => applyLang('en'))

/* ═══════════ smooth scroll ═══════════ */

let lenis: Lenis | null = null
if (!RM) {
  lenis = new Lenis({ lerp: 0.09 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis!.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
}

/* ═══════════ nebula ═══════════ */

const canvas = document.getElementById('webgl') as HTMLCanvasElement | null
let nebula: Nebula | null = null
let currentWorld: WorldName = 'void'
let scrollProgress = 0

/* boot the nebula off the critical path — after load, at idle */
if (canvas && !RM) {
  const boot = () => {
    nebula = createNebula(canvas)
    if (!nebula) {
      document.body.classList.add('no-webgl')
      return
    }
    nebula.setWorld(currentWorld)
    nebula.setScroll(scrollProgress)
  }
  const idle = () =>
    'requestIdleCallback' in window ? requestIdleCallback(boot, { timeout: 1200 }) : setTimeout(boot, 350)
  if (document.readyState === 'complete') idle()
  else addEventListener('load', idle, { once: true })
} else {
  document.body.classList.add('no-webgl')
}

ScrollTrigger.create({
  start: 0,
  end: 'max',
  onUpdate: (self) => {
    scrollProgress = self.progress
    nebula?.setScroll(self.progress)
  },
})

/* ═══════════ world atmosphere switching ═══════════ */

const WORLD_MAP: [string, WorldName][] = [
  ['#hero', 'void'],
  ['#manifesto', 'void'],
  ['#stats', 'void'],
  ['#mira', 'mira'],
  ['#gogo', 'gogo'],
  ['#spy', 'spy'],
  ['#tdm', 'tdm'],
  ['#kpinder', 'kpinder'],
  ['#clients', 'void'],
  ['#about', 'void'],
  ['#contact', 'void'],
]

/* ── ambient glow that follows the current world ── */

const ACCENTS: Record<WorldName, string> = {
  void: '#6d7fa8',
  mira: '#a78bfa',
  gogo: '#5b8cff',
  spy: '#ffb454',
  tdm: '#4ee0d8',
  kpinder: '#ff7a93',
}

const glowEl = $('#worldglow')
const glow = { r: 109, g: 127, b: 168 }
const paintGlow = () => {
  if (glowEl)
    glowEl.style.background = `radial-gradient(56% 42% at 50% 40%, rgba(${glow.r | 0}, ${glow.g | 0}, ${glow.b | 0}, 0.13), transparent 72%)`
}
paintGlow()

function setGlow(name: WorldName): void {
  const n = parseInt(ACCENTS[name].slice(1), 16)
  const target = { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
  if (RM) {
    Object.assign(glow, target)
    paintGlow()
    return
  }
  gsap.to(glow, { ...target, duration: 1.4, ease: 'power2.inOut', overwrite: 'auto', onUpdate: paintGlow })
}

/* ── film chapter HUD ── */

const HUD_MAP: Partial<Record<WorldName, [string, string]>> = {
  mira: ['01', 'MIRA'],
  gogo: ['02', 'GOGO'],
  spy: ['03', 'VERTUU SPY'],
  tdm: ['04', 'NETHER TDM'],
  kpinder: ['05', 'KPINDER'],
}

const hud = $('#hud')
const hudIndex = $('#hudIndex')
const hudName = $('#hudName')

function setHud(name: WorldName): void {
  if (!hud || !hudIndex || !hudName) return
  const chapter = HUD_MAP[name]
  if (!chapter) {
    hud.classList.remove('on')
    return
  }
  hudIndex.textContent = chapter[0]
  hudName.textContent = chapter[1]
  hud.classList.add('on')
  if (!RM) {
    gsap.fromTo(
      [hudIndex, hudName],
      { y: 9, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.07, ease: 'power3.out', overwrite: 'auto' },
    )
  }
}

WORLD_MAP.forEach(([sel, name]) => {
  ScrollTrigger.create({
    trigger: sel,
    start: 'top 50%',
    end: 'bottom 50%',
    onToggle: (self) => {
      if (!self.isActive) return
      currentWorld = name
      document.body.dataset.world = name
      nebula?.setWorld(name)
      setGlow(name)
      setHud(name)
    },
  })
})

/* ═══════════ rail ═══════════ */

const railLinks = new Map($$('#rail a').map((a) => [a.dataset.rail!, a]))
;['hero', 'mira', 'gogo', 'spy', 'tdm', 'kpinder', 'clients', 'about', 'contact'].forEach((id) => {
  ScrollTrigger.create({
    trigger: `#${id}`,
    start: 'top 50%',
    end: 'bottom 50%',
    onToggle: (self) => {
      if (!self.isActive) return
      railLinks.forEach((a) => a.classList.remove('is-active'))
      railLinks.get(id)?.classList.add('is-active')
    },
  })
})

/* ═══════════ anchor scrolling ═══════════ */

$$('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector<HTMLElement>(a.getAttribute('href')!)
    if (!target) return
    e.preventDefault()
    if (lenis) lenis.scrollTo(target, { duration: 1.5, easing: (x) => 1 - Math.pow(1 - x, 4) })
    else target.scrollIntoView()
  })
})

/* ═══════════ nav tuck ═══════════ */

const nav = $('#nav')
let lastY = 0
let vel = 0
const onScrollY = (y: number) => {
  if (!nav) return
  if (y > 160 && y > lastY + 3) nav.classList.add('is-tucked')
  else if (y < lastY - 3 || y <= 160) nav.classList.remove('is-tucked')
  lastY = y
}
if (lenis) {
  lenis.on('scroll', (e: { scroll: number; velocity: number }) => {
    onScrollY(e.scroll)
    vel = e.velocity
  })
} else addEventListener('scroll', () => onScrollY(scrollY), { passive: true })

/* ═══════════ velocity typography: marquee + gate skew ═══════════ */

const mTrack1 = $('#mTrack1')
const mTrack2 = $('#mTrack2')
const marqueeEl = $('#marquee')

if (!RM && mTrack1 && mTrack2 && marqueeEl) {
  let x1 = 0
  let x2 = 0
  let w1 = 1
  let w2 = 1
  let visible = false
  let skew = 0
  const gateTitles = $$('.gate-title')
  let gskew = 0

  const measure = () => {
    w1 = mTrack1.scrollWidth / 2 || 1
    w2 = mTrack2.scrollWidth / 2 || 1
  }
  measure()
  addEventListener('resize', measure)

  new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), { rootMargin: '120px' }).observe(marqueeEl)

  gsap.ticker.add((_time, dt) => {
    vel *= 0.94 // settle when lenis goes quiet

    if (visible) {
      const boost = Math.min(Math.abs(vel) * 0.02, 5)
      x1 = (x1 + (0.05 + boost * 0.03) * dt) % w1
      x2 = (x2 + (0.032 + boost * 0.02) * dt) % w2
      const targetSkew = Math.max(-9, Math.min(9, vel * 0.24))
      skew += (targetSkew - skew) * 0.09
      gsap.set(mTrack1, { x: -x1, skewX: -skew })
      gsap.set(mTrack2, { x: x2 - w2, skewX: -skew })
    }

    const gTarget = Math.max(-3.4, Math.min(3.4, vel * 0.09))
    gskew += (gTarget - gskew) * 0.09
    if (Math.abs(gskew) > 0.03) {
      gateTitles.forEach((el) => gsap.set(el, { skewY: gskew }))
    }
  })
}

/* ═══════════ cursor ═══════════ */

const cursor = $('#cursor')
if (cursor && matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const label = $('#cursorLabel')!
  const xTo = gsap.quickTo(cursor, 'x', { duration: 0.3, ease: 'power3.out' })
  const yTo = gsap.quickTo(cursor, 'y', { duration: 0.3, ease: 'power3.out' })
  addEventListener('pointermove', (e) => {
    xTo(e.clientX)
    yTo(e.clientY)
  }, { passive: true })

  document.addEventListener('pointerover', (e) => {
    const el = (e.target as HTMLElement).closest?.('[data-cursor]') as HTMLElement | null
    if (!el) return
    const kind = el.dataset.cursor
    if (kind === 'hover') cursor.classList.add('is-hover')
    else if (kind) {
      label.textContent = t(`cursor.${kind}`)
      cursor.classList.add('is-label')
    }
  })
  document.addEventListener('pointerout', (e) => {
    if ((e.target as HTMLElement).closest?.('[data-cursor]')) {
      cursor.classList.remove('is-hover', 'is-label')
    }
  })
  document.documentElement.addEventListener('mouseleave', () => cursor.classList.add('is-hidden'))
  document.documentElement.addEventListener('mouseenter', () => cursor.classList.remove('is-hidden'))
}

/* ═══════════ magnetic elements ═══════════ */

function magnetize(el: HTMLElement, strength: number): void {
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect()
    gsap.to(el, {
      x: ((e.clientX - r.left) / r.width - 0.5) * strength,
      y: ((e.clientY - r.top) / r.height - 0.5) * strength,
      duration: 0.4,
      ease: 'power3.out',
    })
  })
  el.addEventListener('pointerleave', () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' })
  })
}

if (!RM && matchMedia('(hover: hover)').matches) {
  $$('.contact-btn').forEach((el) => magnetize(el, 30))
  $$('.nav-cta, .w-cta').forEach((el) => magnetize(el, 14))
}

/* ═══════════ manifesto — word by word ═══════════ */

const maniTriggers: ScrollTrigger[] = []

function buildManifesto(): void {
  if (RM) return
  maniTriggers.forEach((st) => st.kill())
  maniTriggers.length = 0

  $$('.mani-line').forEach((line) => {
    const text = (line.textContent ?? '').trim()
    line.innerHTML = text
      .split(/\s+/)
      .map((w) => `<span class="w">${w}</span>`)
      .join(' ')
    const words = Array.from(line.querySelectorAll<HTMLElement>('.w'))
    maniTriggers.push(
      ScrollTrigger.create({
        trigger: line,
        start: 'top 84%',
        end: 'top 36%',
        onUpdate: (self) => {
          const k = Math.round(self.progress * words.length)
          words.forEach((w, i) => w.classList.toggle('on', i < k))
        },
      }),
    )
  })
}

buildManifesto()

/* ═══════════ stats counters ═══════════ */

$$('.count').forEach((el) => {
  const target = Number(el.dataset.count ?? 0)
  const plus = 'plus' in el.dataset
  const fmt = (n: number) => {
    let s = String(Math.round(n))
    if (target < 10) s = s.padStart(2, '0')
    s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    return plus ? `${s}+` : s
  }
  if (RM) {
    el.textContent = fmt(target)
    return
  }
  el.textContent = fmt(0)
  ScrollTrigger.create({
    trigger: el,
    start: 'top 88%',
    once: true,
    onEnter: () => {
      const obj = { v: 0 }
      gsap.to(obj, {
        v: target,
        duration: 2,
        ease: 'power3.out',
        onUpdate: () => (el.textContent = fmt(obj.v)),
      })
    },
  })
})

/* ═══════════ world gates ═══════════ */

if (!RM) {
  $$('.world').forEach((world) => {
    const gate = world.querySelector<HTMLElement>('.world-gate')
    const title = world.querySelector<HTMLElement>('.gate-title')
    if (!gate || !title) return

    gsap.fromTo(
      title,
      { '--fill': '0%' },
      {
        '--fill': '100%',
        ease: 'none',
        scrollTrigger: { trigger: gate, start: 'top 62%', end: 'bottom 85%', scrub: true },
      },
    )
    gsap.fromTo(
      title,
      { yPercent: 12, scale: 0.955 },
      {
        yPercent: -10,
        scale: 1.02,
        ease: 'none',
        scrollTrigger: { trigger: gate, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    )
    const kind = world.querySelector('.gate-kind')
    const index = world.querySelector('.gate-index')
    if (kind && index) {
      gsap.fromTo(
        [index, kind],
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: gate, start: 'top 55%', once: true },
        },
      )
    }
  })
}

/* ═══════════ generic reveals ═══════════ */

function reveal(sel: string, vars: gsap.TweenVars = {}): void {
  if (RM) return
  $$(sel).forEach((el) => {
    gsap.from(el, {
      y: 44,
      opacity: 0,
      duration: 1.1,
      ease: 'power3.out',
      ...vars,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    })
  })
}

reveal('.w-tag')
reveal('.w-desc', { y: 34 })
reveal('.w-chips', { y: 24 })
reveal('.w-cta', { y: 24 })
reveal('.tdm-pillars a', { y: 30 })
reveal('.w-stage', { y: 0, scale: 0.94, duration: 1.3 })
reveal('.clients-over, .clients-title', { y: 30 })
reveal('.dossier-row', { y: 36 })
reveal('.about-name', { y: 50 })
reveal('.about-lines p', { y: 30 })
reveal('.about-skills', { y: 24 })
reveal('.contact-over, .contact-title, .contact-btn, .contact-links', { y: 40 })
reveal('.stat', { y: 40 })

/* hero parallax exit */
if (!RM) {
  gsap.to('.hero-title', {
    yPercent: -30,
    opacity: 0.25,
    ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom 25%', scrub: true },
  })
  gsap.to('.hero-sub, .hero-meta, .hero-over', {
    yPercent: -70,
    opacity: 0,
    ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: '70% 25%', scrub: true },
  })
}

/* ═══════════ dossier accents ═══════════ */

$$('.dossier-row').forEach((row) => {
  const accent = row.dataset.accent
  if (accent) row.style.setProperty('--row-acc', accent)
})

/* ═══════════ preloader & hero intro ═══════════ */

if (!RM) gsap.set('.h-l', { yPercent: 110 })

function runPreloader(): Promise<void> {
  const pre = $('#preloader')
  if (!pre) return Promise.resolve()
  if (RM) {
    pre.remove()
    return Promise.resolve()
  }
  const word = $('#preWord')!
  const count = $('#preCount')!
  const bar = $('#preBar')!
  const words = ['MIRA', 'GOGO', 'VERTUU SPY', 'NETHER TDM', 'KPINDER']
  let wi = 0
  const wordTimer = window.setInterval(() => {
    wi = (wi + 1) % words.length
    word.textContent = words[wi]
  }, 210)

  const fontsReady = Promise.race([
    (document as Document & { fonts?: FontFaceSet }).fonts?.ready ?? Promise.resolve(),
    new Promise((r) => setTimeout(r, 1500)),
  ])
  const counting = new Promise<void>((res) => {
    const obj = { v: 0 }
    gsap.to(obj, {
      v: 100,
      duration: 1.7,
      ease: 'power2.inOut',
      onUpdate: () => {
        count.textContent = String(Math.round(obj.v)).padStart(2, '0')
        bar.style.width = `${obj.v}%`
      },
      onComplete: res,
    })
  })

  return Promise.all([fontsReady, counting]).then(
    () =>
      new Promise<void>((res) => {
        clearInterval(wordTimer)
        word.textContent = 'NETHER'
        gsap
          .timeline({ onComplete: () => { pre.remove(); res() } })
          .to('.pre-caption, .pre-bar', { opacity: 0, duration: 0.3 })
          .to('.pre-center', { opacity: 0, y: -22, duration: 0.4, ease: 'power2.in' }, 0.12)
          .to(pre, { yPercent: -100, duration: 0.85, ease: 'power4.inOut' }, 0.42)
      }),
  )
}

function heroIntro(): void {
  if (RM) return
  gsap
    .timeline()
    .to('.h-l', { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.065 })
    /* release letters to CSS so :hover transforms can take over */
    .call(() => gsap.set('.h-l', { clearProps: 'transform' }), [], 1.65)
    .from('.hero-over', { y: 18, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.75')
    .from('.hero-sub', { y: 26, opacity: 0, duration: 0.9, ease: 'power3.out' }, '-=0.62')
    .from('.hero-chip', { y: 16, opacity: 0, duration: 0.7, stagger: 0.09, ease: 'power3.out' }, '-=0.6')
    .from('.hero-scroll', { opacity: 0, duration: 0.9 }, '-=0.45')
}

runPreloader().then(heroIntro)

/* ═══════════ interactive worlds ═══════════ */

initWorlds(RM)

/* pause decorative CSS loops while their world is off screen */
const worldObserver = new IntersectionObserver(
  (entries) => entries.forEach((entry) => entry.target.classList.toggle('in-view', entry.isIntersecting)),
  { rootMargin: '80px' },
)
$$('.world').forEach((el) => worldObserver.observe(el))

/* ═══════════ language rebuilds ═══════════ */

window.addEventListener('nether:lang', () => {
  buildManifesto()
  ScrollTrigger.refresh()
})

addEventListener('load', () => ScrollTrigger.refresh())
