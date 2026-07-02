/* ── bilingual dictionaries · UA is the authored default ── */

export type Lang = 'ua' | 'en'

type Entry = { ua: string; en: string }

export const STRINGS: Record<string, Entry> = {
  'pre.caption': { ua: 'завантаження всесвітів', en: 'loading universes' },

  'nav.cta': { ua: 'звʼязок', en: 'contact' },

  'rail.hero': { ua: 'вступ', en: 'intro' },
  'rail.clients': { ua: 'клієнти', en: 'clients' },
  'rail.about': { ua: 'про мене', en: 'about' },
  'rail.contact': { ua: 'звʼязок', en: 'contact' },

  'hero.over': { ua: 'Telegram-native продукти · Київ', en: 'Telegram-native products · Kyiv' },
  'hero.sub': {
    ua: 'Я будую світи всередині Telegram —<br>ботів і міні-застосунки, які відчуваються як магія.',
    en: 'I build worlds inside Telegram —<br>bots and mini apps that feel like magic.',
  },
  'hero.chip1': { ua: '30 000+ користувачів/міс — пік', en: '30,000+ users/mo at peak' },
  'hero.chip2': { ua: '9 живих світів', en: '9 living worlds' },
  'hero.scroll': { ua: 'скроль, щоб увійти', en: 'scroll to enter' },

  'mani.l1': { ua: 'Більшість бачить у Telegram просто месенджер.', en: 'Most people see Telegram as just a messenger.' },
  'mani.l2': { ua: 'Я бачу порожній всесвіт, який чекає на світи.', en: 'I see an empty universe waiting for worlds.' },
  'mani.l3': {
    ua: 'AI-містикиня, що читає карти. Радар живих зустрічей. Памʼять, якої не має сам Telegram. Арени, де грають за трофеї.',
    en: 'An AI mystic who reads the cards. A radar for real-life meetups. Memory Telegram itself doesn’t have. Arenas played for trophies.',
  },
  'mani.l4': { ua: 'Нижче — пʼять світів. Усі живі. Усі справжні.', en: 'Below are five worlds. All alive. All real.' },

  'stats.s1': { ua: 'світів запущено', en: 'worlds shipped' },
  'stats.s2': { ua: 'користувачів на місяць — пік', en: 'monthly users at peak' },
  'stats.s3': { ua: 'боти не сплять. я — іноді', en: 'bots never sleep. I do, sometimes' },

  'mira.kind': { ua: 'світ містики', en: 'the mystic world' },
  'mira.tag': {
    ua: 'AI-астрологиня і тарологиня, що говорить від першої особи',
    en: 'an AI astrologer & tarot reader who speaks in first person',
  },
  'mira.desc': {
    ua: 'Персонажний AI-продукт. Mira тягне карти Таро, розбирає натальні карти та щоденні транзити — і робить це з характером живої містикині, а не довідника. Три безкоштовні розклади щодня, реферальні бонуси, три мови.',
    en: 'A character-driven AI product. Mira pulls Tarot cards, reads birth charts and daily transits — with the personality of a living mystic, not a reference book. Three free readings a day, referral bonuses, three languages.',
  },
  'mira.c1': { ua: 'Таро-розклади', en: 'Tarot readings' },
  'mira.c2': { ua: 'Натальна карта', en: 'Birth chart' },
  'mira.c3': { ua: 'Щоденні транзити', en: 'Daily transits' },
  'mira.cta': { ua: 'відкрити @MiraAstroBot', en: 'open @MiraAstroBot' },
  'mira.hint': { ua: 'торкнись колоди — Mira витягне карту', en: 'touch the deck — Mira will draw a card' },

  'gogo.kind': { ua: 'світ міста', en: 'the city world' },
  'gogo.tag': { ua: 'знайди компанію на найближчі години', en: 'find company for the next few hours' },
  'gogo.desc': {
    ua: 'Анти-дейтинг. Кава, прогулянка, бар, кіно — обираєш активність, час і район Києва та знаходиш людей із такими самими планами прямо зараз. Метчі, запити, бейджі довіри й рейтинги — повноцінний Mini App, який я заснував і веду як продукт.',
    en: 'Anti-dating. Coffee, a walk, a bar, a movie — pick an activity, a time and a district of Kyiv, and find people with the same plans right now. Matches, requests, trust badges and ratings — a full Mini App I founded and run as a product.',
  },
  'gogo.c1': { ua: '12 активностей', en: '12 activities' },
  'gogo.c2': { ua: '10 районів Києва', en: '10 districts of Kyiv' },
  'gogo.c3': { ua: 'метчі та рейтинги', en: 'matches & ratings' },
  'gogo.c4': { ua: 'заснував і веду', en: 'founder-run' },
  'gogo.cta': { ua: 'відкрити @GoGoUaBot', en: 'open @GoGoUaBot' },
  'gogo.hint': { ua: 'обери, що робити сьогодні', en: 'pick what to do today' },
  'gogo.a1': { ua: 'Кава', en: 'Coffee' },
  'gogo.a2': { ua: 'Прогулянка', en: 'Walk' },
  'gogo.a3': { ua: 'Бар', en: 'Bar' },
  'gogo.a4': { ua: 'Кіно', en: 'Movie' },
  'gogo.a5': { ua: 'Настілки', en: 'Board games' },
  'gogo.match': { ua: 'метч! списуйтесь у Telegram', en: 'match! text each other on Telegram' },

  'spy.kind': { ua: 'світ памʼяті', en: 'the memory world' },
  'spy.tag': { ua: 'Telegram забуває. Цей бот — ні.', en: 'Telegram forgets. This bot doesn’t.' },
  'spy.desc': {
    ua: 'Інструмент для Telegram Business: зберігає копії відредагованих і видалених повідомлень — хто, коли, що було і що стало. Докази лишаються навіть тоді, коли співрозмовник передумав.',
    en: 'A Telegram Business tool: it keeps copies of edited and deleted messages — who, when, what it said and what it became. The receipts stay even when the other side changes their mind.',
  },
  'spy.c1': { ua: 'було → стало', en: 'before → after' },
  'spy.c2': { ua: 'збережені копії', en: 'saved copies' },
  'spy.c3': { ua: 'Telegram Business', en: 'Telegram Business' },
  'spy.cta': { ua: 'відкрити @vertuuSpyBot', en: 'open @vertuuSpyBot' },
  'spy.m1': { ua: 'скину гроші завтра, чесно 🤝', en: 'sending the money tomorrow, promise 🤝' },
  'spy.m1b': { ua: 'скину гроші завтра, чесно 🤝', en: 'sending the money tomorrow, promise 🤝' },
  'spy.m2': { ua: 'про які гроші мова? 🤔', en: 'what money are you talking about? 🤔' },
  'spy.edited': { ua: 'ред.', en: 'edited' },
  'spy.deleted': { ua: 'повідомлення видалено', en: 'message deleted' },
  'spy.saved': { ua: 'збережена копія', en: 'saved copy' },
  'spy.was': { ua: 'було:', en: 'was:' },
  'spy.became': { ua: 'стало:', en: 'became:' },
  'spy.then': { ua: 'потім:', en: 'then:' },
  'spy.gone': { ua: 'видалено · 23:49', en: 'deleted · 23:49' },

  'tdm.kind': { ua: 'світ арени', en: 'the arena world' },
  'tdm.tag': { ua: 'кіберспортивна екосистема PUBG Mobile TDM', en: 'a PUBG Mobile TDM esports ecosystem' },
  'tdm.desc': {
    ua: 'Три продукти — один світ. HUB: маркетплейс уроків, паків і налаштувань від перевірених гравців, з оплатою і доступами всередині Mini App. TOURS: турніри з сітками, призовими та заявками. SCHOOL: навчання гри. Побудовано навколо власного геймерського бренду NETHER.',
    en: 'Three products, one world. HUB: a marketplace of lessons, packs and settings from verified players, with payments and access inside a Mini App. TOURS: tournaments with brackets, prize pools and registrations. SCHOOL: training. Built around my own gaming brand, NETHER.',
  },
  'tdm.p1': { ua: 'маркетплейс паків та уроків', en: 'marketplace of packs & lessons' },
  'tdm.p2': { ua: 'турніри, сітки, призові', en: 'tournaments, brackets, prizes' },
  'tdm.p3': { ua: 'школа TDM-майстерності', en: 'a school of TDM mastery' },
  'tdm.pack': { ua: '100 порад від NETHER', en: '100 tips from NETHER' },
  'tdm.prize': { ua: 'призовий фонд', en: 'prize pool' },

  'kpinder.kind': { ua: 'світ кампусу', en: 'the campus world' },
  'kpinder.tag': { ua: 'Tinder для КПІ', en: 'Tinder for the KPI campus' },
  'kpinder.desc': {
    ua: 'Знайомства й соціальне життя найбільшого кампусу країни: профілі з факультетом, курсом і гуртожитком, свайпи, туси, івенти КПІ, live-статуси та рейтинги. Соцмережа, що живе повністю в Telegram.',
    en: 'Dating and social life for the country’s biggest campus: profiles with faculty, year and dorm, swipes, parties, KPI events, live statuses and ratings. A social network living entirely inside Telegram.',
  },
  'kpinder.c1': { ua: 'свайпи', en: 'swipes' },
  'kpinder.c2': { ua: 'туси й івенти', en: 'parties & events' },
  'kpinder.c3': { ua: 'live-статуси', en: 'live statuses' },
  'kpinder.c4': { ua: 'рейтинги', en: 'ratings' },
  'kpinder.cta': { ua: 'відкрити @KPInderBot', en: 'open @KPInderBot' },
  'kpinder.hint': { ua: 'тягни картку — як у справжньому', en: 'drag the card — like the real thing' },
  'kpinder.dorm': { ua: 'гуртожиток', en: 'dorm' },
  'kpinder.dorm2': { ua: 'гуртожиток', en: 'dorm' },
  'kpinder.dorm3': { ua: 'гуртожиток', en: 'dorm' },
  'kpinder.bio1': { ua: 'шукаю тімейта в дуо', en: 'looking for a duo teammate' },
  'kpinder.bio2': { ua: 'live: шукаю компанію в бібліотеку', en: 'live: library company wanted' },
  'kpinder.bio3': { ua: 'туса завтра, треба +1', en: 'party tomorrow, need a +1' },

  'clients.over': { ua: 'друга лінія', en: 'the second line' },
  'clients.title': { ua: 'Світи, збудовані на замовлення', en: 'Worlds built to order' },
  'clients.books': {
    ua: 'e-бібліотека: 3000+ книг українською, 4000+ англійською, 1000 аудіокниг · підписки та кабінет',
    en: 'an e-library: 3,000+ books in Ukrainian, 4,000+ in English, 1,000 audiobooks · subscriptions & account',
  },
  'clients.vertuu': {
    ua: 'хаб медійної екосистеми: канали, команда, анти-скам верифікація співробітників',
    en: 'a media ecosystem hub: channels, team, anti-scam staff verification',
  },
  'clients.badge': { ua: 'клієнт', en: 'client' },
  'clients.badge2': { ua: 'клієнт', en: 'client' },

  'about.kyiv': { ua: 'Київ', en: 'Kyiv' },
  'about.l1': {
    ua: 'Пишу код, проєктую продукти і вирощую спільноти — усе всередині Telegram.',
    en: 'I write code, design products and grow communities — all inside Telegram.',
  },
  'about.l2': {
    ua: 'Вірю в AI як у нову матерію продуктів і в українську мову як у стандарт, а не виняток.',
    en: 'I believe in AI as the new matter of products, and in Ukrainian as a standard, not an exception.',
  },
  'about.l3': {
    ua: 'Показав десяткам людей, що україномовний контент у геймінгу — працює.',
    en: 'I’ve shown dozens of people that Ukrainian-language gaming content works.',
  },
  'about.s1': { ua: 'AI-інженерія', en: 'AI engineering' },
  'about.s2': { ua: 'продукт', en: 'product' },
  'about.s3': { ua: 'дизайн', en: 'design' },
  'about.s4': { ua: 'боти', en: 'bots' },
  'about.s5': { ua: 'спільноти', en: 'community' },
  'about.s6': { ua: 'growth', en: 'growth' },

  'contact.over': { ua: 'є ідея світу?', en: 'got an idea for a world?' },
  'contact.title': { ua: 'Побудуймо<br>щось разом.', en: 'Let’s build<br>something.' },
  'contact.btn': { ua: 'написати @nether044', en: 'message @nether044' },
  'contact.channel': { ua: 'канал', en: 'channel' },

  'footer.made': { ua: 'Зроблено вручну в Києві. Жодного шаблону.', en: 'Handcrafted in Kyiv. Zero templates.' },

  'cursor.draw': { ua: 'тягни', en: 'draw' },
  'cursor.drag': { ua: 'свайп', en: 'swipe' },
}

