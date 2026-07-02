/* ── per-world interactive stages ── */

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TAROT, lang, t } from './i18n'

const $ = <T extends HTMLElement = HTMLElement>(sel: string) => document.querySelector<T>(sel)

/* ═══════════ 01 · MIRA — the deck ═══════════ */

function initMira(): void {
  const deck = $('#miraDeck')
  const reading = $('#miraReading')
  if (!deck || !reading) return

  let lastCard = -1

  const render = (card: HTMLElement, idx: number) => {
    const tarot = TAROT[idx]
    card.dataset.card = String(idx)
    card.querySelector('.tarot-name')!.textContent = tarot.name[lang]
    card.querySelector('.tarot-glyph')!.textContent = tarot.glyph
  }

  deck.querySelectorAll<HTMLElement>('.tarot').forEach((card) => {
    card.addEventListener('click', () => {
      if (card.classList.contains('is-flipped')) {
        card.classList.remove('is-flipped')
        reading.classList.remove('on')
        return
      }
      let idx = Math.floor(Math.random() * TAROT.length)
      if (idx === lastCard) idx = (idx + 1) % TAROT.length
      lastCard = idx
      render(card, idx)
      card.classList.add('is-flipped')
      reading.dataset.card = String(idx)
      reading.textContent = TAROT[idx].reading[lang]
      reading.classList.remove('on')
      requestAnimationFrame(() => reading.classList.add('on'))
    })
  })

  /* re-render flipped cards after a language switch */
  window.addEventListener('nether:lang', () => {
    deck.querySelectorAll<HTMLElement>('.tarot.is-flipped').forEach((card) => {
      const idx = Number(card.dataset.card ?? 0)
      render(card, idx)
    })
    if (reading.classList.contains('on')) {
      reading.textContent = TAROT[Number(reading.dataset.card ?? 0)].reading[lang]
    }
  })
}

/* ═══════════ 02 · GOGO — the radar ═══════════ */

function initGogo(): void {
  const radar = $('#radar')
  const links = document.getElementById('radarLinks') as unknown as SVGSVGElement | null
  const toast = $('#radarToast')
  const chips = $('#gogoChips')
  if (!radar || !links || !toast || !chips) return

  links.setAttribute('viewBox', '0 0 100 100')
  links.setAttribute('preserveAspectRatio', 'none')

  /* scatter people-dots around the map */
  const dots: { el: HTMLElement; x: number; y: number }[] = []
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 + Math.random() * 0.7
    const dist = 22 + Math.random() * 24
    const x = 50 + Math.cos(angle) * dist
    const y = 50 + Math.sin(angle) * dist
    const el = document.createElement('i')
    el.className = 'radar-dot'
    el.style.left = `${x}%`
    el.style.top = `${y}%`
    radar.appendChild(el)
    dots.push({ el, x, y })
  }

  /* idle breathing: dots appear and disappear like people nearby */
  let idle: number | undefined
  const breathe = () => {
    const dot = dots[Math.floor(Math.random() * dots.length)]
    dot.el.classList.toggle('on')
    const visible = dots.filter((d) => d.el.classList.contains('on')).length
    if (visible < 3) dots[Math.floor(Math.random() * dots.length)].el.classList.add('on')
  }

  let toastTimer: number | undefined

  const match = () => {
    const visible = dots.filter((d) => d.el.classList.contains('on'))
    const target = visible.length ? visible[Math.floor(Math.random() * visible.length)] : dots[0]
    target.el.classList.add('on')

    links.innerHTML = ''
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line.setAttribute('x1', '50')
    line.setAttribute('y1', '50')
    line.setAttribute('x2', String(target.x))
    line.setAttribute('y2', String(target.y))
    links.appendChild(line)
    const len = Math.hypot(target.x - 50, target.y - 50)
    gsap.fromTo(line, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.out' })
    gsap.fromTo(target.el, { scale: 1 }, { scale: 1.7, duration: 0.4, yoyo: true, repeat: 1, ease: 'power2.inOut' })

    toast.textContent = t('gogo.match')
    toast.classList.add('on')
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => {
      toast.classList.remove('on')
      links.innerHTML = ''
    }, 2400)
  }

  chips.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      chips.querySelectorAll('button').forEach((b) => b.classList.remove('is-on'))
      btn.classList.add('is-on')
      match()
    })
  })

  /* run the idle loop only while the world is on screen; demo once */
  let demoDone = false
  ScrollTrigger.create({
    trigger: '#gogo',
    start: 'top 70%',
    end: 'bottom 30%',
    onToggle: (self) => {
      if (self.isActive) {
        dots.slice(0, 4).forEach((d) => d.el.classList.add('on'))
        idle = window.setInterval(breathe, 1300)
        if (!demoDone) {
          demoDone = true
          setTimeout(() => {
            const btns = chips.querySelectorAll('button')
            btns[Math.floor(Math.random() * btns.length)]?.classList.add('is-on')
            match()
          }, 900)
        }
      } else {
        clearInterval(idle)
      }
    },
  })
}

/* ═══════════ 03 · VERTUU SPY — the memory scene ═══════════ */

