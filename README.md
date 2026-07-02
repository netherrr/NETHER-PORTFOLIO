# NETHER — worlds inside Telegram

A cinematic personal portfolio. One scroll, six atmospheres: an AI mystic, a city radar,
a memory keeper, an esports arena, a campus — every project is a world of its own,
with the WebGL nebula behind the page morphing color and shape as you cross the border.

**Live worlds:** [Mira](https://t.me/MiraAstroBot) · [GoGo](https://t.me/GoGoUaBot) ·
[VERTUU SPY](https://t.me/vertuuSpyBot) · [TDM HUB](https://t.me/TDMHUBBOT) ·
[TDM TOURS](https://t.me/NetherTdmBot) · [TDM SCHOOL](https://t.me/TDMSCHOOLBOT) ·
[KPInder](https://t.me/KPInderBot)

## Stack

- **Vite + TypeScript** — no framework, nothing between the code and the pixels
- **Raw WebGL** — a 12 500-particle nebula in one shader program (~4 KB, zero deps),
  with adaptive quality, software-rasterizer detection and a graceful CSS fallback
- **GSAP + ScrollTrigger** — scroll choreography, world gates, word-by-word manifesto
- **Lenis** — inertial smooth scrolling
- **Self-hosted variable fonts** — Unbounded · Inter · JetBrains Mono · Playfair Display,
  latin + cyrillic subsets, `font-display: swap`
- **i18n** — full UA / EN toggle at runtime, remembered in `localStorage`

## Performance

Lighthouse (built preview): **99 desktop / 85 mobile** performance,
**100 accessibility · 100 best practices · 100 SEO**. Total JS ≈ 63 KB gzip.
`prefers-reduced-motion` is fully respected — the site works without a single animation.

## Develop

```bash
npm install
npm run dev       # dev server
npm run build     # type-check + production build to dist/
npm run preview   # serve the build
```

Append `?forcegl` to the URL to force the nebula on software rasterizers (testing only).

## Deploy

Pushing to `main` publishes `dist/` to GitHub Pages via `.github/workflows/deploy.yml`
(enable **Settings → Pages → Source: GitHub Actions** once). The build uses relative
asset paths (`base: './'`), so it works from any subpath or custom domain.

---

Handcrafted in Kyiv. Zero templates. © 2026 NETHER