/* tarot deck for the Mira interaction */
export const TAROT: { name: Entry; glyph: string; reading: Entry }[] = [
  {
    name: { ua: 'Зірка', en: 'The Star' },
    glyph: '✶',
    reading: { ua: '«надія і ясність — усе складеться»', en: '“hope and clarity — it will all come together”' },
  },
  {
    name: { ua: 'Місяць', en: 'The Moon' },
    glyph: '☽',
    reading: { ua: '«інтуїція сьогодні голосніша за логіку»', en: '“intuition speaks louder than logic today”' },
  },
  {
    name: { ua: 'Сонце', en: 'The Sun' },
    glyph: '☉',
    reading: { ua: '«день, коли все грає на тебе»', en: '“a day when everything plays for you”' },
  },
  {
    name: { ua: 'Маг', en: 'The Magician' },
    glyph: '∞',
    reading: { ua: '«усі інструменти вже в твоїх руках»', en: '“every tool is already in your hands”' },
  },
  {
    name: { ua: 'Колесо Фортуни', en: 'Wheel of Fortune' },
    glyph: '⊛',
    reading: { ua: '«поворот, на який ти чекав»', en: '“the turn you’ve been waiting for”' },
  },
  {
    name: { ua: 'Імператриця', en: 'The Empress' },
    glyph: '♛',
    reading: { ua: '«ріст, турбота і достаток»', en: '“growth, care and abundance”' },
  },
]

const KEY = 'nether-lang'

export function initialLang(): Lang {
  const saved = localStorage.getItem(KEY)
  if (saved === 'ua' || saved === 'en') return saved
  const nav = navigator.language.toLowerCase()
  return nav.startsWith('uk') || nav.startsWith('ru') ? 'ua' : 'en'
}

export let lang: Lang = 'ua'

export function t(key: string): string {
  const entry = STRINGS[key]
  return entry ? entry[lang] : key
}

export function applyLang(next: Lang): void {
  lang = next
  localStorage.setItem(KEY, next)
  document.documentElement.lang = next === 'ua' ? 'uk' : 'en'

  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n!
    const entry = STRINGS[key]
    if (!entry) return
    const value = entry[next]
    if (value.includes('<')) el.innerHTML = value
    else el.textContent = value
  })

  document.getElementById('langUA')?.classList.toggle('is-active', next === 'ua')
  document.getElementById('langEN')?.classList.toggle('is-active', next === 'en')

  window.dispatchEvent(new CustomEvent('nether:lang', { detail: next }))
}