function initSpy(reducedMotion: boolean): void {
  const msg = $('#spyMsg')
  const msgText = $('#spyMsgText')
  const edited = $('#spyEdited')
  const deleted = $('#spyDeleted')
  const card = $('#spyCard')
  const chat = $('#spyChat')
  if (!msg || !msgText || !edited || !deleted || !card || !chat) return

  if (reducedMotion) {
    edited.classList.add('on')
    deleted.classList.add('on')
    card.classList.add('on')
    return
  }

  const reset = () => {
    msgText.textContent = t('spy.m1')
    msg.classList.remove('is-gone')
    edited.classList.remove('on')
    deleted.classList.remove('on')
    card.classList.remove('on')
    gsap.set(chat, { opacity: 1 })
  }

  const tl = gsap.timeline({ paused: true, repeat: -1 })
  tl.call(reset)
  tl.call(
    () => {
      gsap.fromTo(msgText, { opacity: 0.2 }, { opacity: 1, duration: 0.35 })
      msgText.textContent = t('spy.m2')
      edited.classList.add('on')
    },
    [],
    1.6,
  )
  tl.call(
    () => {
      msg.classList.add('is-gone')
      deleted.classList.add('on')
    },
    [],
    3.4,
  )
  tl.call(() => card.classList.add('on'), [], 4.3)
  tl.to(chat, { opacity: 0, duration: 0.6 }, 8.6)
  tl.to({}, { duration: 0.1 }, 9.2)

  ScrollTrigger.create({
    trigger: '#spy',
    start: 'top 65%',
    end: 'bottom 20%',
    onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
  })
}

/* ═══════════ 04 · NETHER TDM — bracket & pack ═══════════ */

function initTdm(reducedMotion: boolean): void {
  const bracket = document.getElementById('bracket')
  const pack = $('#tdmPack')

  if (bracket && !reducedMotion) {
    const paths = bracket.querySelectorAll<SVGPathElement>('path')
    paths.forEach((p) => {
      const len = p.getTotalLength()
      p.style.strokeDasharray = String(len)
      p.style.strokeDashoffset = String(len)
    })
    const dot = bracket.querySelector('.br-dot')
    if (dot) gsap.set(dot, { scale: 0, transformOrigin: 'center' })

    ScrollTrigger.create({
      trigger: bracket,
      start: 'top 78%',
      once: true,
      onEnter: () => {
        gsap.to(paths, {
          strokeDashoffset: 0,
          duration: 1.3,
          ease: 'power2.inOut',
          stagger: 0.07,
        })
        if (dot) gsap.to(dot, { scale: 1, duration: 0.5, delay: 1.4, ease: 'back.out(3)' })
      },
    })
  }

  if (pack) {
    const rx = gsap.quickTo(pack, 'rotationX', { duration: 0.5, ease: 'power2.out' })
    const ry = gsap.quickTo(pack, 'rotationY', { duration: 0.5, ease: 'power2.out' })
    gsap.set(pack, { transformPerspective: 700 })
    pack.addEventListener('pointermove', (e) => {
      const r = pack.getBoundingClientRect()
      rx(-((e.clientY - r.top) / r.height - 0.5) * 10)
      ry(((e.clientX - r.left) / r.width - 0.5) * 12)
    })
    pack.addEventListener('pointerleave', () => {
      rx(0)
      ry(0)
    })
  }
}

/* ═══════════ 05 · KPINDER — swipe physics ═══════════ */

function initKpinder(): void {
  const stack = $('#kpStack')
  if (!stack) return

  const layout = (animate = true) => {
    const cards = Array.from(stack.children) as HTMLElement[]
    cards.forEach((card, i) => {
      const depth = cards.length - 1 - i
      const props = { scale: 1 - depth * 0.045, y: depth * 12, x: 0, rotation: 0, opacity: 1 }
      if (animate) gsap.to(card, { ...props, duration: 0.5, ease: 'power3.out' })
      else gsap.set(card, props)
    })
  }
  layout(false)

  let active: HTMLElement | null = null
  let startX = 0
  let startY = 0

  const fly = (card: HTMLElement, dir: 1 | -1, dy = 0) => {
    gsap.to(card, {
      x: dir * Math.max(innerWidth * 0.6, 420),
      y: dy * 0.4,
      rotation: dir * 24,
      opacity: 0,
      duration: 0.55,
      ease: 'power2.in',
      onComplete: () => {
        stack.prepend(card)
        layout()
      },
    })
  }

  stack.addEventListener('pointerdown', (e) => {
    active = stack.lastElementChild as HTMLElement | null
    if (!active) return
    startX = e.clientX
    startY = e.clientY
    stack.setPointerCapture(e.pointerId)
  })

  stack.addEventListener('pointermove', (e) => {
    if (!active) return
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    gsap.set(active, { x: dx, y: dy * 0.35, rotation: dx * 0.055 })
  })

  const release = (e: PointerEvent) => {
    if (!active) return
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    if (Math.abs(dx) > 90) fly(active, dx > 0 ? 1 : -1, dy)
    else gsap.to(active, { x: 0, y: 0, rotation: 0, duration: 0.7, ease: 'elastic.out(1, 0.55)' })
    active = null
  }

  stack.addEventListener('pointerup', release)
  stack.addEventListener('pointercancel', release)

  $('#kpLike')?.addEventListener('click', () => {
    const top = stack.lastElementChild as HTMLElement | null
    if (top) fly(top, 1)
  })
  $('#kpNope')?.addEventListener('click', () => {
    const top = stack.lastElementChild as HTMLElement | null
    if (top) fly(top, -1)
  })
}

/* ═══════════ export ═══════════ */

export function initWorlds(reducedMotion: boolean): void {
  initMira()
  initGogo()
  initSpy(reducedMotion)
  initTdm(reducedMotion)
  initKpinder()
}
