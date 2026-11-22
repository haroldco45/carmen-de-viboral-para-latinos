/* =========================================================
   El Carmen de Viboral para Latinos — Vibras Positivas HM
   PWA bilingüe (ES/EN) para latinos recién llegados a El Carmen de Viboral, Oriente antioqueño, Colombia.
   Sin emojis ni íconos: fotos reales de Wikipedia / Wikimedia Commons y de Cerámicas Creare.
   ========================================================= */
'use strict';

/* ---------- Utilidades ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
const store = {
  get(k, d) { try { const v = localStorage.getItem('cdv_' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('cdv_' + k, JSON.stringify(v)); } catch (e) {} }
};
let LANG = store.get('lang', (navigator.language || 'es').slice(0, 2) === 'en' ? 'en' : 'es');
const L = o => (o == null ? '' : typeof o === 'string' ? o : (o[LANG] ?? o.es ?? ''));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = (n, d = 2) => new Intl.NumberFormat(LANG === 'es' ? 'es-CO' : 'en-US', { minimumFractionDigits: d, maximumFractionDigits: d }).format(n);
const cop = n => (n < 0 ? '-$' : '$') + fmt(Math.abs(Math.round(n)), 0);
async function getJSON(url) { const r = await fetch(url); if (!r.ok) throw new Error(r.status); return r.json(); }
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('on'), 2400); }
const gmaps = q => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
const ZONE = 'America/Bogota', ZONE_VE = 'America/Caracas';
const PALETTE = ['#0E7C86', '#F2B705', '#E8566C', '#2D7FF9', '#F28C28', '#2FB59A', '#8E5CD9'];
const num = (b, i) => `<b style="color:var(--red);font-family:'Barlow Condensed';font-size:1.3rem;margin-right:8px">${String(i + 1).padStart(2, '0')}</b>${b}`;
const CITY = 'El Carmen de Viboral, Antioquia, Colombia';


/* ---------- Textos de interfaz ---------- */
const T = {
  appName: { es: 'El Carmen de Viboral para Latinos', en: 'El Carmen de Viboral for Latinos' },
  tagline: { es: 'Tu guía para empezar en El Carmen de Viboral', en: 'Your guide to starting out in El Carmen de Viboral' },
  nHome: { es: 'Inicio', en: 'Home' }, nPapers: { es: 'Papeles', en: 'Papers' }, nMap: { es: 'Mapa', en: 'Map' }, nTalk: { es: 'Hablar', en: 'Talk' },
  cxT: { es: 'Otras ciudades para latinos', en: 'More cities for Latinos' },
  cxS: { es: 'La misma guía en otras ciudades del mundo. Toca una para abrirla.', en: 'The same guide in other cities around the world. Tap one to open it.' },
  footNote: {
    es: 'Información de referencia, no es asesoría legal. Verifica trámites en migracioncolombia.gov.co y cancilleria.gov.co, y la agenda del municipio en elcarmendeviboral-antioquia.gov.co. Mapa © colaboradores de OpenStreetMap, © CARTO. Fotos: Wikipedia / Wikimedia Commons y Cerámicas Creare. Clima: Open-Meteo.',
    en: 'Reference information, not legal advice. Check procedures at migracioncolombia.gov.co and cancilleria.gov.co, and the town calendar at elcarmendeviboral-antioquia.gov.co. Map © OpenStreetMap contributors, © CARTO. Photos: Wikipedia / Wikimedia Commons and Cerámicas Creare. Weather: Open-Meteo.'
  },
  updated: { es: 'Información verificada', en: 'Information checked' },
  installT: { es: 'Instala la app en tu celular para usarla sin internet.', en: 'Install the app on your phone to use it offline.' },
  install: { es: 'Instalar', en: 'Install' },
  tapClose: { es: '(Toca para cerrar)', en: '(Tap to close)' },
  back: { es: '‹ Volver al inicio', en: '‹ Back to home' }
};
const VERIFIED = '22 nov 2026';

/* ---------- Fotos reales (Wikipedia / Commons) ---------- */
// key: [título en en.wikipedia, búsquedas de respaldo en Commons en orden]
const PH = {
  carmen: ['El Carmen de Viboral', 'El Carmen de Viboral Antioquia'],
  parque: ['', 'El Carmen de Viboral parque principal', 'El Carmen de Viboral plaza', 'El Carmen de Viboral'],
  iglesia: ['', 'Iglesia Nuestra Señora del Carmen El Carmen de Viboral', 'El Carmen de Viboral iglesia', 'El Carmen de Viboral templo'],
  calle: ['', 'Calle de la Ceramica El Carmen de Viboral', 'El Carmen de Viboral calle ceramica', 'El Carmen de Viboral fachada'],
  loza: ['', 'ceramica El Carmen de Viboral', 'El Carmen de Viboral ceramica pintada', 'Carmen de Viboral ceramics', 'hand painted pottery Colombia'],
  taller: ['', 'torno alfarero', 'pottery wheel throwing', 'potter wheel'],
  museo: ['', 'Museo de la Ceramica El Carmen de Viboral', 'El Carmen de Viboral museo', 'ceramics museum pottery display'],
  melcocho: ['', 'Rio Melcocho', 'Rio Melcocho Antioquia', 'Melcocho river', 'Rio Dormilon San Luis Antioquia'],
  santodomingo: ['', 'Rio Santo Domingo Antioquia', 'Cocorna Antioquia rio', 'Rio Cocorna'],
  guatape: ['Guatapé', 'Guatape zocalos'],
  penol: ['El Peñón de Guatapé', 'Piedra del Peñol'],
  rionegro: ['Rionegro, Antioquia', 'Rionegro Antioquia'],
  laceja: ['La Ceja', 'La Ceja Antioquia'],
  airport: ['José María Córdova International Airport', 'aeropuerto Jose Maria Cordova Rionegro'],
  chorizo: ['', 'chorizo antioqueño arepa', 'chorizo con arepa', 'chorizo Colombia'],
  bandeja: ['Bandeja paisa', 'bandeja paisa'],
  arepa: ['Arepa', 'arepa antioqueña'],
  hortensia: ['Hydrangea macrophylla', 'hortensias'],
  flores: ['', 'cultivo de flores Antioquia', 'flores invernadero Colombia', 'flower greenhouse Colombia'],
  campo: ['', 'Oriente Antioqueño paisaje', 'Antioquia montañas campo', 'Antioquia countryside'],
  trova: ['', 'trova paisa', 'guitarra tiple Colombia', 'guitarrista serenata'],
  cabalgata: ['', 'cabalgata Antioquia', 'cabalgata Colombia', 'Paso Fino'],
  teatro: ['', 'teatro de calle festival', 'street theatre festival', 'teatro al aire libre'],
  velitas: ['', 'Noche de las Velitas', 'velitas 7 de diciembre Colombia', 'velas en la calle diciembre'],
  bus: ['', 'bus intermunicipal Antioquia', 'Terminal del Norte Medellin', 'bus Antioquia carretera'],
  metro: ['Medellín Metro', 'Metro de Medellin'],
  hospital: ['', 'hospital San Juan de Dios El Carmen de Viboral', 'hospital Antioquia', 'hospital Colombia'],
  peso: ['Colombian peso', 'billetes pesos colombianos'],
  neblina: ['', 'neblina montaña Antioquia', 'Antioquia niebla montaña', 'fog mountains Colombia'],
  street: ['', 'El Carmen de Viboral calle', 'Antioquia pueblo calle', 'Marinilla calle'],
  house: ['', 'casa antioqueña balcones', 'arquitectura antioqueña', 'Antioquia casa colonial balcon']
};
// Fotos reales propias (Cerámicas Creare, El Carmen de Viboral). No dependen de Wikipedia.
const FIXED_PH = { creare: 'img/creare-finca.jpg', pintura: 'img/creare-plato.jpg', plato: 'img/creare-plato2.jpg' };

const PHOTO_CACHE = Object.assign(store.get('photos5', {}), FIXED_PH);
function fbColor(key) { let h = 0; for (const c of key) h = (h * 31 + c.charCodeAt(0)) >>> 0; return PALETTE[h % PALETTE.length]; }
const photo = key => `data-ph="${key}" style="--fb:${fbColor(key)}"`;

async function wikiBatch(titles) {
  const out = {};
  for (let i = 0; i < titles.length; i += 40) {
    const chunk = titles.slice(i, i + 40);
    const url = 'https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&origin=*&redirects=1&prop=pageimages&piprop=thumbnail&pithumbsize=900&titles=' + encodeURIComponent(chunk.join('|'));
    try {
      const j = await getJSON(url);
      const back = {};
      (j.query.normalized || []).forEach(n => back[n.to] = n.from);
      (j.query.redirects || []).forEach(r => back[r.to] = back[r.from] || r.from);
      (j.query.pages || []).forEach(p => { if (p.thumbnail) out[back[p.title] || p.title] = p.thumbnail.source; });
    } catch (e) {}
  }
  return out;
}
async function commonsSearch(q) {
  const url = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&formatversion=2&origin=*&generator=search&gsrnamespace=6&gsrlimit=4&gsrsearch=' + encodeURIComponent(q + ' filetype:bitmap') + '&prop=imageinfo&iiprop=url&iiurlwidth=900';
  try {
    const j = await getJSON(url);
    const pages = (j.query && j.query.pages || []).sort((a, b) => (a.index || 0) - (b.index || 0));
    for (const p of pages) { const ii = p.imageinfo && p.imageinfo[0]; if (ii && (ii.thumburl || ii.url)) return ii.thumburl || ii.url; }
  } catch (e) {}
  return null;
}
let photosLoading = null;
async function loadPhotos() {
  if (photosLoading) return photosLoading;
  photosLoading = (async () => {
    const need = Object.keys(PH).filter(k => !PHOTO_CACHE[k]);
    const titles = need.map(k => PH[k][0]).filter(Boolean);
    if (titles.length) {
      const got = await wikiBatch(titles);
      need.forEach(k => { if (PH[k][0] && got[PH[k][0]]) PHOTO_CACHE[k] = got[PH[k][0]]; });
    }
    const rest = Object.keys(PH).filter(k => !PHOTO_CACHE[k]);
    const firsts = rest.filter(k => PH[k].length <= 2), multi = rest.filter(k => PH[k].length > 2);
    await Promise.all(firsts.map(async k => { const u = await commonsSearch(PH[k][1]); if (u) PHOTO_CACHE[k] = u; }));
    for (const k of multi) {
      for (const q of PH[k].slice(1)) {
        const u = await commonsSearch(q);
        if (u && !Object.values(PHOTO_CACHE).includes(u)) { PHOTO_CACHE[k] = u; break; }
      }
    }
    store.set('photos5', PHOTO_CACHE); Object.assign(PHOTO_CACHE, FIXED_PH);
  })();
  return photosLoading;
}
function paintPhotos(root = document) {
  $$('[data-ph]', root).forEach(el => {
    const u = PHOTO_CACHE[el.dataset.ph];
    if (u && !el._painted) {
      const img = new Image();
      img.onload = () => { el.style.backgroundImage = `url("${u}")`; el._painted = true; };
      img.src = u;
    }
  });
  heroSetup();
}

/* ---------- Plazos con cuenta regresiva (verificados el 22 nov 2026) ---------- */
const DEADLINES = [
  { end: new Date('2026-12-31T23:59:59-05:00'), k: 'PEP Tutor',
    t: { es: 'PEP Tutor: puedes pedirlo hasta el jueves 31 de diciembre', en: 'PEP Tutor: apply by Thursday 31 December' },
    s: { es: 'Para papás, tutores o cuidadores de niños venezolanos que tuvieron PPT. Medellín es una de las 10 ciudades del trámite: queda a cerca de una hora de El Carmen. Toca para ver requisitos.', en: 'For parents, guardians or carers of Venezuelan children who held a PPT. Medellín is one of the 10 processing cities, about an hour from El Carmen. Tap to see requirements.' },
    tk: { es: 'para pedir el PEP Tutor', en: 'to apply for PEP Tutor' } }
];
const activeDeadline = () => DEADLINES.find(d => d.end - Date.now() > 0) || null;

/* ---------- Datos de El Carmen de Viboral ---------- */
// q: búsqueda para "Cómo llegar" (más precisa que las coordenadas aproximadas)
const PLACES = [
  { id: 'calle', cat: 'city', lat: 6.0812, lon: -75.3356, free: true, q: 'Calle de la Cerámica, El Carmen de Viboral',
    n: { es: 'Calle de la Cerámica', en: 'Ceramics Street' },
    d: { es: 'La calle peatonal con fachadas, bancas y pisos decorados con cerámica pintada a mano. Sale del parque principal y está llena de almacenes de loza. Gratis. Tiene su sección en la app.', en: 'The pedestrian street whose façades, benches and paving are decorated with hand-painted ceramics. It starts at the main square and is lined with pottery shops. Free. It has its own section in the app.' } },
  { id: 'parque', cat: 'city', lat: 6.0827, lon: -75.3352, free: true, q: 'Parque Principal, El Carmen de Viboral',
    n: { es: 'Parque principal e iglesia', en: 'Main square & church' },
    d: { es: 'El corazón del pueblo: la iglesia de Nuestra Señora del Carmen, cafés, heladerías y la tarima donde pasan las Fiestas de la Loza.', en: 'The heart of town: the church of Our Lady of Carmen, cafés, ice-cream parlours and the stage for the Fiestas de la Loza.' } },
  { id: 'museo', cat: 'city', lat: 6.0822, lon: -75.3362, free: true, q: 'Museo de la Cerámica, El Carmen de Viboral',
    n: { es: 'Museo de la Cerámica', en: 'Ceramics Museum' },
    d: { es: 'Cuenta más de cien años de loza carmelitana, desde que en 1898 llegó la primera locería al pueblo. Confirma horario y valor antes de ir.', en: 'Tells over a hundred years of local pottery, since the first pottery works arrived in town in 1898. Check opening hours and price before going.' } },
  { id: 'creare', cat: 'city', lat: 6.0711966, lon: -75.3297416, free: false, q: '6.0711966,-75.3297416',
    n: { es: 'Cerámicas Creare — experiencias en cerámica', en: 'Cerámicas Creare — pottery experiences' },
    d: { es: 'Finca a las afueras del pueblo donde pintas tu propia taza o plato y te lo llevas horneado. Reserva por WhatsApp; tiene su propia app.', en: 'A farm on the edge of town where you paint your own mug or plate and take it home fired. Book on WhatsApp; it has its own app.' } },
  { id: 'chorizo', cat: 'city', lat: 6.0815, lon: -75.3350, free: false, q: 'Cafetería La Especial, El Carmen de Viboral',
    n: { es: 'Chorizos de punta en La Especial', en: 'Chorizo de punta at La Especial' },
    d: { es: 'La parada obligada de quienes visitan El Carmen: chorizo de punta con arepa, al final de la Calle de la Cerámica.', en: 'The must-stop for visitors to El Carmen: chorizo de punta with arepa, at the end of Ceramics Street.' } },
  { id: 'melcocho', cat: 'nature', lat: 5.9450, lon: -75.1900, free: false, q: 'Cañón del río Melcocho, El Carmen de Viboral',
    n: { es: 'Cañón del río Melcocho', en: 'Melcocho River canyon' },
    d: { es: 'Uno de los ríos más cristalinos de Antioquia. Para entrar es obligatorio reservar antes con el Centro de Atención Integral del Cañón (CAICA). Tiene su sección en "Ríos y cañones".', en: 'One of Antioquia\'s clearest rivers. Booking in advance with the canyon\'s visitor centre (CAICA) is mandatory. See "Rivers & canyons".' } },
  { id: 'santodomingo', cat: 'nature', lat: 5.9700, lon: -75.1500, free: true, q: 'Cañón del río Santo Domingo, El Carmen de Viboral',
    n: { es: 'Cañón del río Santo Domingo', en: 'Santo Domingo River canyon' },
    d: { es: 'El otro gran cañón del municipio, con veredas campesinas, charcos y caminos de herradura. Ve con guía local.', en: 'The town\'s other big canyon, with farming villages, swimming holes and mule trails. Go with a local guide.' } },
  { id: 'rionegro', cat: 'nature', lat: 6.1550, lon: -75.3740, free: true, q: 'Parque principal de Rionegro, Antioquia',
    n: { es: 'Rionegro', en: 'Rionegro' },
    d: { es: 'La ciudad grande vecina, a unos 20 minutos: centros comerciales, clínicas, bancos, oficinas y el aeropuerto internacional.', en: 'The big neighbouring city, about 20 minutes away: malls, clinics, banks, offices and the international airport.' } },
  { id: 'laceja', cat: 'nature', lat: 6.0310, lon: -75.4320, free: true, q: 'Parque principal La Ceja, Antioquia',
    n: { es: 'La Ceja', en: 'La Ceja' },
    d: { es: 'Pueblo vecino de flores y fincas, con un parque principal muy animado.', en: 'Neighbouring town of flower farms, with a lively main square.' } },
  { id: 'guatape', cat: 'nature', lat: 6.2333, lon: -75.1583, free: true, q: 'Guatapé, Antioquia',
    n: { es: 'Guatapé y la Piedra del Peñol', en: 'Guatapé & El Peñol rock' },
    d: { es: 'El paseo de un día más famoso del Oriente: el pueblo de los zócalos de colores y la gran piedra de 700 escalones. La subida a la piedra tiene costo.', en: 'The Oriente\'s most famous day trip: the town of colourful zócalos and the huge 700-step rock. Climbing the rock costs money.' } }
];

const MAP_EXTRA = [
  { id: 'hospital', cat: 'help', lat: 6.0790, lon: -75.3385, q: 'ESE Hospital San Juan de Dios, Carrera 31 # 19-58, El Carmen de Viboral', n: { es: 'Hospital San Juan de Dios', en: 'San Juan de Dios Hospital' }, d: { es: 'El hospital público del municipio, con urgencias. Carrera 31 # 19-58, barrio Ospina.', en: 'The town\'s public hospital, with an ER. Carrera 31 # 19-58, Ospina neighbourhood.' } },
  { id: 'hosprio', cat: 'help', lat: 6.1500, lon: -75.3760, q: 'ESE Hospital San Juan de Dios de Rionegro', n: { es: 'Hospital San Juan de Dios de Rionegro', en: 'San Juan de Dios Hospital, Rionegro' }, d: { es: 'Hospital público de la ciudad vecina, con urgencias más grandes.', en: 'Public hospital in the neighbouring city, with a larger ER.' } },
  { id: 'migra', cat: 'help', lat: 6.2310, lon: -75.6020, q: 'Migración Colombia Calle 19 # 80A-40, Belén, Medellín', n: { es: 'Migración Colombia — Centro Facilitador Medellín', en: 'Migración Colombia — Medellín Service Centre' }, d: { es: 'Calle 19 # 80A-40, barrio Belén, Medellín. Todo con cita previa en línea.', en: 'Calle 19 # 80A-40, Belén, Medellín. Everything by online appointment.' } },
  { id: 'terminal', cat: 'help', lat: 6.0830, lon: -75.3330, q: 'Terminal Flota El Carmen, El Carmen de Viboral', n: { es: 'Terminal de Flota El Carmen', en: 'Flota El Carmen bus station' }, d: { es: 'Buses a Medellín (Terminal del Norte y estación Exposiciones del Metro). Se puede pagar con la tarjeta Cívica.', en: 'Buses to Medellín (North Terminal and Exposiciones Metro station). You can pay with the Cívica card.' } },
  { id: 'airport', cat: 'help', lat: 6.1645, lon: -75.4231, q: 'Aeropuerto Internacional José María Córdova, Rionegro', n: { es: 'Aeropuerto José María Córdova', en: 'José María Córdova Airport' }, d: { es: 'El aeropuerto internacional de Medellín queda en Rionegro, muy cerca de El Carmen.', en: 'Medellín\'s international airport is in Rionegro, very close to El Carmen.' } }
];

const OFFICES = [
  { n: { es: 'Migración Colombia — Centro Facilitador de Servicios Migratorios Medellín', en: 'Migración Colombia — Medellín Immigration Service Centre' }, a: 'Calle 19 # 80A-40, Belén, Medellín', tel: '+576016055454', telS: '+57 601 605 5454', h: { es: 'El más cercano a El Carmen. Todos los trámites van con cita previa en migracioncolombia.gov.co; es uno de los centros con más demanda del país, así que agenda con tiempo.', en: 'The nearest to El Carmen. All procedures need an online appointment at migracioncolombia.gov.co; it\'s one of the busiest centres in the country, so book early.' } },
  { n: { es: 'Cancillería de Colombia (visas, incluida la Visa V)', en: 'Colombian Foreign Ministry (visas, including Visa V)' }, a: 'Cancillería de Colombia, Bogotá', tel: '+576013814000', telS: '+57 601 381 4000', h: { es: 'Las visas se piden en línea en cancilleria.gov.co', en: 'Visas are applied for online at cancilleria.gov.co' } },
  { n: { es: 'Personería de El Carmen de Viboral (defensa de tus derechos)', en: 'El Carmen de Viboral Ombudsman\'s Office (Personería)' }, a: 'Personería Municipal de El Carmen de Viboral', tel: '', telS: '', h: { es: 'Atiende gratis a cualquier persona, con o sin papeles: quejas, tutelas y orientación cuando te niegan un derecho.', en: 'Free help for anyone, with or without papers: complaints, tutela actions and advice when a right is denied to you.' } }
];

const EMERG = [
  { n: '123', cls: '', t: { es: 'Línea única de emergencias', en: 'Emergency line' }, s: { es: 'Policía, ambulancia, bomberos', en: 'Police, ambulance, fire' } },
  { n: '132', cls: 'ink', t: { es: 'Cruz Roja', en: 'Red Cross' }, s: { es: 'Ambulancia y rescate', en: 'Ambulance and rescue' } },
  { n: '119', cls: 'sea', t: { es: 'Bomberos', en: 'Fire brigade' }, s: { es: 'Incendios, rescates y crecientes', en: 'Fires, rescues and flash floods' } },
  { n: '155', cls: 'sky', t: { es: 'Línea para mujeres', en: 'Women\'s line' }, s: { es: 'Orientación ante violencia', en: 'Help against violence' } },
  { n: '141', cls: 'ink', t: { es: 'ICBF (niños)', en: 'ICBF (children)' }, s: { es: 'Protección de niños y niñas', en: 'Child protection' } },
  { n: '165', cls: 'sea', t: { es: 'Gaula', en: 'Gaula' }, s: { es: 'Extorsión y secuestro', en: 'Extortion and kidnapping' } }
];

// Festivos de Colombia 2026 y 2027 (Ley Emiliani).
const HOLIDAYS = [
  ['2026-01-01', { es: 'Año Nuevo', en: 'New Year\'s Day' }], ['2026-01-12', { es: 'Reyes Magos', en: 'Epiphany' }],
  ['2026-03-23', { es: 'San José', en: 'Saint Joseph' }], ['2026-04-02', { es: 'Jueves Santo', en: 'Holy Thursday' }],
  ['2026-04-03', { es: 'Viernes Santo', en: 'Good Friday' }], ['2026-05-01', { es: 'Día del Trabajo', en: 'Labour Day' }],
  ['2026-05-18', { es: 'Ascensión', en: 'Ascension' }], ['2026-06-08', { es: 'Corpus Christi', en: 'Corpus Christi' }],
  ['2026-06-15', { es: 'Sagrado Corazón', en: 'Sacred Heart' }], ['2026-06-29', { es: 'San Pedro y San Pablo', en: 'Saints Peter and Paul' }],
  ['2026-07-20', { es: 'Independencia de Colombia', en: 'Colombian Independence' }], ['2026-08-07', { es: 'Batalla de Boyacá', en: 'Battle of Boyacá' }],
  ['2026-08-17', { es: 'Asunción de la Virgen', en: 'Assumption' }], ['2026-10-12', { es: 'Día de la Raza', en: 'Columbus Day' }],
  ['2026-11-02', { es: 'Todos los Santos', en: 'All Saints\' Day' }], ['2026-11-16', { es: 'Independencia de Cartagena', en: 'Cartagena Independence' }],
  ['2026-12-08', { es: 'Inmaculada Concepción', en: 'Immaculate Conception' }], ['2026-12-25', { es: 'Navidad', en: 'Christmas Day' }],
  ['2027-01-01', { es: 'Año Nuevo', en: 'New Year\'s Day' }], ['2027-01-11', { es: 'Reyes Magos', en: 'Epiphany' }],
  ['2027-03-22', { es: 'San José', en: 'Saint Joseph' }], ['2027-03-25', { es: 'Jueves Santo', en: 'Holy Thursday' }],
  ['2027-03-26', { es: 'Viernes Santo', en: 'Good Friday' }], ['2027-05-01', { es: 'Día del Trabajo', en: 'Labour Day' }],
  ['2027-05-10', { es: 'Ascensión', en: 'Ascension' }], ['2027-05-31', { es: 'Corpus Christi', en: 'Corpus Christi' }],
  ['2027-06-07', { es: 'Sagrado Corazón', en: 'Sacred Heart' }], ['2027-07-05', { es: 'San Pedro y San Pablo', en: 'Saints Peter and Paul' }],
  ['2027-07-20', { es: 'Independencia de Colombia', en: 'Colombian Independence' }], ['2027-08-07', { es: 'Batalla de Boyacá', en: 'Battle of Boyacá' }],
  ['2027-08-16', { es: 'Asunción de la Virgen', en: 'Assumption' }], ['2027-10-18', { es: 'Día de la Raza', en: 'Columbus Day' }],
  ['2027-11-01', { es: 'Todos los Santos', en: 'All Saints\' Day' }], ['2027-11-15', { es: 'Independencia de Cartagena', en: 'Cartagena Independence' }],
  ['2027-12-08', { es: 'Inmaculada Concepción', en: 'Immaculate Conception' }], ['2027-12-25', { es: 'Navidad', en: 'Christmas Day' }]
];

// Salario mínimo 2026: $1.750.905 (Decreto 0159 de 2026, transitorio, que reemplazó al Decreto 1469 de 2025; MinTrabajo confirma que sigue vigente).
// Auxilio de transporte 2026: $249.095. Jornada de 42 horas semanales desde el 15 de julio de 2026 (Ley 2101): hora = salario / 210.
const WAGE = { month: 1750905, aux: 249095, total: 2000000, hour: 1750905 / 210, weekH: 42,
  night: .35, extraDay: .25, extraNight: .75, sunday: .90 };

// Agenda de El Carmen de Viboral (revisada el 22 nov 2026). Cuarto valor: texto de fecha cuando aún no está confirmada.
const FIESTAS = [
  ['2026-12-03', { es: '52.ª Fiestas de la Loza', en: '52nd Fiestas de la Loza (Pottery Festival)' }, { es: 'Parque principal y Calle de la Cerámica', en: 'Main square and Ceramics Street' }, { es: 'Principios de diciembre de 2026 · fechas por confirmar (en 2025 fueron del 4 al 8)', en: 'Early December 2026 · dates TBC (in 2025 they ran 4–8 Dec)' }],
  ['2026-12-07', { es: 'Noche de Velitas', en: 'Little Candles Night' }, { es: 'Calles y barrios del pueblo', en: 'Streets and neighbourhoods across town' }],
  ['2026-12-16', { es: 'Novenas de aguinaldos', en: 'Christmas novenas' }, { es: 'Casas, barrios y parroquia (16 al 24 de diciembre)', en: 'Homes, neighbourhoods and the parish (16–24 December)' }],
  ['2026-12-31', { es: 'Fin de año', en: 'New Year\'s Eve' }, { es: 'El Carmen de Viboral', en: 'El Carmen de Viboral' }],
  ['2027-06-05', { es: 'Fiestas del Campesino', en: 'Farmers\' Festival' }, { es: 'Parque principal y veredas', en: 'Main square and rural villages' }, { es: 'Junio de 2027 · fechas por confirmar', en: 'June 2027 · dates TBC' }],
  ['2027-07-17', { es: 'Festival Internacional de Teatro El Gesto Noble', en: 'El Gesto Noble International Theatre Festival' }, { es: 'Calles, parque y salas del pueblo', en: 'Streets, square and venues in town' }, { es: 'Julio de 2027 · fechas por confirmar', en: 'July 2027 · dates TBC' }]
];

const FIRST = [
  { es: ['Llena el formulario Check-MIG antes de viajar', 'Lo piden a los extranjeros al entrar y salir de Colombia. Es gratis en el sitio de Migración Colombia.'], en: ['Fill in the Check-MIG form before travelling', 'Foreigners must complete it when entering and leaving Colombia. It\'s free on Migración Colombia\'s site.'] },
  { es: ['Guarda tus documentos y una foto de cada uno', 'Pasaporte, cédula, PPT. Copias en el celular y en el correo. Nunca entregues tu documento a un "jefe".'], en: ['Keep your documents safe and a photo of each', 'Passport, ID, PPT. Copies on your phone and email. Never hand your document to a "boss".'] },
  { es: ['Compra una SIM local', 'Los operadores grandes son Claro, Movistar y Tigo. Para registrarla te piden documento.'], en: ['Get a local SIM', 'The big carriers are Claro, Movistar and Tigo. You\'ll need ID to register it.'] },
  { es: ['Anota tu dirección en esta app', 'Las direcciones son tipo "Carrera 30 # 31-20". Si vives en una vereda, guarda también el nombre de la vereda y un punto de referencia.'], en: ['Save your address in this app', 'Addresses look like "Carrera 30 # 31-20". If you live in a rural vereda, also save its name and a landmark.'] },
  { es: ['Saca la tarjeta Cívica', 'Con ella pagas el Metro de Medellín y también el bus de Flota El Carmen entre el pueblo y Medellín.'], en: ['Get a Cívica card', 'It pays for the Medellín Metro and also for the Flota El Carmen bus between town and Medellín.'] },
  { es: ['Consigue ropa abrigada', 'El Carmen está en el altiplano del Oriente: las noches y madrugadas son frías y llueve seguido. Chaqueta, saco y paraguas.'], en: ['Get warm clothes', 'El Carmen sits on the Oriente highlands: nights and early mornings are cold and it rains often. Jacket, jumper and umbrella.'] },
  { es: ['Pide la encuesta del SISBEN', 'Con PPT o documento colombiano te pueden afiliar a salud subsidiada.'], en: ['Request the SISBEN survey', 'With a PPT or Colombian ID you can join subsidised health care.'] },
  { es: ['Busca orientación gratis', 'La Personería del municipio atiende a cualquier persona, con o sin papeles.'], en: ['Get free guidance', 'The town\'s Personería helps anyone, with or without papers.'] },
  { es: ['Abre una billetera digital o cuenta', 'Nequi, Daviplata y los bancos abren cuentas con PPT. Así cobras sin cargar efectivo.'], en: ['Open a digital wallet or account', 'Nequi, Daviplata and banks open accounts with a PPT. That way you get paid without carrying cash.'] },
  { es: ['Registra los números de emergencia', '123 para todo: policía, ambulancia y bomberos.'], en: ['Save the emergency numbers', '123 for everything: police, ambulance and fire.'] }
];

// Hablar paisa (Oriente antioqueño): [palabra, significado ES, significado EN, ejemplo]
const COSTENO = [
  ['¿Qué más pues?', 'Saludo: ¿cómo estás?', 'Greeting: how are you?', '¿Qué más pues, parce? ¿Todo bien?'],
  ['Pues', 'Muletilla paisa al final de casi todo', 'The paisa filler word at the end of almost everything', 'Hágale pues, nos vemos mañana.'],
  ['Parce / Parcero', 'Amigo, compañero', 'Buddy, mate', 'Ese parcero trabaja conmigo en el taller.'],
  ['¡Ave María!', 'Exclamación de sorpresa', 'Exclamation of surprise', '¡Ave María, qué frío el que está haciendo!'],
  ['Hágale', 'Dale, de acuerdo, empiece', 'Go ahead, OK, let\'s go', '—¿Le pinto esta taza? —Hágale.'],
  ['Mijo / Mija', 'Forma cariñosa de llamar a alguien', 'Affectionate way to address someone', 'Venga, mija, siéntese.'],
  ['Carmelitano(a)', 'La gente de El Carmen de Viboral', 'People from El Carmen de Viboral', 'Los carmelitanos son muy amables.'],
  ['La loza', 'La cerámica: platos, tazas y pocillos', 'Pottery: plates, mugs and cups', 'Me compré una loza pintada a mano.'],
  ['Pocillo', 'Taza para el café o el chocolate', 'Mug for coffee or hot chocolate', 'Regáleme el tinto en un pocillo de El Carmen.'],
  ['Vereda', 'Zona rural del municipio', 'Rural area of the municipality', 'Vivo en una vereda cerca de La Chapa.'],
  ['Bacano / Chévere', 'Muy bueno', 'Cool, great', 'El paseo al Melcocho estuvo bacano.'],
  ['Berraco', 'Muy capaz, valiente (o muy difícil)', 'Very capable, brave (or very hard)', 'Ese artesano es un berraco pintando.'],
  ['Camellar', 'Trabajar', 'To work', 'Mañana me toca camellar temprano.'],
  ['Mecato', 'Paquetes, dulces y algo de comer entre comidas', 'Snacks', 'Llevemos mecato pal paseo.'],
  ['Ahorita', 'Dentro de un rato (puede ser mucho rato)', 'In a bit (which can be a long while)', 'Ahorita le mando la dirección.'],
  ['Tinto', 'Café negro pequeño (no es vino)', 'Small black coffee (not red wine)', 'Regáleme un tinto.'],
  ['Regáleme…', 'Forma amable de pedir algo, aunque lo pagues', 'Polite way to ask for something, even when paying', 'Regáleme un chorizo con arepa, por favor.'],
  ['¡Qué pena con usted!', 'Disculpe, perdón', 'Excuse me, sorry', 'Qué pena con usted, ¿me ayuda con una dirección?']
];
// Venezuela → Colombia
const VECO = [
  ['Cambur', 'Banano / guineo', 'Banana'], ['Caraota', 'Fríjol', 'Bean'], ['Cotufas', 'Crispetas', 'Popcorn'],
  ['Chamo', 'Muchacho / pelao', 'Young guy'], ['Pana', 'Parce / parcero', 'Buddy'], ['Jojoto', 'Mazorca', 'Corn on the cob'],
  ['Lechosa', 'Papaya', 'Papaya'], ['Autobús / camionetica', 'Bus / buseta', 'Bus'], ['Cédula venezolana', 'Pasaporte o PPT para trámites', 'Passport or PPT for paperwork']
];
// Inglés para trabajar en turismo: [inglés, español, pronunciación aproximada]
const ENG = [
  ['Welcome to El Carmen de Viboral!', '¡Bienvenido a El Carmen de Viboral!', 'uél-com tu el CAR-men de bi-bo-RAL'],
  ['How can I help you?', '¿En qué le puedo ayudar?', 'jáu can ái jelp yu'],
  ['This mug is hand-painted.', 'Este pocillo está pintado a mano.', 'dis mag is jand-PÉIN-ted'],
  ['Would you like to paint your own cup?', '¿Quiere pintar su propia taza?', 'wud yu láik tu péint yur oun cap'],
  ['It will be ready after firing.', 'Estará lista después de hornearla.', 'it wil bi RÉ-di ÁF-ter FÁI-ring'],
  ['Here is the menu.', 'Aquí está el menú.', 'jíer is de MÉ-niu'],
  ['Would you like something to drink?', '¿Desea algo de tomar?', 'wud yu láik SÓM-thing tu drink'],
  ['It costs fifty thousand pesos.', 'Cuesta cincuenta mil pesos.', 'it costs FÍF-ti THÁU-sand PÉ-sos'],
  ['We accept cash and card.', 'Aceptamos efectivo y tarjeta.', 'ui ak-SÉPT cash and card'],
  ['You need a reservation for the river.', 'Para el río necesita reserva.', 'yu nid a re-ser-VÉI-shon for de RÍ-ver'],
  ['Do you need a taxi?', '¿Necesita un taxi?', 'du yu nid a TÁK-si'],
  ['Sorry, can you repeat that?', 'Perdón, ¿puede repetir?', 'SÓ-ri, can yu ri-PÍT dat'],
  ['Have a nice day!', '¡Que tenga un buen día!', 'jav a náis dei']
];
const DIALOGS = [
  { t: { es: 'En el bus a Medellín', en: 'On the bus to Medellín' }, l: [
    ['a', 'Buenas. ¿Este bus para en la estación Exposiciones?', 'Hi. Does this bus stop at Exposiciones station?'],
    ['b', 'Sí, señor. ¿Paga con Cívica o en efectivo?', 'Yes, sir. Paying with Cívica or cash?'],
    ['a', 'Con Cívica. ¿A qué hora sale el último de regreso?', 'With Cívica. What time does the last one back leave?'],
    ['b', 'Pregunte en la taquilla, que el horario cambia los domingos.', 'Ask at the ticket office, the timetable changes on Sundays.']] },
  { t: { es: 'En un almacén de loza', en: 'In a pottery shop' }, l: [
    ['a', 'Buenas tardes. ¿Este juego de pocillos es pintado a mano?', 'Good afternoon. Is this set of mugs hand-painted?'],
    ['b', 'Sí, mija, todo es de aquí de El Carmen. ¿Se lo empaco?', 'Yes, dear, it\'s all made here in El Carmen. Shall I wrap it?'],
    ['a', 'Sí, pero empáquemelo bien, que viaja lejos. ¿Me da una ñapa?', 'Yes, but wrap it well, it\'s travelling far. Can I have a little extra?'],
    ['b', '¡Ave María! Hágale pues, le regalo este portavasos.', 'Goodness! Go on then, have this coaster on me.']] },
  { t: { es: 'Buscando trabajo', en: 'Looking for work' }, l: [
    ['a', 'Buenos días. Vengo por el aviso de la fábrica de cerámica. Aquí está mi hoja de vida.', 'Good morning. I\'m here about the pottery factory ad. Here\'s my CV.'],
    ['b', '¿Tiene PPT o documento al día?', 'Do you have a PPT or valid ID?'],
    ['a', 'Sí, tengo PPT. Aprendo rápido y sé pintar un poco.', 'Yes, I have a PPT. I learn fast and can paint a bit.'],
    ['b', 'Listo. Venga mañana a las 7 y empieza a prueba en esmaltado.', 'Great. Come tomorrow at 7 and start on trial in glazing.']] },
  { t: { es: 'En urgencias', en: 'At the ER' }, l: [
    ['a', 'Buenas noches. Mi hijo tiene fiebre alta desde ayer.', 'Good evening. My son has had a high fever since yesterday.'],
    ['b', '¿Tienen EPS?', 'Are you with a health insurer (EPS)?'],
    ['a', 'Todavía no, estamos haciendo el SISBEN.', 'Not yet, we\'re doing the SISBEN.'],
    ['b', 'Igual lo atendemos. Siéntese, ya lo llaman al triaje.', 'We\'ll see him anyway. Have a seat, triage will call you.']] }
];

const LIFE = {
  housing: { t: { es: 'Vivienda', en: 'Housing' }, ph: 'house', items: [
    { es: 'El casco urbano es pequeño y se camina fácil. En las veredas el arriendo suele ser más barato, pero el transporte es más escaso: pregunta cada cuánto pasa el carro o la chiva.', en: 'The town centre is small and easy to walk. Rent is usually cheaper in the rural veredas, but transport is scarcer: ask how often the shared jeep or chiva runs.' },
    { es: 'Rionegro, a unos 20 minutos, tiene más oferta de vivienda y empleo, pero es más cara.', en: 'Rionegro, about 20 minutes away, has more housing and jobs, but it\'s pricier.' },
    { es: 'Busca en grupos del pueblo, avisos de "Se arrienda" en las fachadas y portales de arriendo. Desconfía de precios muy bajos.', en: 'Look in local groups, "Se arrienda" signs on houses and rental sites. Distrust very low prices.' },
    { es: 'Nunca pagues depósito sin ver el lugar y sin contrato firmado con el nombre del dueño.', en: 'Never pay a deposit without seeing the place and a signed contract in the owner\'s name.' },
    { es: 'Pregunta si la casa es húmeda o fría y si tiene calentador de agua: aquí el agua sale helada. Pide recibo de cada pago: te sirve como prueba de residencia.', en: 'Ask whether the house is damp or cold and if it has a water heater: the water here is icy. Get a receipt for every payment: it works as proof of address.' }] },
  food: { t: { es: 'Comida', en: 'Food' }, ph: 'chorizo', items: [
    { es: 'Chorizo de punta con arepa: el antojo con el que se identifica El Carmen.', en: 'Chorizo de punta with arepa: the snack El Carmen is known for.' },
    { es: 'Bandeja paisa, frijoles con garra, sancocho y mondongo para el almuerzo.', en: 'Bandeja paisa, beans, sancocho and tripe soup for lunch.' },
    { es: 'Arepa en todas las comidas, chocolate caliente con queso y mazamorra con panela para el frío.', en: 'Arepa with every meal, hot chocolate with cheese and mazamorra (corn drink) with panela for the cold.' },
    { es: 'En diciembre: natilla y buñuelos en todas las casas.', en: 'In December: natilla and buñuelos in every home.' },
    { es: 'Arepas, cachapas y empanadas venezolanas se consiguen en el pueblo y en Rionegro.', en: 'Venezuelan arepas, cachapas and empanadas can be found in town and in Rionegro.' }] },
  culture: { t: { es: 'Costumbres', en: 'Customs' }, ph: 'loza', items: [
    { es: 'El Carmen es "la cuna de la cerámica artesanal": la loza decorada a mano bajo esmalte fue inscrita como Patrimonio Cultural Inmaterial de la Nación.', en: 'El Carmen is "the cradle of handmade ceramics": its hand-decorated underglaze pottery is listed as National Intangible Cultural Heritage.' },
    { es: 'Las flores de los platos (hortensias, pensamientos, rosas) son las mismas de los jardines de la región.', en: 'The flowers on the plates (hydrangeas, pansies, roses) are the same ones grown in the region\'s gardens.' },
    { es: 'La fiesta grande es la de la Loza, a principios de diciembre. En julio el pueblo se llena de teatro con El Gesto Noble.', en: 'The big party is the Fiestas de la Loza, in early December. In July the town fills with theatre during El Gesto Noble.' },
    { es: 'Se saluda al entrar: "Buenas" en la tienda, el bus o la oficina. El paisa es trabajador, conversador y muy servicial.', en: 'Greet when you walk in: "Buenas" in a shop, bus or office. Paisas are hard-working, chatty and very helpful.' },
    { es: 'Por el parque principal y la Calle de la Cerámica no se monta en bicicleta: la Alcaldía pone multas.', en: 'Don\'t ride a bicycle on the main square or Ceramics Street: the town hall fines people for it.' }] },
  safety: { t: { es: 'Seguridad', en: 'Safety' }, ph: 'neblina', items: [
    { es: '<b>Los ríos:</b> el Melcocho y otros ríos del Oriente se ven tranquilos pero crecen de golpe con la lluvia y ha habido ahogados. No te metas si llueve arriba, no saltes a charcos que no conoces y ve siempre con guía.', en: '<b>Rivers:</b> the Melcocho and other Oriente rivers look calm but rise suddenly with rain, and people have drowned. Stay out if it\'s raining upstream, don\'t jump into pools you don\'t know and always go with a guide.' },
    { es: '<b>Carreteras:</b> hay neblina y curvas. Si vas en moto, casco y chaleco reflectivo; de noche, despacio.', en: '<b>Roads:</b> fog and bends. On a motorbike wear a helmet and hi-vis vest; at night, go slowly.' },
    { es: 'El pueblo es tranquilo, pero cuida el celular en el parque y en el bus, sobre todo en fiestas.', en: 'The town is calm, but keep an eye on your phone in the square and on the bus, especially during festivals.' },
    { es: 'No aceptes bebidas ni comida de desconocidos. Desconfía de ofertas de trabajo que piden plata o tu documento: si te extorsionan, llama al 165.', en: 'Never accept drinks or food from strangers. Distrust job offers that ask for money or your ID: if you are extorted, call 165.' },
    { es: 'Los trámites migratorios no necesitan tramitadores: paga solo en canales oficiales de Migración Colombia o Cancillería.', en: 'Immigration procedures need no middlemen: pay only through official Migración Colombia or Foreign Ministry channels.' }] }
};

// Sección "El pueblo y el centro"
const GS = {
  what: [
    { es: 'El Carmen de Viboral queda en el altiplano del Oriente antioqueño, a unos 54 km de Medellín y a pocos minutos de Rionegro y del aeropuerto José María Córdova.', en: 'El Carmen de Viboral sits on the highlands of eastern Antioquia, about 54 km from Medellín and a few minutes from Rionegro and José María Córdova airport.' },
    { es: 'La vida gira alrededor del parque principal y la iglesia de Nuestra Señora del Carmen. De allí sale la Calle de la Cerámica.', en: 'Life revolves around the main square and the church of Our Lady of Carmen. Ceramics Street starts right there.' },
    { es: 'El municipio tiene 54 veredas y 7 corregimientos: buena parte de su gente vive del campo, las flores y la cerámica.', en: 'The municipality has 54 rural veredas and 7 corregimientos: many people live from farming, flowers and ceramics.' },
    { es: 'El Paseo del Ángel y las fachadas pintadas hacen del centro un lugar para caminar despacio y tomar fotos.', en: 'The Paseo del Ángel and painted façades make downtown a place to stroll slowly and take photos.' }
  ],
  doit: [
    [{ es: 'Parque principal e iglesia', en: 'Main square & church' }, { es: 'Un tinto en la plaza mirando la vida del pueblo.', en: 'A coffee on the square watching town life go by.' }, 'iglesia'],
    [{ es: 'Chorizo de punta', en: 'Chorizo de punta' }, { es: 'En La Especial, con arepa, al final de la Calle de la Cerámica.', en: 'At La Especial, with arepa, at the end of Ceramics Street.' }, 'chorizo'],
    [{ es: 'Paseo del Ángel', en: 'Paseo del Ángel' }, { es: 'Otro rincón decorado para caminar y fotografiar.', en: 'Another decorated corner to stroll and photograph.' }, 'street'],
    [{ es: 'Escapada a Rionegro', en: 'Hop over to Rionegro' }, { es: 'Para bancos, centros comerciales y trámites grandes.', en: 'For banks, malls and bigger errands.' }, 'rionegro']
  ],
  tips: [
    { es: 'Lleva chaqueta aunque salga el sol: en la tarde cambia rápido y llueve seguido.', en: 'Bring a jacket even if it\'s sunny: the afternoon turns fast and it rains often.' },
    { es: 'Los fines de semana y puentes llegan muchos turistas de Medellín: los almacenes y restaurantes buscan personal.', en: 'On weekends and long weekends many tourists come from Medellín: shops and restaurants look for staff.' },
    { es: 'No montes bicicleta por el parque ni por la Calle de la Cerámica: hay multas.', en: 'Don\'t ride a bike on the square or Ceramics Street: there are fines.' },
    { es: 'Para bancos grandes, notarías y trámites de más nivel, muchas veces te toca ir a Rionegro.', en: 'For big banks, notaries and higher-level paperwork you\'ll often need to go to Rionegro.' },
    { es: 'Respeta el descanso: el pueblo madruga y se acuesta temprano entre semana.', en: 'Respect quiet hours: the town gets up early and goes to bed early on weekdays.' },
    { es: 'Saluda a los vecinos: en un pueblo todos se conocen y eso abre puertas para trabajo y vivienda.', en: 'Greet your neighbours: in a small town everyone knows each other, and that opens doors for work and housing.' }
  ]
};

// Sección "Ríos y cañones"
const IS = {
  what: [
    { es: 'Más de la mitad del territorio de El Carmen está en los cañones de los ríos Melcocho y Santo Domingo, hacia la zona de bosque.', en: 'Over half of El Carmen\'s territory lies in the Melcocho and Santo Domingo river canyons, out towards the forest zone.' },
    { es: 'El Melcocho nace en territorio de El Carmen y es famoso por sus aguas transparentes. La comunidad controla cuánta gente entra para cuidarlo.', en: 'The Melcocho rises in El Carmen territory and is famous for its crystal-clear water. The community limits visitor numbers to protect it.' },
    { es: 'Para visitar el cañón del Melcocho es obligatorio reservar antes con el Centro de Atención Integral del Cañón del Río Melcocho (CAICA). El municipio abrió una ruta de bus directa hacia la reserva.', en: 'Visiting the Melcocho canyon requires booking in advance with the canyon\'s visitor centre (CAICA). The town opened a direct bus route to the reserve.' }
  ],
  doit: [
    [{ es: 'Charcos del Melcocho', en: 'Melcocho swimming holes' }, { es: 'Agua cristalina entre piedras y bosque. Solo con reserva.', en: 'Crystal water among rocks and forest. Booking only.' }, 'melcocho'],
    [{ es: 'Cañón del Santo Domingo', en: 'Santo Domingo canyon' }, { es: 'Caminos de herradura y veredas campesinas.', en: 'Mule trails and farming villages.' }, 'santodomingo'],
    [{ es: 'Guatapé y El Peñol', en: 'Guatapé & El Peñol' }, { es: 'El paseo de un día más famoso del Oriente.', en: 'The Oriente\'s most famous day trip.' }, 'penol'],
    [{ es: 'Campo y flores', en: 'Countryside & flowers' }, { es: 'Fincas de flores y montañas verdes alrededor del pueblo.', en: 'Flower farms and green hills around town.' }, 'campo']
  ],
  tips: [
    { es: 'Reserva primero: sin reserva no te dejan entrar al cañón del Melcocho.', en: 'Book first: without a booking you won\'t be let into the Melcocho canyon.' },
    { es: 'No te metas al río si está lloviendo o llovió arriba: crece de golpe. Ha habido personas ahogadas.', en: 'Stay out of the river if it\'s raining or rained upstream: it rises suddenly. People have drowned.' },
    { es: 'Ve con guía local: conocen los charcos seguros y te ayudan a no perderte.', en: 'Go with a local guide: they know the safe pools and keep you from getting lost.' },
    { es: 'Lleva zapatos para caminar en piedra, ropa de cambio, agua, comida, repelente y bolsa para tu basura.', en: 'Bring shoes for walking on rocks, a change of clothes, water, food, repellent and a bag for your rubbish.' },
    { es: 'Sal temprano y pregunta a qué hora pasa el último carro de regreso.', en: 'Leave early and ask what time the last ride back leaves.' },
    { es: 'No dejes basura ni jabón en el agua: el río es de todos y la comunidad lo cuida.', en: 'Leave no rubbish or soap in the water: the river belongs to everyone and the community looks after it.' }
  ]
};

// Sección "La loza y los talleres"
const ML = {
  what: [
    { es: 'La tradición cerámica de El Carmen empezó en 1898, cuando don Eliseo Pareja montó la primera locería. Después llegaron decenas de fábricas.', en: 'El Carmen\'s ceramics tradition began in 1898, when Eliseo Pareja set up the first pottery works. Dozens of factories followed.' },
    { es: 'Su sello es la loza decorada a mano bajo esmalte, con flores y jardines. En 2024 quedó en la Lista Representativa de Patrimonio Cultural Inmaterial de la Nación.', en: 'Its hallmark is pottery hand-decorated under the glaze, with flowers and gardens. In 2024 it joined the national list of Intangible Cultural Heritage.' },
    { es: 'La Calle de la Cerámica tiene fachadas, bancas y pisos cubiertos de loza. Allí están muchos almacenes y talleres.', en: 'Ceramics Street has façades, benches and paving covered in pottery. Many shops and workshops are there.' },
    { es: 'Cada vez más talleres ofrecen experiencias: tornear tu propia pieza o pintar una taza y llevártela horneada.', en: 'More and more workshops offer experiences: throw your own piece on the wheel or paint a mug and take it home fired.' }
  ],
  doit: [
    [{ es: 'Recorrer la Calle de la Cerámica', en: 'Walk Ceramics Street' }, { es: 'Gratis, de día, con calma para mirar cada fachada.', en: 'Free, by day, slowly enough to look at every façade.' }, 'calle'],
    [{ es: 'Pintar tu propia pieza', en: 'Paint your own piece' }, { es: 'En Cerámicas Creare pintas tu taza o plato en una finca y te lo entregan horneado.', en: 'At Cerámicas Creare you paint your mug or plate on a farm and get it back fired.' }, 'pintura'],
    [{ es: 'Ver el torno', en: 'Watch the wheel' }, { es: 'Muchos talleres te dejan ver o probar cómo se tornea el barro.', en: 'Many workshops let you watch or try throwing clay.' }, 'taller'],
    [{ es: 'Museo de la Cerámica', en: 'Ceramics Museum' }, { es: 'La historia de la loza carmelitana en piezas.', en: 'The story of local pottery, piece by piece.' }, 'museo']
  ],
  tips: [
    { es: 'Compara precios entre almacenes: hay loza de primera y "de segunda" con pequeños defectos, mucho más barata.', en: 'Compare prices between shops: there\'s first-grade pottery and cheaper "seconds" with small flaws.' },
    { es: 'Pide que te empaquen con papel y cartón si vas a viajar: la loza es frágil.', en: 'Ask for paper and cardboard packing if you\'re travelling: pottery is fragile.' },
    { es: 'Las fábricas y talleres contratan para colado, pulido, pintura, esmaltado y ventas: lleva tu hoja de vida.', en: 'Factories and workshops hire for casting, sanding, painting, glazing and sales: bring your CV.' },
    { es: 'Para las experiencias de pintura o torno, reserva antes y pregunta cuántos días tarda la quema.', en: 'For painting or wheel experiences, book ahead and ask how many days the firing takes.' },
    { es: 'Pregunta si la pieza es apta para microondas y lavavajillas.', en: 'Ask whether the piece is microwave and dishwasher safe.' },
    { es: 'No montes bicicleta por la Calle de la Cerámica: es peatonal y hay multas.', en: 'Don\'t ride a bike on Ceramics Street: it\'s pedestrian and there are fines.' }
  ]
};

// Videos reales de YouTube (revisados el 22 nov 2026). El robot agrega más en data/videos.json
const VIDEO_LIB = [
  { id: 'v0WsqzNS7ZM', k: 'centro', t: { es: '¿Vale la pena visitar El Carmen de Viboral?', en: 'Is El Carmen de Viboral worth visiting?' } },
  { id: 'F54GazOOgA8', k: 'centro', t: { es: 'Así se llega a El Carmen de Viboral', en: 'How to get to El Carmen de Viboral' } },
  { id: 'vuZGL6GaImo', k: 'centro', t: { es: 'El pueblo más subestimado de Colombia', en: 'Colombia\'s most underrated village' } },
  { id: 'tYgElJ_q9oY', k: 'centro', t: { es: 'Recorrido por El Carmen de Viboral', en: 'A tour of El Carmen de Viboral' } },
  { id: '625Pr7Q6oJ8', k: 'ronda', t: { es: 'Un municipio de tradición ceramista', en: 'A town of pottery tradition' } },
  { id: 'JT2ZazkGkcg', k: 'ronda', t: { es: 'El mundo de los artesanos de la cerámica', en: 'The world of the pottery artisans' } },
  { id: 'eChMoen7dtY', k: 'ronda', t: { es: 'El Carmen de Viboral, tierra de la cerámica', en: 'El Carmen de Viboral, land of ceramics' } },
  { id: '5zTeDu7xpHk', k: 'ronda', t: { es: 'Tradición y cerámica', en: 'Tradition and ceramics' } },
  { id: 'JymwIWHtfh8', k: 'feria', t: { es: 'Cerámica, comida y cultura carmelitana', en: 'Ceramics, food and local culture' } },
  { id: 'i1LAVkLu3Qo', k: 'vida', t: { es: 'La historia de El Carmen de Viboral', en: 'The history of El Carmen de Viboral' } }
];

/* ---------- Secciones (vistas) ---------- */
const SECTIONS = [
  { id: 'papers', ph: 'iglesia', badge: { es: 'Plazo', en: 'Deadline' }, t: { es: 'Papeles, PPT y visas', en: 'Papers, PPT & visas' }, s: { es: 'PEP Tutor en Medellín, Visa V, PPT, Check-MIG', en: 'PEP Tutor in Medellín, Visa V, PPT, Check-MIG' } },
  { id: 'work', ph: 'flores', t: { es: 'Trabajo y salario', en: 'Work & wages' }, s: { es: 'Mínimo 2026 y calculadora', en: '2026 minimum & calculator' } },
  { id: 'feria', ph: 'loza', badge: { es: 'Diciembre', en: 'December' }, t: { es: 'Fiestas de la Loza', en: 'Pottery Festival' }, s: { es: 'Fiestas de la Loza, Navidad, Campesino y teatro', en: 'Pottery Festival, Christmas, farmers and theatre' } },
  { id: 'ronda', ph: 'pintura', badge: { es: 'Imperdible', en: 'Must-see' }, t: { es: 'La loza y los talleres', en: 'Pottery & workshops' }, s: { es: 'Calle de la Cerámica, museo y pintar tu taza', en: 'Ceramics Street, museum and painting your mug' } },
  { id: 'centro', ph: 'parque', badge: { es: 'Pueblo', en: 'Town' }, t: { es: 'El pueblo y el centro', en: 'The town & downtown' }, s: { es: 'Parque, iglesia, chorizo de punta y Rionegro', en: 'Square, church, chorizo de punta and Rionegro' } },
  { id: 'costa', ph: 'melcocho', badge: { es: 'Paseo', en: 'Day trip' }, t: { es: 'Ríos y cañones', en: 'Rivers & canyons' }, s: { es: 'Río Melcocho con reserva, Santo Domingo y Guatapé', en: 'Melcocho River (booking), Santo Domingo and Guatapé' } },
  { id: 'places', ph: 'calle', t: { es: 'Lugares', en: 'Places' }, s: { es: 'Qué conocer, gratis y de pago', en: 'What to see, free and paid' } },
  { id: 'move', ph: 'bus', t: { es: 'Transporte', en: 'Getting around' }, s: { es: 'Flota El Carmen, Cívica, aeropuerto', en: 'Flota El Carmen, Cívica, airport' } },
  { id: 'health', ph: 'hospital', t: { es: 'Salud', en: 'Health' }, s: { es: 'Urgencias, SISBEN, EPS', en: 'ER, SISBEN, insurers' } },
  { id: 'money', ph: 'peso', t: { es: 'Peso y cambio', en: 'Peso & exchange' }, s: { es: 'Dólar, euro y bolívar en vivo', en: 'Dollar, euro and bolívar live' } },
  { id: 'talk', ph: 'trova', t: { es: 'Hablar paisa', en: 'Speak paisa' }, s: { es: 'Palabras, conversaciones e inglés', en: 'Words, dialogues and English' } },
  { id: 'life', ph: 'house', t: { es: 'Vivir aquí', en: 'Living here' }, s: { es: 'Vivienda, comida, frío, seguridad', en: 'Housing, food, cold, safety' } },
  { id: 'weather', ph: 'neblina', t: { es: 'Clima y festivos', en: 'Weather & holidays' }, s: { es: 'Pronóstico y feriados', en: 'Forecast and holidays' } },
  { id: 'first', ph: 'airport', t: { es: 'Primeros días', en: 'First days' }, s: { es: 'Lista paso a paso', en: 'Step-by-step list' } },
  { id: 'map', ph: 'carmen', t: { es: 'Mapa', en: 'Map' }, s: { es: 'Lugares, hospital, Migración', en: 'Places, hospital, immigration' } },
  { id: 'media', ph: 'hortensia', t: { es: 'Fotos y videos', en: 'Photos & videos' }, s: { es: 'Conoce el pueblo antes de ir', en: 'See the town before you go' } }
];
const WIDE = ['papers', 'feria', 'ronda', 'centro', 'costa', 'media'];


function head(id, title, sub) {
  return `<button class="back" onclick="go('home')">${L(T.back)}</button>
  <div class="sec-head" style="margin-top:0"><div><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ''}</div></div>`;
}
const linkBtn = (href, txt, cls = '') => `<a class="btn ${cls}" href="${href}" target="_blank" rel="noopener">${txt}</a>`;

const V = {};


V.home = () => `
  <div class="hero" id="hero">
    <div class="dots" id="hero-dots"></div>
    <span class="cap" id="hero-cap"></span>
    <div class="in">
      <span class="kicker">${L({ es: 'Recién llegado a El Carmen de Viboral', en: 'Just arrived in El Carmen de Viboral' })}</span>
      <h1>${L({ es: 'Bienvenido a la cuna de la cerámica', en: 'Welcome to the cradle of Colombian ceramics' })}</h1>
      <p>${L({ es: 'Papeles, trabajo, transporte, salud, cómo hablar paisa, las Fiestas de la Loza, el río Melcocho y los mejores rincones de El Carmen de Viboral, en un solo lugar y en tu idioma.', en: 'Papers, work, transport, health, how to speak paisa, the Pottery Festival, the Melcocho River and the best of El Carmen de Viboral, all in one place and in your language.' })}</p>
    </div>
  </div>
  <div id="alert"></div>
  <div class="live">
    <div class="lc dark"><div class="lab">${L({ es: 'Clima ahora', en: 'Weather now' })}</div><div class="big" id="wx-now"><span class="spin"></span></div><div class="sub" id="wx-sub"></div></div>
    <div class="lc sea"><div class="lab">${L({ es: 'Hora en El Carmen', en: 'Time in El Carmen' })}</div><div class="big" id="clk-co">--:--</div><div class="sub" id="clk-ve"></div></div>
    <div class="lc c3"><div class="lab">${L({ es: '1 dólar hoy', en: '1 US dollar today' })}</div><div class="big" id="fx-usd"><span class="spin"></span></div><div class="sub muted" id="fx-sub"></div></div>
  </div>
  <div id="fiesta-strip"></div>
  <div class="card mt2" id="news-card">
    <div class="row" style="justify-content:space-between"><h3 style="text-transform:uppercase">${L({ es: 'Hoy en El Carmen', en: 'Today in El Carmen' })}</h3><button class="btn sm red" onclick="loadNews(true)">${L({ es: 'Actualizar', en: 'Refresh' })}</button></div>
    <p class="small muted" id="news-meta"></p>
    <div class="status-list mt" id="news-list"><div class="sl"><span class="spin"></span></div></div>
  </div>
  <div class="sec-head"><div><h2>${L({ es: 'Video del día', en: 'Video of the day' })}</h2></div></div>
  <div class="vids">${vidCard(videoOfDay())}</div>
  <div class="ptiles">
    ${SECTIONS.map(s => `<button class="pt ${s.badge ? 'hot' : ''} ${WIDE.includes(s.id) ? 'wide' : ''}" ${s.badge ? `data-badge="${esc(L(s.badge))}"` : ''} ${photo(s.ph)} onclick="go('${s.id}')"><b>${L(s.t)}</b><small>${L(s.s)}</small></button>`).join('')}
  </div>
  <div class="card mt2 reveal">
    <h3>${L({ es: 'Mi dirección en El Carmen', en: 'My address in El Carmen' })}</h3>
    <p class="small muted">${L({ es: 'Guárdala aquí. Si te pierdes, la app te lleva de vuelta o se la muestras a alguien. Solo queda en tu celular.', en: 'Save it here. If you get lost, the app takes you back or you show it to someone. It stays on your phone only.' })}</p>
    <div class="row mt"><input id="my-addr" placeholder="${L({ es: 'Ej: Carrera 30 # 31-20', en: 'E.g. Carrera 30 # 31-20' })}" value="${esc(store.get('addr', ''))}"><button class="btn red" onclick="saveAddr()">${L({ es: 'Guardar', en: 'Save' })}</button></div>
    <div class="btns"><button class="btn sm" onclick="routeHome()">${L({ es: 'Llévame a casa', en: 'Take me home' })}</button><button class="btn sm ghost" onclick="openShow()">${L({ es: 'Mostrar a alguien', en: 'Show someone' })}</button></div>
  </div>`;

V.feria = () => `
  ${head('feria', L({ es: 'Fiestas de la Loza y cultura', en: 'Pottery Festival & culture' }), L({ es: 'Lo que viene en El Carmen de Viboral: las Fiestas de la Loza, la Navidad, las Fiestas del Campesino y el festival de teatro El Gesto Noble.', en: 'What\'s coming up in El Carmen de Viboral: the Pottery Festival, Christmas, the Farmers\' Festival and the El Gesto Noble theatre festival.' }))}
  <div class="hero" style="min-height:240px" ${photo('loza')}><div class="in"><span class="kicker">${L({ es: 'Cuna de la cerámica artesanal', en: 'Cradle of handmade ceramics' })}</span><h1 style="font-size:2.3rem">${L({ es: 'Loza, música, trova y teatro', en: 'Pottery, music, trova and theatre' })}</h1><p id="fiesta-next"></p></div></div>
  <div class="status-list" id="fiesta-list"></div>
  <div class="card mt2 reveal">
    <h3>${L({ es: 'Las Fiestas de la Loza', en: 'The Fiestas de la Loza' })}</h3>
    <ul class="small">
      <li>${L({ es: 'Son la fiesta grande de El Carmen y celebran a los ceramistas. Se hacen cada año a principios de diciembre: la edición 51 fue del 4 al 8 de diciembre de 2025.', en: 'They are El Carmen\'s big festival and celebrate its potters. They take place every year in early December: the 51st edition ran from 4 to 8 December 2025.' })}</li>
      <li>${L({ es: 'Traen el Mercadillo de la Cerámica en el parque, la "Fábrica Viva" donde los artesanos muestran cómo trabajan, el Desfile de la Loza, cabalgata, Festival Nacional de Trova y conciertos.', en: 'They bring the Ceramics Market on the square, the "Living Factory" where artisans show how they work, the Pottery Parade, a horse parade, the National Trova Festival and concerts.' })}</li>
      <li>${L({ es: 'Es buena época para conseguir trabajo temporal en ventas, comida, logística y almacenes de loza.', en: 'It\'s a good time to find temporary work in sales, food, logistics and pottery shops.' })}</li>
    </ul>
  </div>
  <div class="sec-head"><div><h2>${L({ es: 'Lo que vas a ver', en: 'What you\'ll see' })}</h2><p>${L({ es: 'Desliza para ver más.', en: 'Swipe for more.' })}</p></div></div>
  <div class="rail">
    <article class="place"><div class="ph" ${photo('plato')}></div><div class="bd"><h3>${L({ es: 'Mercadillo de la Cerámica', en: 'Ceramics Market' })}</h3><p>${L({ es: 'Platos, pocillos y piezas pintadas a mano, directo de los talleres del pueblo.', en: 'Hand-painted plates, mugs and pieces straight from the town\'s workshops.' })}</p></div></article>
    <article class="place"><div class="ph" ${photo('cabalgata')}></div><div class="bd"><h3>${L({ es: 'La cabalgata', en: 'The horse parade' })}</h3><p>${L({ es: 'Jinetes de todo el Oriente recorren el pueblo. Es de los días más concurridos.', en: 'Riders from all over the Oriente parade through town. One of the busiest days.' })}</p></div></article>
    <article class="place"><div class="ph" ${photo('trova')}></div><div class="bd"><h3>${L({ es: 'Trova paisa', en: 'Paisa trova' })}</h3><p>${L({ es: 'Duelos de versos improvisados con guitarra: el humor paisa en vivo.', en: 'Improvised verse duels with guitar: paisa humour live.' })}</p></div></article>
    <article class="place"><div class="ph" ${photo('teatro')}></div><div class="bd"><h3>${L({ es: 'El Gesto Noble', en: 'El Gesto Noble' })}</h3><p>${L({ es: 'Festival internacional de teatro que cada julio llena el pueblo de obras y talleres.', en: 'International theatre festival that fills the town with plays and workshops every July.' })}</p></div></article>
  </div>
  ${vidRail('feria')}
  <div class="card mt2 reveal"><h3>${L({ es: 'Consejos para gozarlo', en: 'Tips to enjoy it' })}</h3><ul class="small">
    <li>${L({ es: 'En diciembre llegan muchos visitantes de Medellín: si vas a pasar la noche, reserva hospedaje con tiempo.', en: 'Many visitors come from Medellín in December: if you\'re staying the night, book early.' })}</li>
    <li>${L({ es: 'Lleva chaqueta y paraguas: las noches de diciembre en el altiplano son frías.', en: 'Bring a jacket and umbrella: December nights on the highlands are cold.' })}</li>
    <li>${L({ es: 'No te acerques por detrás a los caballos ni dejes que los niños corran entre ellos en la cabalgata.', en: 'Never approach horses from behind or let children run among them during the horse parade.' })}</li>
    <li>${L({ es: 'No aceptes tragos de desconocidos y acuerda con los tuyos un punto de encuentro, por ejemplo la iglesia.', en: 'Never accept drinks from strangers and agree a meeting point with your group, such as the church.' })}</li>
    <li>${L({ es: 'Si compras loza en el mercadillo, pide que te la empaquen bien para el bus.', en: 'If you buy pottery at the market, ask for it to be packed well for the bus.' })}</li>
  </ul></div>
  <p class="small muted mt">${L({ es: 'Datos de la Alcaldía de El Carmen de Viboral y la prensa regional, revisados el 22 de noviembre de 2026. Las fechas exactas de las Fiestas de la Loza 2026 aún no estaban publicadas: confírmalas antes de ir.', en: 'Data from El Carmen de Viboral town hall and regional press, checked on 22 November 2026. The exact 2026 Pottery Festival dates were not yet published: confirm them before going.' })}</p>
  <div class="btns">${linkBtn('https://www.elcarmendeviboral-antioquia.gov.co/', L({ es: 'Alcaldía de El Carmen', en: 'El Carmen town hall' }), 'sm red')}<a class="btn sm" href="https://www.youtube.com/results?search_query=${encodeURIComponent('Fiestas de la Loza El Carmen de Viboral')}" target="_blank" rel="noopener">${L({ es: 'Videos', en: 'Videos' })}</a></div>`;

function fiestaWhen(f) { return f[3] ? L(f[3]) : `<span style="text-transform:capitalize">${dateLabel(f[0])}</span>`; }
function fiestaRows() {
  const today = todayISO();
  return FIESTAS.map(f => {
    const dt = daysTo(f[0]);
    const pill = f[3] && dt > 0 ? `<span class="pill">${L({ es: 'Por confirmar', en: 'TBC' })}</span>` : f[0] === today ? `<span class="pill free">${L({ es: 'Hoy', en: 'Today' })}</span>` : dt > 0 ? `<span class="pill">${L({ es: 'En ' + dt + ' d', en: 'In ' + dt + ' d' })}</span>` : `<span class="pill paid">${L({ es: 'Ya pasó', en: 'Done' })}</span>`;
    return `<div class="sl" style="${dt < 0 ? 'opacity:.55' : ''}"><div><b>${L(f[1])}</b><small>${fiestaWhen(f)} · ${L(f[2])}</small></div>${pill}</div>`;
  }).join('');
}
function nextFiesta() { const today = todayISO(); return FIESTAS.find(f => f[0] >= today) || null; }
function fiestaIn(f) { const d = daysTo(f[0]); return f[3] ? L(f[3]) : d === 0 ? L({ es: 'hoy', en: 'today' }) : L({ es: 'en ' + d + ' días', en: 'in ' + d + ' days' }); }
function renderFiestas() {
  const box = $('#fiesta-list'); if (box) box.innerHTML = fiestaRows();
  const nf = nextFiesta();
  const p = $('#fiesta-next'); if (p) p.textContent = nf ? L({ es: 'Lo que sigue: ', en: 'Up next: ' }) + L(nf[1]) + ' (' + fiestaIn(nf) + ')' : L({ es: 'Revisa la agenda en la web de la Alcaldía.', en: 'Check the calendar on the town hall website.' });
  const s = $('#fiesta-strip');
  if (s) s.innerHTML = nf ? `<div class="card dark mt2" style="cursor:pointer" onclick="go('feria')"><div class="small" style="opacity:.75">${L({ es: 'Agenda de El Carmen de Viboral', en: 'El Carmen de Viboral calendar' })}</div><b style="font-family:'Barlow Condensed';font-size:1.45rem;text-transform:uppercase">${L(nf[1])}</b><div class="small" style="opacity:.85">${fiestaWhen(nf)}${nf[3] ? '' : ' · ' + fiestaIn(nf)}</div></div>` : '';
}

V.places = () => {
  const cats = [['city', { es: 'En el pueblo', en: 'In town' }], ['nature', { es: 'Ríos y paseos', en: 'Rivers & day trips' }]];
  const extra = { calle: ['ronda', { es: 'Ver loza', en: 'See pottery' }], museo: ['ronda', { es: 'Ver loza', en: 'See pottery' }], creare: ['ronda', { es: 'Ver loza', en: 'See pottery' }], parque: ['centro', { es: 'Ver pueblo', en: 'See town' }], chorizo: ['centro', { es: 'Ver pueblo', en: 'See town' }], rionegro: ['centro', { es: 'Ver pueblo', en: 'See town' }], melcocho: ['costa', { es: 'Ver sección', en: 'See section' }], santodomingo: ['costa', { es: 'Ver sección', en: 'See section' }], guatape: ['costa', { es: 'Ver sección', en: 'See section' }] };
  return `${head('places', L({ es: 'Lugares para conocer', en: 'Places to see' }), L({ es: 'Desliza para ver más. Toca "Cómo llegar" para abrir la ruta.', en: 'Swipe for more. Tap "Directions" to open the route.' }))}
  ${cats.map(c => `<h3 class="mt2" style="text-transform:uppercase">${L(c[1])}</h3><div class="rail mt">${PLACES.filter(p => p.cat === c[0]).map(p => `
    <article class="place"><div class="ph" ${photo(p.id)}><span class="pill ${p.free ? 'free' : 'paid'}">${p.free ? L({ es: 'Gratis', en: 'Free' }) : L({ es: 'Con costo', en: 'Paid' })}</span></div>
      <div class="bd"><h3>${L(p.n)}</h3><p>${L(p.d)}</p>
      <div class="btns"><a class="btn sm red" href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(p.q || p.lat + ',' + p.lon)}" target="_blank" rel="noopener">${L({ es: 'Cómo llegar', en: 'Directions' })}</a><button class="btn sm ghost" onclick="showOnMap('${p.id}')">${L({ es: 'En el mapa', en: 'On map' })}</button>${extra[p.id] ? `<button class="btn sm" onclick="go('${extra[p.id][0]}')">${L(extra[p.id][1])}</button>` : ''}${p.id === 'creare' ? `<a class="btn sm" href="https://ceramicas-creare.netlify.app/" target="_blank" rel="noopener">${L({ es: 'App de Creare', en: 'Creare app' })}</a>` : ''}</div></div></article>`).join('')}</div>`).join('')}`;
};


V.papers = () => `
  ${head('papers', L({ es: 'Papeles, PPT y visas', en: 'Papers, PPT & visas' }), L({ es: 'Entrar, quedarte y trabajar de forma legal en Colombia.', en: 'Entering, staying and working legally in Colombia.' }))}
  <div id="alert2"></div>
  <div class="card mt2 reveal">
    <h3>${L({ es: 'Si eres venezolano: las tres vías vigentes', en: 'If you\'re Venezuelan: the three current routes' })}</h3>
    <p class="small">${L({ es: 'Migración Colombia actualizó en septiembre de 2026 las opciones de regularización. La inscripción al PPT para adultos está cerrada.', en: 'Migración Colombia updated the regularization options in September 2026. PPT registration for adults is closed.' })}</p>
    <div class="status-list mt">
      <div class="sl"><div><b>1. PPT — ${L({ es: 'Permiso por Protección Temporal', en: 'Temporary Protection Permit' })}</b><small>${L({ es: 'Sigue abierto solo para niños y adolescentes venezolanos inscritos en un colegio o en programas del ICBF. El plazo para reclamar los PPT aprobados venció el <b>4 de noviembre de 2026</b>: si no alcanzaste a recogerlo, consulta en Migración o en la Personería qué opciones te quedan.', en: 'Still open only for Venezuelan children and teens enrolled in school or ICBF programmes. The deadline to collect approved PPTs passed on <b>4 November 2026</b>: if you missed it, ask Migración or the Personería what options you have left.' })}</small></div></div>
      <div class="sl"><div><b>2. PEP Tutor</b><small>${L({ es: 'Para papás, tutores o cuidadores de menores venezolanos que tenían PPT vigente al 31 de diciembre de 2023. Se pide hasta el <b>31 de diciembre de 2026</b> (Resolución 1747 de 2026). <b>Medellín</b> es una de las 10 ciudades donde se tramita: queda a cerca de una hora de El Carmen.', en: 'For parents, guardians or carers of Venezuelan minors who held a valid PPT on 31 December 2023. Apply by <b>31 December 2026</b> (Resolution 1747 of 2026). <b>Medellín</b> is one of the 10 processing cities, about an hour from El Carmen.' })}</small></div></div>
      <div class="sl"><div><b>3. Visa V — ${L({ es: 'Visitante Especial', en: 'Special Visitor' })}</b><small>${L({ es: 'Para venezolanos que entraron a Colombia antes del 4 de diciembre de 2024 y cumplen las condiciones de Cancillería. Dura dos años e incluye permiso abierto de trabajo. Requiere verificación previa de Migración.', en: 'For Venezuelans who entered Colombia before 4 December 2024 and meet the Foreign Ministry\'s conditions. Valid two years with an open work permit. Requires prior verification by Migración.' })}</small></div></div>
    </div>
    <div class="note red mt">${L({ es: 'No pueden acceder quienes tienen antecedentes penales, órdenes de expulsión o deportación vigentes, o están privados de la libertad. Migración insiste: no se necesitan intermediarios.', en: 'People with criminal records, active expulsion or deportation orders, or in custody are excluded. Migración insists: no middlemen are needed.' })}</div>
    <div class="btns">${linkBtn('https://www.migracioncolombia.gov.co/', 'Migración Colombia', 'red')}${linkBtn('https://www.cancilleria.gov.co/tramites_servicios/visa', L({ es: 'Visas en Cancillería', en: 'Foreign Ministry visas' }))}${linkBtn('https://help.unhcr.org/colombia/regularizacion-para-personas-venezolanas/', L({ es: 'Guía de ACNUR', en: 'UNHCR guide' }), 'ghost')}</div>
  </div>
  <div class="card mt2 reveal">
    <h3>${L({ es: 'Cómo pedir el PEP Tutor paso a paso', en: 'How to apply for PEP Tutor step by step' })}</h3>
    <ol class="small mt">
      <li>${L({ es: 'Llena el Formulario Único de Trámites (FUT) en el sitio de Migración.', en: 'Fill in the Single Procedures Form (FUT) on Migración\'s site.' })}</li>
      <li>${L({ es: 'Responde la encuesta socioeconómica. Te llega un número de caso al correo.', en: 'Answer the socio-economic survey. You get a case number by email.' })}</li>
      <li>${L({ es: 'Agenda la cita presencial en el sistema de Migración.', en: 'Book the in-person appointment in Migración\'s system.' })}</li>
      <li>${L({ es: 'Lleva tu documento y la prueba del vínculo: registro de nacimiento apostillado si eres papá o mamá; sentencia, escritura o acta si eres tutor o cuidador.', en: 'Bring your ID and proof of the relationship: apostilled birth certificate if you\'re the parent; court ruling, deed or record if you\'re a guardian or carer.' })}</li>
      <li>${L({ es: 'Migración tiene 30 días para responder. Si lo aprueban, recoge el permiso a tiempo.', en: 'Migración has 30 days to reply. If approved, collect the permit on time.' })}</li>
    </ol>
  </div>
  <div class="grid g2 stack mt2">
    <div class="card reveal">
      <h3>${L({ es: 'Si vienes de visita', en: 'If you\'re visiting' })}</h3>
      <ul class="small">
        <li>${L({ es: 'La mayoría de latinoamericanos entra sin visa como turista por 90 días, prorrogables hasta 180 días en el año. Confirma tu caso en Cancillería.', en: 'Most Latin Americans enter visa-free as tourists for 90 days, extendable to 180 days a year. Confirm your case with the Foreign Ministry.' })}</li>
        <li>${L({ es: '<b>Check-MIG:</b> formulario gratuito de Migración que debes llenar antes de entrar y salir del país.', en: '<b>Check-MIG:</b> free Migración form you must fill in before entering and leaving the country.' })}</li>
        <li>${L({ es: 'Como turista <b>no puedes trabajar</b>, ni siquiera "por días".', en: 'As a tourist you <b>cannot work</b>, not even casual day jobs.' })}</li>
      </ul>
      <div class="btns">${linkBtn('https://www.migracioncolombia.gov.co/', 'Check-MIG', 'sm')}</div>
    </div>
    <div class="card reveal">
      <h3>${L({ es: 'Lo que te abre tener papeles', en: 'What papers open up for you' })}</h3>
      <ul class="small">
        <li>${L({ es: 'Trabajo formal con contrato, prima, vacaciones y cesantías.', en: 'Formal work with a contract, bonuses, holidays and severance.' })}</li>
        <li>${L({ es: 'Salud: SISBEN y afiliación a una EPS.', en: 'Health: SISBEN and joining an EPS insurer.' })}</li>
        <li>${L({ es: 'Cuenta bancaria, Nequi o Daviplata.', en: 'Bank account, Nequi or Daviplata.' })}</li>
        <li>${L({ es: 'Estudiar, convalidar títulos y hacer cursos gratis del SENA.', en: 'Study, validate diplomas and take free SENA courses.' })}</li>
        <li>${L({ es: 'Si tu hijo nació en Colombia, pregunta en la Registraduría por su registro civil y nacionalidad.', en: 'If your child was born in Colombia, ask the Registry about their birth record and nationality.' })}</li>
      </ul>
    </div>
  </div>
  <div class="card mt2 reveal">
    <h3>${L({ es: 'Licencia de conducción', en: 'Driving licence' })}</h3>
    <ul class="small">
      <li>${L({ es: '<b>Turista:</b> puedes manejar con la licencia vigente de tu país mientras estés como turista, máximo 6 meses. Llévala con el pasaporte.', en: '<b>Tourist:</b> you can drive on your valid home licence while you are a tourist, up to 6 months. Carry it with your passport.' })}</li>
      <li>${L({ es: '<b>Si vives aquí</b> (visa M o R, cédula de extranjería o PPT) necesitas <b>licencia colombiana</b>. Sin ella: comparendo e inmovilización del carro o la moto.', en: '<b>If you live here</b> (M or R visa, foreigner ID or PPT) you need a <b>Colombian licence</b>. Without it: a fine and the vehicle gets impounded.' })}</li>
      <li>${L({ es: '<b>Venezolanos con PPT:</b> pueden sacar licencia en las categorías A1, A2 (motos), B1 y C1. La licencia venezolana <b>no se homologa</b>: el proceso empieza de cero.', en: '<b>Venezuelans with PPT:</b> can get licences in categories A1, A2 (motorbikes), B1 and C1. Venezuelan licences are <b>not recognised</b>: you start from scratch.' })}</li>
      <li>${L({ es: '<b>Pasos:</b> inscríbete en el RUNT con tu huella, haz el curso en una escuela de conducción (CEA), el examen médico en un CRC y los exámenes teórico y práctico. Pagas y recoges en el organismo de tránsito que te corresponda (pregunta en la Alcaldía de El Carmen o en Rionegro).', en: '<b>Steps:</b> register in the RUNT with your fingerprint, take the course at a driving school (CEA), the medical exam at a CRC and the theory and practical tests. Pay and collect at your local transit office (ask at El Carmen town hall or in Rionegro).' })}</li>
      <li>${L({ es: 'Para trabajar de conductor o en domicilios en moto necesitas licencia colombiana, SOAT y técnico-mecánica al día. No compres licencias "sin examen": es delito.', en: 'To work as a driver or motorbike courier you need a Colombian licence, SOAT insurance and vehicle inspection. Never buy a licence "without tests": it is a crime.' })}</li>
    </ul>
    <p class="small muted mt">${L({ es: 'Revisado el 2 de noviembre de 2026. Fuentes: Ministerio de Transporte y RUNT.', en: 'Checked on 2 November 2026. Sources: Ministry of Transport and RUNT.' })}</p>
    <div class="btns"><a class="btn sm" href="https://www.runt.gov.co/" target="_blank" rel="noopener">RUNT</a></div>
  </div>
  <div class="sec-head"><div><h2>${L({ es: 'Oficinas', en: 'Offices' })}</h2></div></div>
  <div class="status-list">${OFFICES.map(o => `<div class="sl reveal"><div><b>${L(o.n)}</b><small>${esc(o.a)} · ${L(o.h)}</small><small><a href="${gmaps(o.a)}" target="_blank" rel="noopener">${L({ es: 'Ver en el mapa', en: 'See on map' })}</a></small></div>${o.telS ? `<a class="call ink" href="tel:${o.tel}">${L({ es: 'Llamar', en: 'Call' })}</a>` : ''}</div>`).join('')}</div>`;

V.work = () => `
  ${head('work', L({ es: 'Trabajo y salario', en: 'Work & wages' }), L({ es: 'Salario mínimo 2026 de $1.750.905 (Decreto 0159 de 2026, vigente según MinTrabajo) y jornada de 42 horas desde el 15 de julio de 2026.', en: '2026 minimum wage of COP 1,750,905 (Decree 0159 of 2026, in force per the Labour Ministry) and 42-hour week since 15 July 2026.' }))}
  <div class="live" style="margin-top:0">
    <div class="lc dark"><div class="lab">${L({ es: 'Salario mínimo', en: 'Minimum wage' })}</div><div class="big">${cop(WAGE.month)}</div><div class="sub">${L({ es: 'Mensual, antes de descuentos', en: 'Monthly, before deductions' })}</div></div>
    <div class="lc sea"><div class="lab">${L({ es: 'Con auxilio de transporte', en: 'With transport allowance' })}</div><div class="big">${cop(WAGE.total)}</div><div class="sub">${L({ es: 'Auxilio: ', en: 'Allowance: ' })}${cop(WAGE.aux)}</div></div>
    <div class="lc c3"><div class="lab">${L({ es: 'Hora ordinaria', en: 'Ordinary hour' })}</div><div class="big">${cop(WAGE.hour)}</div><div class="sub muted" id="wage-usd">${L({ es: 'Salario ÷ 210 horas', en: 'Wage ÷ 210 hours' })}</div></div>
  </div>
  <div class="card mt2 reveal">
    <h3>${L({ es: 'Recargos (sobre la hora ordinaria)', en: 'Surcharges (on the ordinary hour)' })}</h3>
    <table class="t mt"><tr><th>${L({ es: 'Concepto', en: 'Item' })}</th><th>%</th><th>${L({ es: 'Valor hora', en: 'Hourly' })}</th></tr>
      ${[[{ es: 'Hora nocturna (7 p. m. a 6 a. m.)', en: 'Night hour (7 pm to 6 am)' }, 35], [{ es: 'Hora extra diurna', en: 'Daytime overtime' }, 25], [{ es: 'Hora extra nocturna', en: 'Night overtime' }, 75], [{ es: 'Domingo o festivo', en: 'Sunday or holiday' }, 90], [{ es: 'Extra diurna en domingo o festivo', en: 'Daytime overtime, Sunday/holiday' }, 115], [{ es: 'Extra nocturna en domingo o festivo', en: 'Night overtime, Sunday/holiday' }, 165]].map(r => `<tr><td>${L(r[0])}</td><td class="n">+${r[1]}%</td><td class="n">${cop(WAGE.hour * (1 + r[1] / 100))}</td></tr>`).join('')}
    </table>
    <p class="small muted mt">${L({ es: 'El recargo por domingo y festivo subió al 90% el 1 de julio de 2026 (Ley 2466). El auxilio de transporte no entra en la base de estos cálculos.', en: 'The Sunday/holiday surcharge rose to 90% on 1 July 2026 (Law 2466). The transport allowance isn\'t part of the base for these.' })}</p>
  </div>
  <div class="card mt2 reveal">
    <h3>${L({ es: 'Calculadora de sueldo', en: 'Pay calculator' })}</h3>
    <div class="grid g3">
      <div><label class="f">${L({ es: 'Horas por semana', en: 'Hours per week' })}</label><input id="w-h" type="number" min="1" max="42" value="42" oninput="calcWage()"></div>
      <div><label class="f">${L({ es: 'Horas nocturnas por semana', en: 'Night hours per week' })}</label><input id="w-n" type="number" min="0" max="42" value="0" oninput="calcWage()"></div>
      <div><label class="f">${L({ es: 'Domingos o festivos al mes', en: 'Sundays/holidays per month' })}</label><input id="w-d" type="number" min="0" max="10" value="0" oninput="calcWage()"></div>
    </div>
    <div id="w-out" class="mt"></div>
  </div>
  <div class="card mt2 reveal">
    <h3>${L({ es: 'Tus derechos', en: 'Your rights' })}</h3>
    <ul class="small">
      <li>${L({ es: 'Con PPT, visa o documento colombiano tienes los mismos derechos laborales que cualquier trabajador en Colombia.', en: 'With a PPT, visa or Colombian ID you have the same labour rights as any worker in Colombia.' })}</li>
      <li>${L({ es: 'Si ganas hasta dos salarios mínimos te deben pagar el auxilio de transporte.', en: 'If you earn up to two minimum wages you must get the transport allowance.' })}</li>
      <li>${L({ es: 'Te descuentan 4% para salud y 4% para pensión; el empleador paga su parte y te afilia a riesgos laborales (ARL).', en: '4% for health and 4% for pension come off your pay; the employer pays its share and enrols you in workplace-risk insurance (ARL).' })}</li>
      <li>${L({ es: 'Pide contrato por escrito y desprendible de pago. Guarda fotos de todo.', en: 'Ask for a written contract and payslips. Keep photos of everything.' })}</li>
      <li>${L({ es: 'Sectores con más trabajo en El Carmen y el Oriente: fábricas y talleres de cerámica, cultivos de flores, agricultura, construcción, restaurantes y turismo, comercio y domicilios. Rionegro y la zona del aeropuerto tienen más empresas. En diciembre, las Fiestas de la Loza abren empleos temporales. Hablar inglés te abre puertas en turismo.', en: 'Sectors with most work in El Carmen and the Oriente: pottery factories and workshops, flower farms, agriculture, construction, restaurants and tourism, retail and delivery. Rionegro and the airport area have more companies. In December the Pottery Festival opens temporary jobs. English opens doors in tourism.' })}</li>
      <li>${L({ es: 'Busca vacantes en el Servicio Público de Empleo y en la Agencia de Empleo del SENA, y haz cursos gratis del SENA.', en: 'Find jobs at the Public Employment Service and the SENA Jobs Agency, and take free SENA courses.' })}</li>
    </ul>
    <div class="btns">${linkBtn('https://www.serviciodeempleo.gov.co/', L({ es: 'Servicio de Empleo', en: 'Employment Service' }), 'sm red')}${linkBtn('https://agenciapublicadeempleo.sena.edu.co/', L({ es: 'Agencia de Empleo SENA', en: 'SENA Jobs Agency' }), 'sm')}</div>
  </div>`;

function featureView(id, data, o) {
  return `${head(id, L(o.title), L(o.sub))}
  <div class="hero" style="min-height:260px" ${photo(o.ph)}><div class="in"><span class="kicker">${L(o.kicker)}</span><h1 style="font-size:2.3rem">${L(o.h1)}</h1><p>${L(o.p)}</p></div></div>
  <div class="card reveal"><h3>${L({ es: 'Qué es', en: 'What it is' })}</h3><ul class="small">${data.what.map(x => `<li>${L(x)}</li>`).join('')}</ul></div>
  ${o.extra || ''}
  <div class="sec-head"><div><h2>${L({ es: 'Qué hacer', en: 'What to do' })}</h2><p>${L({ es: 'Desliza para ver más.', en: 'Swipe for more.' })}</p></div></div>
  <div class="rail">${data.doit.map(d => `<article class="place"><div class="ph" ${photo(d[2])}></div><div class="bd"><h3>${L(d[0])}</h3><p>${L(d[1])}</p></div></article>`).join('')}</div>
  <div class="sec-head"><div><h2>${L(o.tipsT)}</h2></div></div>
  <div class="status-list">${data.tips.map((t, i) => `<div class="sl reveal"><div>${num(L(t), i)}</div></div>`).join('')}</div>
  ${vidRail(id)}
  <div class="btns mt2"><button class="btn red" onclick="showOnMap('${o.mapId}')">${L({ es: 'Ver en el mapa', en: 'See on map' })}</button><a class="btn" href="https://www.youtube.com/results?search_query=${encodeURIComponent(o.yt)}" target="_blank" rel="noopener">${L({ es: 'Más en YouTube', en: 'More on YouTube' })}</a></div>`;
}
V.centro = () => featureView('centro', GS, {
  title: { es: 'El pueblo y el centro', en: 'The town & downtown' }, sub: { es: 'El parque, la iglesia, el chorizo de punta y la vida del pueblo.', en: 'The square, the church, chorizo de punta and town life.' },
  ph: 'parque', kicker: { es: 'El Carmen de Viboral', en: 'El Carmen de Viboral' }, h1: { es: 'Un pueblo para caminar', en: 'A town to walk' },
  p: { es: 'Plaza, loza, chorizo con arepa y montañas verdes a cada lado.', en: 'Square, pottery, chorizo with arepa and green hills all around.' },
  tipsT: { es: 'Consejos de latino a latino', en: 'Tips from Latinos to Latinos' }, mapId: 'parque', yt: 'El Carmen de Viboral pueblo recorrido'
});
V.ronda = () => featureView('ronda', ML, {
  title: { es: 'La loza y los talleres', en: 'Pottery & workshops' }, sub: { es: 'Más de cien años de cerámica pintada a mano.', en: 'Over a hundred years of hand-painted ceramics.' },
  ph: 'calle', kicker: { es: 'Imperdible', en: 'Must-see' }, h1: { es: 'La cuna de la cerámica', en: 'The cradle of ceramics' },
  p: { es: 'La Calle de la Cerámica, los talleres, el museo y tu propia taza pintada.', en: 'Ceramics Street, the workshops, the museum and your own painted mug.' },
  tipsT: { es: 'Consejos para ir', en: 'Tips for going' }, mapId: 'calle', yt: 'cerámica El Carmen de Viboral',
  extra: `<div class="card mt2 reveal" style="display:grid;grid-template-columns:110px 1fr;gap:14px;align-items:center"><div class="ph" style="height:110px;border-radius:12px;background:center/cover" ${photo('pintura')}></div><div><h3>Cerámicas Creare</h3><p class="small">${L({ es: 'Experiencias para pintar tu propia pieza en una finca a las afueras del pueblo. Reservas por WhatsApp.', en: 'Paint-your-own-piece experiences on a farm on the edge of town. Bookings on WhatsApp.' })}</p><div class="btns"><a class="btn sm red" href="https://ceramicas-creare.netlify.app/" target="_blank" rel="noopener">${L({ es: 'Ver la app de Creare', en: 'See the Creare app' })}</a><a class="btn sm" href="https://wa.me/573009464616" target="_blank" rel="noopener">WhatsApp</a></div></div></div>`
});
V.costa = () => featureView('costa', IS, {
  title: { es: 'Ríos y cañones', en: 'Rivers & canyons' }, sub: { es: 'El Melcocho, el Santo Domingo y paseos de un día por el Oriente.', en: 'The Melcocho, the Santo Domingo and day trips around the Oriente.' },
  ph: 'melcocho', kicker: { es: 'Paseo de un día', en: 'Day trip' }, h1: { es: 'Agua cristalina', en: 'Crystal-clear water' },
  p: { es: 'Uno de los ríos más bonitos de Antioquia nace en El Carmen. Solo con reserva.', en: 'One of Antioquia\'s most beautiful rivers rises in El Carmen. Booking only.' },
  tipsT: { es: 'Antes de ir', en: 'Before you go' }, mapId: 'melcocho', yt: 'río Melcocho El Carmen de Viboral'
});

V.move = () => `
  ${head('move', L({ es: 'Transporte', en: 'Getting around' }), L({ es: 'Cómo moverte entre El Carmen, Rionegro, el aeropuerto y Medellín.', en: 'How to get around between El Carmen, Rionegro, the airport and Medellín.' }))}
  <div class="live" style="margin-top:0">
    <div class="lc dark"><div class="lab">${L({ es: 'Bus a Medellín', en: 'Bus to Medellín' })}</div><div class="big">Flota El Carmen</div><div class="sub">${L({ es: 'Se paga con la tarjeta Cívica', en: 'Pay with the Cívica card' })}</div></div>
    <div class="lc sea"><div class="lab">${L({ es: 'Distancia a Medellín', en: 'Distance to Medellín' })}</div><div class="big">54 km</div><div class="sub">${L({ es: 'Cerca de una hora en bus', en: 'About an hour by bus' })}</div></div>
    <div class="lc c3"><div class="lab">${L({ es: 'Auxilio de transporte', en: 'Transport allowance' })}</div><div class="big">${cop(WAGE.aux)}</div><div class="sub muted">${L({ es: 'Si ganas hasta 2 mínimos', en: 'If you earn up to 2 minimums' })}</div></div>
  </div>
  <div class="card mt2 reveal">
    <h3>${L({ es: 'El bus a Medellín: Flota El Carmen', en: 'The bus to Medellín: Flota El Carmen' })}</h3>
    <ul class="small">
      <li>${L({ es: 'Sale de la terminal de Flota El Carmen en el pueblo. En Medellín para en la Terminal del Norte y en los bajos de la estación Exposiciones del Metro.', en: 'It leaves from the Flota El Carmen terminal in town. In Medellín it stops at the North Terminal and under the Exposiciones Metro station.' })}</li>
      <li>${L({ es: 'Puedes pagar el pasaje con la tarjeta Cívica del Metro de Medellín en las taquillas de la Flota. Así no cargas efectivo.', en: 'You can pay the fare with the Medellín Metro Cívica card at Flota ticket offices. That way you don\'t carry cash.' })}</li>
      <li>${L({ es: 'Pregunta el valor del pasaje y el último bus de regreso en la taquilla: cambian en temporada y los domingos.', en: 'Ask the fare and the last bus back at the ticket office: they change in high season and on Sundays.' })}</li>
    </ul>
  </div>
  <div class="card mt2 reveal">
    <h3>${L({ es: 'Al aeropuerto José María Córdova', en: 'To José María Córdova airport' })}</h3>
    <ul class="small">
      <li>${L({ es: 'El aeropuerto internacional de Medellín queda en Rionegro, muy cerca de El Carmen. Es mucho más fácil llegar desde aquí que desde Medellín.', en: 'Medellín\'s international airport is in Rionegro, very close to El Carmen. It\'s much easier to reach from here than from Medellín.' })}</li>
      <li>${L({ es: 'Puedes ir en taxi o tomar transporte a Rionegro y de allí al aeropuerto. Si vuelas temprano, reserva el taxi desde la noche anterior.', en: 'Take a taxi, or ride to Rionegro and on to the airport from there. For an early flight, book the taxi the night before.' })}</li>
      <li>${L({ es: 'El bus que va de Medellín al aeropuerto cuesta $20.000 por persona desde enero de 2026: desde El Carmen no lo necesitas.', en: 'The Medellín–airport bus costs COP 20,000 per person since January 2026: from El Carmen you don\'t need it.' })}</li>
    </ul>
  </div>
  <div class="grid g2 stack mt2">
    <div class="card reveal"><h3>${L({ es: 'Taxis', en: 'Taxis' })}</h3><p class="small">${L({ es: 'Pregunta y acuerda el precio antes de subir, sobre todo para ir a Rionegro, al aeropuerto o a una vereda. De noche es más seguro pedirlo por teléfono o aplicación.', en: 'Ask and agree the price before getting in, especially to Rionegro, the airport or a rural vereda. At night it\'s safer to book by phone or app.' })}</p></div>
    <div class="card reveal"><h3>${L({ es: 'A las veredas', en: 'To the rural veredas' })}</h3><p class="small">${L({ es: 'A las veredas van carros, camperos y chivas con horarios fijos. Pregunta en el pueblo a qué hora sale y vuelve el último.', en: 'Shared cars, jeeps and chivas run to the veredas on fixed timetables. Ask in town when the last one goes and comes back.' })}</p></div>
    <div class="card reveal"><h3>${L({ es: 'Al río Melcocho', en: 'To the Melcocho River' })}</h3><p class="small">${L({ es: 'El municipio abrió una ruta de bus directa hacia la reserva del Melcocho. Antes de ir necesitas reserva con el CAICA.', en: 'The town opened a direct bus route to the Melcocho reserve. Before going you need a booking with CAICA.' })}</p></div>
    <div class="card reveal"><h3>${L({ es: 'Moto', en: 'Motorbike' })}</h3><p class="small">${L({ es: 'Muchos se mueven en moto por el Oriente. Necesitas licencia colombiana si vives aquí, SOAT y técnico-mecánica al día. Ojo con la neblina y la lluvia.', en: 'Many people ride motorbikes around the Oriente. If you live here you need a Colombian licence, SOAT insurance and a valid inspection. Watch out for fog and rain.' })}</p></div>
  </div>
  <div class="card mt2 reveal"><h3>${L({ es: '¿Cómo llego?', en: 'How do I get there?' })}</h3>
    <label class="f">${L({ es: 'Destino', en: 'Destination' })}</label>
    <div class="row"><input id="j-to" placeholder="${L({ es: 'Ej: Calle de la Cerámica, Hospital, Terminal', en: 'E.g. Ceramics Street, Hospital, Terminal' })}"><button class="btn red" onclick="planTrip()">${L({ es: 'Buscar', en: 'Go' })}</button></div>
    <p class="small muted mt">${L({ es: 'Abre Google Maps con la ruta desde donde estás.', en: 'Opens Google Maps with a route from where you are.' })}</p>
  </div>`;

V.health = () => `
  ${head('health', L({ es: 'Salud', en: 'Health' }), L({ es: 'Dónde ir según lo que te pase.', en: 'Where to go depending on what happens.' }))}
  <div class="sosgrid">
    <a class="sosbtn" href="tel:123"><strong>123</strong><span>${L({ es: 'Emergencias', en: 'Emergencies' })}</span><small>${L({ es: 'Si es grave, llama ya', en: 'If serious, call now' })}</small></a>
    <a class="sosbtn ink" href="tel:132"><strong>132</strong><span>${L({ es: 'Cruz Roja', en: 'Red Cross' })}</span><small>${L({ es: 'Ambulancia', en: 'Ambulance' })}</small></a>
  </div>
  <div class="note red mt2">${L({ es: '<b>En urgencias te tienen que atender</b>, aunque no tengas papeles, EPS ni plata. La atención inicial de urgencias es obligatoria en Colombia.', en: '<b>The ER must treat you</b>, even without papers, insurance or money. Initial emergency care is mandatory in Colombia.' })}</div>
  <div class="status-list mt2">
    <div class="sl reveal"><div><b>E.S.E. Hospital San Juan de Dios de El Carmen de Viboral</b><small>${L({ es: 'El hospital público del municipio, con urgencias. Carrera 31 # 19-58, barrio Ospina.', en: 'The town\'s public hospital, with an ER. Carrera 31 # 19-58, Ospina neighbourhood.' })}</small></div><a class="call" href="${gmaps('ESE Hospital San Juan de Dios, Carrera 31 # 19-58, El Carmen de Viboral')}" target="_blank" rel="noopener">${L({ es: 'Mapa', en: 'Map' })}</a></div>
    <div class="sl reveal"><div><b>E.S.E. Hospital San Juan de Dios de Rionegro</b><small>${L({ es: 'En la ciudad vecina, a unos 20 minutos. Rionegro también tiene clínicas privadas de mayor complejidad.', en: 'In the neighbouring city, about 20 minutes away. Rionegro also has larger private clinics.' })}</small></div><a class="call ink" href="${gmaps('ESE Hospital San Juan de Dios de Rionegro')}" target="_blank" rel="noopener">${L({ es: 'Mapa', en: 'Map' })}</a></div>
  </div>
  <div class="note mt2">${L({ es: 'Ojo con las estafas: ningún hospital público cobra por darte una cita ni un puesto de trabajo.', en: 'Beware of scams: no public hospital charges you for an appointment or a job.' })}</div>
  <div class="card mt2 reveal">
    <h3>${L({ es: 'Cómo afiliarte a salud', en: 'How to get health cover' })}</h3>
    <ol class="small">
      <li>${L({ es: 'Con PPT, visa o cédula pide la <b>encuesta del SISBEN</b> en la Alcaldía.', en: 'With a PPT, visa or Colombian ID, request the <b>SISBEN survey</b> from the city.' })}</li>
      <li>${L({ es: 'Si quedas clasificado, te afilias a una EPS del régimen subsidiado sin pagar.', en: 'If you qualify, you join a subsidised EPS insurer at no cost.' })}</li>
      <li>${L({ es: 'Si tienes contrato de trabajo, el empleador te afilia a una EPS del régimen contributivo.', en: 'If you have a job contract, your employer enrols you in a contributory EPS.' })}</li>
      <li>${L({ es: 'Las vacunas del esquema nacional son gratis para todos los niños, tengan o no papeles.', en: 'National-schedule vaccines are free for all children, with or without papers.' })}</li>
    </ol>
  </div>
  <div class="card mt2 reveal"><h3>${L({ es: 'Ojo con el frío y la lluvia', en: 'Watch out for cold and rain' })}</h3><p class="small">${L({ es: 'En el altiplano son comunes la gripa y las infecciones respiratorias, sobre todo en niños y adultos mayores. Abrígate en la noche y la madrugada, ventila la casa y, si un niño tiene fiebre alta, respira rápido o no quiere comer, llévalo a urgencias.', en: 'Colds and respiratory infections are common on the highlands, especially in children and older people. Wrap up at night and early morning, air the house and, if a child has a high fever, breathes fast or won\'t eat, take them to the ER.' })}</p></div>`;

V.weather = () => `
  ${head('weather', L({ es: 'Clima y festivos', en: 'Weather & holidays' }), L({ es: 'Clima frío de montaña todo el año, en el altiplano del Oriente. Llueve más entre abril y mayo y entre octubre y noviembre.', en: 'Cool mountain climate all year, on the Oriente highlands. It rains most in April–May and October–November.' }))}
  <div class="card dark"><div class="small" style="opacity:.75">${L({ es: 'Pronóstico en El Carmen de Viboral', en: 'El Carmen de Viboral forecast' })}</div><div class="big" id="wx-now2" style="font-family:'Barlow Condensed';font-size:2.4rem;font-weight:800"><span class="spin"></span></div><div class="days" id="wx-days"></div></div>
  <div class="note mt2">${L({ es: 'Con aguaceros fuertes los ríos del Oriente crecen de golpe y puede haber derrumbes en las vías. Sigue los avisos de la Alcaldía y de Cornare y no cruces quebradas crecidas.', en: 'In heavy rain the Oriente\'s rivers rise suddenly and roads can have landslides. Follow town hall and Cornare alerts and never cross a swollen stream.' })}</div>
  <div class="card mt2 reveal"><h3>${L({ es: 'Qué empacar', en: 'What to pack' })}</h3><ul class="small">
    <li>${L({ es: 'Ropa por capas: chaqueta, saco y algo impermeable. Días templados y noches frías.', en: 'Layers: a jacket, a jumper and something waterproof. Mild days and cold nights.' })}</li>
    <li>${L({ es: 'Bloqueador igual: el sol de montaña quema aunque haga frío. Repelente para los paseos a los ríos.', en: 'Sunscreen anyway: mountain sun burns even when it\'s cold. Repellent for river trips.' })}</li>
    <li>${L({ es: 'Paraguas o capa, y zapatos que no se mojen.', en: 'An umbrella or poncho, and waterproof shoes.' })}</li>
    <li>${L({ es: 'Una muda formal para entrevistas y citas en Migración.', en: 'One smart outfit for interviews and Migración appointments.' })}</li>
    <li>${L({ es: 'Documentos apostillados (nacimiento, antecedentes, títulos) si vas a hacer trámites.', en: 'Apostilled documents (birth, police record, diplomas) if you\'ll do paperwork.' })}</li>
  </ul></div>
  <div class="sec-head"><div><h2>${L({ es: 'Festivos', en: 'Public holidays' })}</h2><p id="next-hol"></p></div></div>
  <div class="status-list" id="hol-list"></div>
  <p class="small muted mt">${L({ es: 'En Colombia muchos festivos se pasan al lunes (Ley Emiliani). El martes 8 de diciembre de 2026 es festivo en todo el país.', en: 'In Colombia many holidays move to Monday (Emiliani Law). Tuesday 8 December 2026 is a nationwide holiday.' })}</p>`;

V.map = () => `
  ${head('map', L({ es: 'Mapa de El Carmen y el Oriente', en: 'Map of El Carmen & the Oriente' }), L({ es: 'Toca un punto para ver detalles y la ruta.', en: 'Tap a point for details and directions.' }))}
  <div class="chips" id="map-chips">
    ${[['all', { es: 'Todo', en: 'All' }], ['city', { es: 'Pueblo', en: 'Town' }], ['nature', { es: 'Ríos y paseos', en: 'Rivers & trips' }], ['help', { es: 'Salud y trámites', en: 'Health & offices' }]].map((c, i) => `<button data-c="${c[0]}" class="${i ? '' : 'on'}" onclick="mapFilter('${c[0]}')">${L(c[1])}</button>`).join('')}
  </div>
  <div id="map"></div>
  <div class="btns"><button class="btn red sm" onclick="locateMe()">${L({ es: 'Dónde estoy', en: 'Where am I' })}</button><a class="btn sm ghost" href="${gmaps(CITY)}" target="_blank" rel="noopener">${L({ es: 'Abrir en Google Maps', en: 'Open in Google Maps' })}</a></div>`;

V.media = () => `
  ${head('media', L({ es: 'Fotos y videos', en: 'Photos & videos' }), L({ es: 'Fotos reales de Wikimedia Commons y de Cerámicas Creare. Toca una para ver ese lugar en el mapa.', en: 'Real photos from Wikimedia Commons and Cerámicas Creare. Tap one to see that place on the map.' }))}
  <div class="gal">${PLACES.map(p => `<figure ${photo(p.id)} onclick="showOnMap('${p.id}')"><figcaption>${L(p.n)}</figcaption></figure>`).join('')}
    <figure ${photo('pintura')} onclick="go('ronda')"><figcaption>${L({ es: 'Plato pintado en Creare', en: 'Plate painted at Creare' })}</figcaption></figure>
    <figure ${photo('loza')} onclick="go('ronda')"><figcaption>${L({ es: 'Loza de El Carmen', en: 'El Carmen pottery' })}</figcaption></figure>
    <figure ${photo('iglesia')} onclick="go('centro')"><figcaption>${L({ es: 'Iglesia de Nuestra Señora del Carmen', en: 'Church of Our Lady of Carmen' })}</figcaption></figure>
    <figure ${photo('hortensia')}><figcaption>${L({ es: 'Hortensias, la flor de los platos', en: 'Hydrangeas, the flower on the plates' })}</figcaption></figure>
    <figure ${photo('bandeja')}><figcaption>${L({ es: 'Bandeja paisa', en: 'Bandeja paisa' })}</figcaption></figure>
    <figure ${photo('campo')} onclick="go('costa')"><figcaption>${L({ es: 'Campo del Oriente', en: 'Oriente countryside' })}</figcaption></figure></div>
  <div class="sec-head"><div><h2>${L({ es: 'Videos nuevos', en: 'New videos' })}</h2><p id="rv-note">${L({ es: 'El robot los busca en YouTube cada 30 minutos.', en: 'The robot looks for them on YouTube every 30 minutes.' })}</p></div></div>
  <div class="vids" id="robot-vids"></div>
  <div class="sec-head"><div><h2>${L({ es: 'Videos de El Carmen', en: 'El Carmen videos' })}</h2><p>${L({ es: 'Toca uno para verlo aquí mismo.', en: 'Tap one to watch it right here.' })}</p></div></div>
  <div class="vids">${VIDEO_LIB.map(vidCard).join('')}</div>
  <div class="btns mt2"><a class="btn" href="https://www.youtube.com/results?search_query=${encodeURIComponent('El Carmen de Viboral')}" target="_blank" rel="noopener">${L({ es: 'Más en YouTube', en: 'More on YouTube' })}</a></div>`;


V.sos = () => `
  ${head('sos', 'SOS', L({ es: 'Toca un número para llamar.', en: 'Tap a number to call.' }))}
  <div class="sosgrid">${EMERG.map(e => `<a class="sosbtn ${e.cls}" href="tel:${e.n}"><strong>${e.n}</strong><span>${L(e.t)}</span><small>${L(e.s)}</small></a>`).join('')}</div>
  <div class="sec-head"><div><h2>${L({ es: 'Ayuda y oficinas', en: 'Help & offices' })}</h2></div></div>
  <div class="status-list">${OFFICES.filter(o => o.telS).map(o => `<div class="sl"><div><b>${L(o.n)}</b><small>${esc(o.telS)}</small></div><a class="call ink" href="tel:${o.tel}">${L({ es: 'Llamar', en: 'Call' })}</a></div>`).join('')}
    <div class="sl"><div><b>${L({ es: 'Fiscalía (denuncias)', en: 'Attorney General (crime reports)' })}</b><small>122</small></div><a class="call ink" href="tel:122">${L({ es: 'Llamar', en: 'Call' })}</a></div>
  </div>
  <div class="note mt2">${L({ es: 'Si eres de otro país, busca el consulado de tu país en Colombia en la web de tu cancillería y guárdalo en tus contactos.', en: 'If you\'re from another country, find your consulate in Colombia on your foreign ministry\'s site and save it to your contacts.' })}</div>
  <div class="btns"><button class="btn red block" onclick="openShow()">${L({ es: 'Me perdí: mostrar mi dirección', en: 'I\'m lost: show my address' })}</button></div>`;

let talkTab = 'cos';
V.talk = () => `
  ${head('talk', L({ es: 'Hablar paisa', en: 'Speak paisa' }), L({ es: 'En El Carmen se habla español paisa, con su "pues" y su "¡Ave María!". Y para trabajar con turistas en los almacenes de loza y los paseos, el inglés vale oro. Toca "Oír" para escuchar.', en: 'El Carmen speaks paisa Spanish, with its "pues" and "¡Ave María!". And for working with tourists in pottery shops and on tours, English is gold. Tap "Hear" to listen.' }))}
  <div class="tabsx" id="talk-tabs">
    <button data-k="cos" onclick="setTalk('cos')">${L({ es: 'Paisa', en: 'Paisa' })}</button>
    <button data-k="dlg" onclick="setTalk('dlg')">${L({ es: 'Conversaciones', en: 'Dialogues' })}</button>
    <button data-k="ve" onclick="setTalk('ve')">${L({ es: 'De Venezuela a Colombia', en: 'Venezuela to Colombia' })}</button>
    <button data-k="en" onclick="setTalk('en')">${L({ es: 'Inglés para trabajar', en: 'English for work' })}</button>
  </div>
  <div id="talk-body"></div>`;
function talkBody() {
  const q = s => JSON.stringify(s).replace(/"/g, '&quot;');
  if (talkTab === 'cos') return `<div class="phr">${COSTENO.map(p => `<div class="ph1"><div><div class="o">${esc(p[0])}</div><div class="tr">${esc(LANG === 'es' ? p[1] : p[2])}</div><div class="say">"${esc(p[3])}"</div></div><button onclick="say(${q(p[3])},'es')">${L({ es: 'Oír', en: 'Hear' })}</button></div>`).join('')}</div>`;
  if (talkTab === 've') return `<p class="small muted mt">${L({ es: 'Palabras que cambian de un país a otro. Así te entienden más rápido.', en: 'Words that change from one country to the other. People will get you faster.' })}</p><div class="status-list mt">${VECO.map(p => `<div class="sl"><div><b>${esc(p[0])}</b><small>${L({ es: 'En Venezuela', en: 'In Venezuela' })}</small></div><div style="text-align:right"><b>${esc(p[1])}</b><small>${LANG === 'en' ? esc(p[2]) : L({ es: 'En Colombia', en: '' })}</small></div></div>`).join('')}</div>`;
  if (talkTab === 'en') return `<div class="phr">${ENG.map(p => `<div class="ph1"><div><div class="o">${esc(p[0])}</div><div class="tr">${esc(p[1])}</div><div class="say">${esc(p[2])}</div></div><button onclick="say(${q(p[0])},'en')">${L({ es: 'Oír', en: 'Hear' })}</button></div>`).join('')}</div><p class="small muted mt">${L({ es: 'La pronunciación es aproximada; la sílaba en mayúscula es la fuerte.', en: 'Pronunciation is approximate; the capitalised syllable is stressed.' })}</p>`;
  return DIALOGS.map(d => `<div class="card mt reveal in"><h3>${L(d.t)}</h3>${d.l.map(x => `<div class="dlg ${x[0]}">${esc(x[1])}${LANG === 'en' ? `<em>${esc(x[2])}</em>` : ''}</div>`).join('')}</div>`).join('');
}
function setTalk(k) { talkTab = k; const b = $('#talk-body'); if (b) b.innerHTML = talkBody(); $$('#talk-tabs button').forEach(x => x.classList.toggle('on', x.dataset.k === k)); }
function say(text, lang) {
  if (!('speechSynthesis' in window)) { toast(L({ es: 'Tu celular no tiene voz disponible', en: 'No voice available on this device' })); return; }
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang === 'en' ? 'en-US' : 'es-CO'; u.rate = .9;
  speechSynthesis.cancel(); speechSynthesis.speak(u);
}

V.money = () => `
  ${head('money', L({ es: 'Peso colombiano y cambio', en: 'Colombian peso & exchange' }), L({ es: 'En Colombia se paga en pesos (COP). Precios con punto de miles: $3.900 son tres mil novecientos pesos.', en: 'Colombia pays in pesos (COP). Prices use a dot for thousands: $3.900 means three thousand nine hundred pesos.' }))}
  <div class="live" style="margin-top:0">
    <div class="lc dark"><div class="lab">${L({ es: '1 dólar (USD)', en: '1 US dollar' })}</div><div class="big" id="fx-usd2"><span class="spin"></span></div><div class="sub" id="fx-sub2"></div></div>
    <div class="lc sea"><div class="lab">${L({ es: '1 euro (EUR)', en: '1 euro' })}</div><div class="big" id="fx-eur"><span class="spin"></span></div><div class="sub">${L({ es: 'Tasa del día', en: 'Today\'s rate' })}</div></div>
    <div class="lc c3"><div class="lab">${L({ es: '100 bolívares (VES)', en: '100 bolívars (VES)' })}</div><div class="big" id="fx-ves"><span class="spin"></span></div><div class="sub muted">${L({ es: 'Tasa de referencia', en: 'Reference rate' })}</div></div>
  </div>
  <div class="card mt2 reveal">
    <h3>${L({ es: 'Convertidor', en: 'Converter' })}</h3>
    <div class="grid g2"><div><label class="f">${L({ es: 'Cantidad', en: 'Amount' })}</label><input id="fx-amt" type="number" value="100000" min="0" oninput="convert()"></div>
    <div><label class="f">${L({ es: 'Moneda', en: 'Currency' })}</label><select id="fx-from" onchange="convert()"><option value="COP">${L({ es: 'Peso colombiano (COP)', en: 'Colombian peso (COP)' })}</option><option value="USD">${L({ es: 'Dólar (USD)', en: 'US dollar (USD)' })}</option><option value="EUR">Euro (EUR)</option><option value="VES">${L({ es: 'Bolívar (VES)', en: 'Bolívar (VES)' })}</option></select></div></div>
    <div id="fx-out" class="mt"></div>
  </div>
  <div class="card mt2 reveal"><h3>${L({ es: 'Consejos', en: 'Tips' })}</h3><ul class="small">
    <li>${L({ es: 'Cambia dinero solo en casas de cambio autorizadas o bancos, nunca con cambistas en la calle.', en: 'Change money only at authorised exchange houses or banks, never with street changers.' })}</li>
    <li>${L({ es: 'Revisa los billetes de $50.000 y $100.000: hay falsos. Mira la marca de agua y el hilo de seguridad.', en: 'Check COP 50,000 and 100,000 notes: fakes circulate. Look at the watermark and security thread.' })}</li>
    <li>${L({ es: 'Nequi y Daviplata abren cuenta con PPT desde el celular y sirven para cobrar, pagar y enviar plata.', en: 'Nequi and Daviplata open accounts with a PPT from your phone, to get paid, pay and send money.' })}</li>
    <li>${L({ es: 'Para enviar plata a tu país compara comisiones y tasa entre agencias de giros y apps antes de mandar.', en: 'To send money home, compare fees and rates between remittance agencies and apps first.' })}</li>
    <li>${L({ es: 'En los almacenes de loza algunos cobran en dólares a turistas, pero tú paga en pesos: casi siempre sale más barato.', en: 'In pottery shops some charge tourists in dollars, but you pay in pesos: it\'s almost always cheaper.' })}</li>
  </ul></div>`;

let lifeTab = 'housing';
V.life = () => `
  ${head('life', L({ es: 'Vivir en El Carmen', en: 'Living in El Carmen' }), L({ es: 'Lo que nadie te cuenta al llegar.', en: 'What nobody tells you when you arrive.' }))}
  <div class="tabsx" id="life-tabs">${Object.keys(LIFE).map(k => `<button data-k="${k}" onclick="setLife('${k}')">${L(LIFE[k].t)}</button>`).join('')}</div>
  <div id="life-body" class="mt"></div>
  ${vidRail('vida')}`;
function lifeBody() {
  const x = LIFE[lifeTab];
  return `<div class="hero" style="min-height:190px" ${photo(x.ph)}><div class="in"><h1 style="font-size:2rem">${L(x.t)}</h1></div></div>
  <div class="status-list">${x.items.map((it, i) => `<div class="sl"><div>${num(L(it), i)}</div></div>`).join('')}</div>`;
}
function setLife(k) { lifeTab = k; const b = $('#life-body'); if (b) { b.innerHTML = lifeBody(); paintPhotos(b); } $$('#life-tabs button').forEach(x => x.classList.toggle('on', x.dataset.k === k)); }


V.first = () => `
  ${head('first', L({ es: 'Primeros días', en: 'First days' }), L({ es: 'Marca cada paso. Tu avance se guarda en el celular.', en: 'Tick each step. Your progress is saved on your phone.' }))}
  <div class="progress"><i id="chk-bar"></i></div><p class="small muted mt" id="chk-txt"></p>
  <div class="status-list mt">${FIRST.map((f, i) => { const x = L(f); return `<label class="chk" id="chk-${i}"><input type="checkbox" onchange="tick(${i},this.checked)"><div><b>${esc(x[0])}</b><div class="small muted">${esc(x[1])}</div></div></label>`; }).join('')}</div>`;


/* ---------- Videos (reproductor dentro de la app) ---------- */
const ytThumb = id => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
function vidCard(v) {
  const title = typeof v.t === 'object' ? L(v.t) : (v.titulo || '');
  const sub = v.canal ? esc(v.canal) + (v.hace ? ' · ' + esc(v.hace) : '') : 'YouTube';
  return `<button class="vid" style="--fb:#111;background-image:url('${ytThumb(v.id)}')" onclick="playVideo('${v.id}')"><span class="playc"></span><div><b>${esc(title)}</b><small>${sub}</small></div></button>`;
}
function vidRail(k) {
  const vs = VIDEO_LIB.filter(v => v.k === k); if (!vs.length) return '';
  return `<div class="sec-head"><div><h2>${L({ es: 'Videos', en: 'Videos' })}</h2><p>${L({ es: 'Toca uno para verlo aquí mismo.', en: 'Tap one to watch it right here.' })}</p></div></div><div class="vids">${vs.map(vidCard).join('')}</div>`;
}
function videoOfDay() { const n = Math.floor(new Date(todayISO() + 'T00:00:00Z') / 864e5); return VIDEO_LIB[n % VIDEO_LIB.length]; }
function playVideo(id) {
  const m = $('#player'); if (!m) return;
  $('#player-frame').innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1" title="YouTube" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
  $('#player-yt').href = 'https://www.youtube.com/watch?v=' + id;
  m.classList.add('on');
}
function closeVideo() { const m = $('#player'); if (!m) return; m.classList.remove('on'); $('#player-frame').innerHTML = ''; }

/* ---------- Noticias y videos del robot (GitHub Actions cada 30 min) ---------- */
let NEWS = store.get('news', null), RVIDS = store.get('rvids', null);
function ago(iso) {
  if (!iso) return '';
  const m = Math.max(0, Math.round((Date.now() - new Date(iso)) / 6e4));
  if (m < 60) return L({ es: 'hace ' + m + ' min', en: m + ' min ago' });
  const h = Math.round(m / 60); if (h < 48) return L({ es: 'hace ' + h + ' h', en: h + ' h ago' });
  return new Intl.DateTimeFormat(LANG === 'es' ? 'es-CO' : 'en-GB', { day: 'numeric', month: 'short', timeZone: ZONE }).format(new Date(iso));
}
function paintNews() {
  const box = $('#news-list'); if (!box) return;
  const list = (NEWS && NEWS.noticias || []).slice(0, 6);
  box.innerHTML = list.length ? list.map(n => `<a class="sl" href="${esc(n.enlace)}" target="_blank" rel="noopener" style="color:inherit"><div><b>${esc(n.titulo)}</b><small>${esc(n.medio)} · ${ago(n.fecha)}</small></div></a>`).join('')
    : `<div class="sl"><div><small>${L({ es: 'Sin noticias por ahora. Toca Actualizar.', en: 'No news yet. Tap Refresh.' })}</small></div></div>`;
  const meta = $('#news-meta'); if (meta) meta.textContent = NEWS && NEWS.revisado ? L({ es: 'El robot revisó las noticias ', en: 'The robot checked the news ' }) + ago(NEWS.revisado) + L({ es: ' · hora Colombia', en: ' · Colombia time' }) : '';
}
function paintRobotVids() {
  const box = $('#robot-vids'); if (!box) return;
  const vs = (RVIDS && RVIDS.videos || []).slice(0, 8);
  box.innerHTML = vs.length ? vs.map(vidCard).join('') : `<p class="small muted">${L({ es: 'El robot todavía no ha traído videos nuevos. Mira los de abajo.', en: 'The robot hasn\'t brought new videos yet. See the ones below.' })}</p>`;
}
async function loadNews(manual) {
  if (manual) { const b = $('#news-list'); if (b) b.innerHTML = '<div class="sl"><span class="spin"></span></div>'; }
  try { NEWS = await getJSON('data/noticias.json?v=' + Date.now()); store.set('news', NEWS); } catch (e) {}
  paintNews(); buildTicker();
  if (manual) toast(L({ es: 'Noticias al día', en: 'News updated' }));
}
async function loadRobotVids() {
  try { RVIDS = await getJSON('data/videos.json?v=' + Date.now()); store.set('rvids', RVIDS); } catch (e) {}
  paintRobotVids();
}

/* ---------- Render y navegación ---------- */
const VIEWS = ['home', 'papers', 'work', 'feria', 'ronda', 'centro', 'costa', 'places', 'move', 'health', 'sos', 'talk', 'money', 'life', 'weather', 'first', 'map', 'media'];
let current = 'home';
function render() {
  document.documentElement.lang = LANG;
  $$('[data-t]').forEach(el => { const k = el.dataset.t; if (T[k]) el.textContent = L(T[k]); });
  $('#lang-es').classList.toggle('on', LANG === 'es'); $('#lang-en').classList.toggle('on', LANG === 'en');
  $('#main').innerHTML = VIEWS.map(v => `<section class="view ${v === current ? 'on' : ''}" id="v-${v}">${V[v]()}</section>`).join('');
  $('#upd').textContent = VERIFIED + ' · ' + L({ es: 'hora Colombia', en: 'Colombia time' });
  setTalk(talkTab); setLife(lifeTab); paintNews(); paintRobotVids(); renderAlert(); renderHolidays(); renderFiestas(); restoreChecks(); calcWage(); renderCities();
  if (WX) paintWeather(); paintFX();
  tickClock(); buildTicker(); observeReveal(); paintPhotos();
  map = null; if (current === 'map') setTimeout(initMap, 50);
}
function go(v) {
  if (!VIEWS.includes(v)) v = 'home';
  current = v;
  $$('section.view').forEach(s => s.classList.toggle('on', s.id === 'v-' + v));
  $$('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.v === v));
  if (location.hash.slice(1) !== v) history.replaceState(null, '', v === 'home' ? location.pathname : '#' + v);
  window.scrollTo(0, 0);
  if (v === 'map') setTimeout(initMap, 60);
  observeReveal();
}
function setLang(l) { LANG = l; store.set('lang', l); render(); }
function observeReveal() {
  const els = $$('.view.on .reveal:not(.in)');
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .08 });
  els.forEach(e => io.observe(e));
}

/* ---------- Hero en movimiento ---------- */
const HERO = ['pintura', 'calle', 'parque', 'loza', 'melcocho', 'iglesia', 'plato', 'carmen'];
let heroI = 0, heroTimer = null;
function heroSetup() {
  const h = $('#hero'); if (!h) return;
  const ready = HERO.filter(k => PHOTO_CACHE[k]);
  if (!ready.length || h.dataset.n == ready.length) return;
  h.dataset.n = ready.length;
  $$('.slide', h).forEach(s => s.remove());
  ready.forEach((k, i) => { const s = document.createElement('div'); s.className = 'slide' + (i === 0 ? ' on' : ''); s.style.backgroundImage = `url("${PHOTO_CACHE[k]}")`; s.dataset.k = k; h.prepend(s); });
  $('#hero-dots').innerHTML = ready.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('');
  heroI = 0; heroCaption(ready[0]);
  clearInterval(heroTimer);
  if (ready.length > 1) heroTimer = setInterval(() => {
    const ss = $$('#hero .slide'); if (!ss.length) return;
    const order = ss.slice().reverse();
    order[heroI].classList.remove('on'); heroI = (heroI + 1) % order.length; order[heroI].classList.add('on');
    $$('#hero-dots i').forEach((d, i) => d.classList.toggle('on', i === heroI));
    heroCaption(order[heroI].dataset.k);
  }, 6000);
}
function heroCaption(k) { const p = PLACES.find(x => x.id === k); const c = $('#hero-cap'); if (c) c.textContent = (p ? L(p.n) + ' · ' : '') + (FIXED_PH[k] ? L({ es: 'Foto: Cerámicas Creare', en: 'Photo: Cerámicas Creare' }) : L({ es: 'Foto: Wikimedia Commons', en: 'Photo: Wikimedia Commons' })); }

/* ---------- Plazos: cuenta regresiva ---------- */
function renderAlert() {
  const d0 = activeDeadline();
  const html = d0 ? (() => {
    const left = d0.end - Date.now();
    const d = Math.floor(left / 864e5), h = Math.floor(left / 36e5) % 24, m = Math.floor(left / 6e4) % 60;
    return `<div class="alert" onclick="go('papers')"><div><span class="kicker" style="background:#fff;color:var(--red)">${esc(d0.k)}</span><b>${L(d0.t)}</b><div class="small" style="opacity:.92;margin-top:4px">${L(d0.s)}</div></div>
      <div class="count"><div><strong>${d}</strong><small>${L({ es: 'días', en: 'days' })}</small></div><div><strong>${h}</strong><small>${L({ es: 'horas', en: 'hours' })}</small></div><div><strong>${m}</strong><small>min</small></div></div></div>`;
  })() : `<div class="alert closed" onclick="go('papers')"><div><span class="kicker">${L({ es: 'Papeles', en: 'Papers' })}</span><b>${L({ es: 'Revisa las vías vigentes de regularización', en: 'Check the current regularization routes' })}</b><div class="small" style="opacity:.9;margin-top:4px">${L({ es: 'Los plazos de 2026 ya vencieron. Consulta novedades en migracioncolombia.gov.co.', en: 'The 2026 deadlines have passed. Check for news at migracioncolombia.gov.co.' })}</div></div></div>`;
  ['#alert', '#alert2'].forEach(s => { const e = $(s); if (e) e.innerHTML = html; });
}

/* ---------- Relojes y franja "Hoy" ---------- */
function tzf(zone, o) { return new Intl.DateTimeFormat(LANG === 'es' ? 'es-CO' : 'en-GB', { timeZone: zone, ...o }).format(new Date()); }
function tickClock() {
  const co = $('#clk-co'); if (co) co.textContent = tzf(ZONE, { hour: '2-digit', minute: '2-digit', hour12: false });
  const ve = $('#clk-ve'); if (ve) ve.textContent = L({ es: 'Caracas: ', en: 'Caracas: ' }) + tzf(ZONE_VE, { hour: '2-digit', minute: '2-digit', hour12: false }) + L({ es: ' · Venezuela va 1 hora adelante', en: ' · Venezuela is 1 hour ahead' });
}
const todayISO = () => new Intl.DateTimeFormat('en-CA', { timeZone: ZONE }).format(new Date());
function nextHoliday() { const iso = todayISO(); return HOLIDAYS.find(h => h[0] >= iso) || null; }
function dateLabel(iso) { const [y, m, d] = iso.split('-').map(Number); return new Intl.DateTimeFormat(LANG === 'es' ? 'es-CO' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(Date.UTC(y, m - 1, d)); }
function daysTo(iso) { const now = new Date(todayISO() + 'T00:00:00Z'); return Math.round((new Date(iso + 'T00:00:00Z') - now) / 864e5); }
function buildTicker() {
  const parts = [];
  parts.push(`<span><i class="dot"></i>${L({ es: 'Hoy en El Carmen', en: 'Today in El Carmen' })}: <b>${tzf(ZONE, { weekday: 'long', day: 'numeric', month: 'long' })}</b></span>`);
  if (NEWS && NEWS.noticias && NEWS.noticias[0]) parts.push(`<span>${L({ es: 'Noticia', en: 'News' })}: <b>${esc(NEWS.noticias[0].titulo)}</b></span>`);
  const d0 = activeDeadline();
  if (d0) parts.push(`<span>${esc(d0.k)}: <b>${L({ es: 'quedan ' + Math.ceil((d0.end - Date.now()) / 864e5) + ' días ', en: Math.ceil((d0.end - Date.now()) / 864e5) + ' days left ' })}${L(d0.tk)}</b></span>`);
  if (WX) parts.push(`<span>${L({ es: 'Clima', en: 'Weather' })}: <b>${Math.round(WX.current.temperature_2m)} °C</b>, ${L({ es: 'sensación', en: 'feels' })} ${Math.round(WX.current.apparent_temperature)} °C</span>`);
  if (FX && FX.COP) parts.push(`<span>1 USD = <b>${cop(FX.COP)}</b></span>`);
  const nf = nextFiesta(); if (nf) parts.push(`<span>${L({ es: 'Agenda', en: 'Coming up' })}: <b>${L(nf[1])}</b> (${fiestaIn(nf)})</span>`);
  const nh = nextHoliday(); if (nh) parts.push(`<span>${L({ es: 'Próximo festivo', en: 'Next holiday' })}: <b>${L(nh[1])}</b> (${daysTo(nh[0]) === 0 ? L({ es: 'hoy', en: 'today' }) : L({ es: 'en ' + daysTo(nh[0]) + ' días', en: 'in ' + daysTo(nh[0]) + ' days' })})</span>`);
  
  parts.push(`<span>${L({ es: 'Plan gratis', en: 'Free plan' })}: <b>${L({ es: 'Calle de la Cerámica', en: 'Ceramics Street' })}</b> ${L({ es: 'fachadas de loza pintada', en: 'painted pottery façades' })}</span>`);
  parts.push(`<span>${L({ es: 'Emergencias', en: 'Emergencies' })}: <b>123</b></span>`);
  parts.push(`<span>${L({ es: 'Bus a Medellín', en: 'Bus to Medellín' })}: <b>Flota El Carmen</b> ${L({ es: 'con Cívica', en: 'with Cívica' })}</span>`);
  parts.push(`<span>${L({ es: 'Salario mínimo 2026', en: '2026 minimum wage' })}: <b>${cop(WAGE.month)}</b></span>`);
  const t = $('#ticker'); if (t) t.innerHTML = parts.join('');
}

/* ---------- Clima en vivo (Open-Meteo) ---------- */
let WX = store.get('wx', null);
const WCODE = c => c === 0 ? { es: 'Despejado', en: 'Clear' } : c <= 3 ? { es: 'Parcialmente nublado', en: 'Partly cloudy' } : c <= 48 ? { es: 'Neblina', en: 'Fog' } : c <= 67 ? { es: 'Lluvia', en: 'Rain' } : c <= 82 ? { es: 'Chubascos', en: 'Showers' } : { es: 'Tormenta', en: 'Thunderstorm' };
async function loadWeather() {
  try {
    WX = await getJSON('https://api.open-meteo.com/v1/forecast?latitude=6.0828&longitude=-75.3347&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=America%2FBogota&forecast_days=5');
    store.set('wx', WX); paintWeather(); buildTicker();
  } catch (e) { if (!WX) $$('#wx-now,#wx-now2').forEach(x => x.textContent = '--'); }
}
function paintWeather() {
  if (!WX || !WX.current) return;
  const c = WX.current, txt = Math.round(c.temperature_2m) + ' °C';
  const a = $('#wx-now'); if (a) a.textContent = txt;
  const s = $('#wx-sub'); if (s) s.textContent = L(WCODE(c.weather_code)) + ' · ' + L({ es: 'sensación ', en: 'feels ' }) + Math.round(c.apparent_temperature) + ' °C';
  const b = $('#wx-now2'); if (b) b.textContent = txt + ' · ' + L(WCODE(c.weather_code));
  const d = $('#wx-days'); if (d && WX.daily) d.innerHTML = WX.daily.time.map((t, i) => `<div>${new Intl.DateTimeFormat(LANG === 'es' ? 'es-CO' : 'en-GB', { weekday: 'short', timeZone: 'UTC' }).format(new Date(t + 'T12:00:00Z'))}<b>${Math.round(WX.daily.temperature_2m_max[i])}°</b>${Math.round(WX.daily.temperature_2m_min[i])}° · ${WX.daily.precipitation_probability_max[i] ?? 0}%</div>`).join('');
}

/* ---------- Cambio en vivo ---------- */
let FX = store.get('fx', null);
async function loadFX() {
  try {
    const j = await getJSON('https://open.er-api.com/v6/latest/USD');
    if (j && j.rates && j.rates.COP) { FX = { COP: j.rates.COP, EUR: j.rates.EUR, VES: j.rates.VES, t: j.time_last_update_utc }; store.set('fx', FX); }
  } catch (e) {}
  paintFX(); buildTicker();
}
function paintFX() {
  const ok = FX && FX.COP;
  ['#fx-usd', '#fx-usd2'].forEach(s => { const e = $(s); if (e) e.textContent = ok ? cop(FX.COP) : '--'; });
  const sub = ok ? L({ es: 'pesos colombianos · tasa del día', en: 'Colombian pesos · today\'s rate' }) : L({ es: 'Sin conexión: conecta para ver la tasa', en: 'Offline: connect to see the rate' });
  ['#fx-sub', '#fx-sub2'].forEach(s => { const e = $(s); if (e) e.textContent = sub; });
  const eu = $('#fx-eur'); if (eu) eu.textContent = ok && FX.EUR ? cop(FX.COP / FX.EUR) : '--';
  const vs = $('#fx-ves'); if (vs) vs.textContent = ok && FX.VES ? cop(100 * FX.COP / FX.VES) : '--';
  const wu = $('#wage-usd'); if (wu && ok) wu.textContent = L({ es: 'Salario ÷ 210 h · mínimo ≈ US$', en: 'Wage ÷ 210 h · minimum ≈ US$' }) + fmt(WAGE.month / FX.COP, 0);
  convert(); calcWage();
}
function convert() {
  const o = $('#fx-out'); if (!o) return;
  const amt = parseFloat($('#fx-amt').value) || 0, from = $('#fx-from').value;
  const perUSD = { USD: 1, COP: FX && FX.COP, EUR: FX && FX.EUR, VES: FX && FX.VES };
  if (!perUSD[from] || !(FX && FX.COP)) { o.innerHTML = `<div class="note">${L({ es: 'Necesitas conexión una vez para traer la tasa del día. Después funciona sin internet.', en: 'You need a connection once to get today\'s rate. Then it works offline.' })}</div>`; return; }
  const usd = amt / perUSD[from];
  const rows = ['COP', 'USD', 'EUR', 'VES'].filter(c => c !== from && perUSD[c]).map(c => `<div class="sl"><div><b>${c}</b></div><div style="font-family:'Barlow Condensed';font-size:1.5rem;font-weight:800">${fmt(usd * perUSD[c], c === 'COP' ? 0 : 2)}</div></div>`).join('');
  o.innerHTML = `<div class="status-list">${rows}</div>`;
}

/* ---------- Salario ---------- */
function calcWage() {
  const o = $('#w-out'); if (!o) return;
  const h = Math.max(0, Math.min(WAGE.weekH, parseFloat($('#w-h').value) || 0));
  const n = Math.max(0, Math.min(h, parseFloat($('#w-n').value) || 0));
  const d = Math.max(0, Math.min(10, parseFloat($('#w-d').value) || 0));
  const base = WAGE.month * h / WAGE.weekH;                       // proporcional a 42 h
  const night = n * 5 * WAGE.hour * WAGE.night;                    // ~5 semanas de 210 h al mes
  const sunday = d * (h / 6) * WAGE.hour * WAGE.sunday;            // horas de un día de trabajo
  const devengado = base + night + sunday;
  const aux = devengado <= 2 * WAGE.month ? WAGE.aux * Math.min(1, h / WAGE.weekH) : 0;
  const desc = devengado * 0.08;
  const neto = devengado + aux - desc;
  const row = (t, v, s = '') => `<div class="sl"><div><b>${t}</b>${s ? `<small>${s}</small>` : ''}</div><div style="font-family:'Barlow Condensed';font-size:1.4rem;font-weight:800">${cop(v)}</div></div>`;
  const usd = FX && FX.COP ? ' · ≈ US$' + fmt(neto / FX.COP, 0) : '';
  o.innerHTML = `<div class="status-list">${row(L({ es: 'Salario base', en: 'Base pay' }), base, L({ es: h + ' h por semana', en: h + ' h a week' }))}
    ${night ? row(L({ es: 'Recargo nocturno', en: 'Night surcharge' }), night) : ''}${sunday ? row(L({ es: 'Recargo dominical/festivo', en: 'Sunday/holiday surcharge' }), sunday) : ''}
    ${row(L({ es: 'Auxilio de transporte', en: 'Transport allowance' }), aux)}
    ${row(L({ es: 'Descuentos salud y pensión (8%)', en: 'Health & pension deductions (8%)' }), -desc)}
    ${row(L({ es: 'Te llega al mes (aprox.)', en: 'Take-home per month (approx.)' }), neto, L({ es: 'Cálculo de referencia', en: 'Reference estimate' }) + usd)}</div>`;
}

/* ---------- Festivos ---------- */
function renderHolidays() {
  const box = $('#hol-list'); if (!box) return;
  const iso = todayISO();
  const up = HOLIDAYS.filter(h => h[0] >= iso).slice(0, 10);
  box.innerHTML = up.map(h => `<div class="sl"><div><b>${L(h[1])}</b><small style="text-transform:capitalize">${dateLabel(h[0])}</small></div><span class="pill">${daysTo(h[0]) === 0 ? L({ es: 'Hoy', en: 'Today' }) : L({ es: 'En ' + daysTo(h[0]) + ' d', en: 'In ' + daysTo(h[0]) + ' d' })}</span></div>`).join('');
  const nh = nextHoliday(), n = $('#next-hol');
  if (n && nh) n.textContent = L({ es: 'Próximo: ', en: 'Next: ' }) + L(nh[1]);
}

/* ---------- Checklist ---------- */
function tick(i, v) { const s = store.get('chk', {}); s[i] = v; store.set('chk', s); restoreChecks(); }
function restoreChecks() {
  const s = store.get('chk', {}); let n = 0;
  FIRST.forEach((_, i) => { const el = $('#chk-' + i); if (!el) return; const on = !!s[i]; el.classList.toggle('done', on); $('input', el).checked = on; if (on) n++; });
  const bar = $('#chk-bar'); if (bar) bar.style.width = (n / FIRST.length * 100) + '%';
  const t = $('#chk-txt'); if (t) t.textContent = L({ es: `${n} de ${FIRST.length} listos`, en: `${n} of ${FIRST.length} done` });
}

/* ---------- Dirección ---------- */
function saveAddr() { const v = $('#my-addr').value.trim(); store.set('addr', v); toast(v ? L({ es: 'Dirección guardada', en: 'Address saved' }) : L({ es: 'Dirección borrada', en: 'Address cleared' })); }
function routeHome() { const a = store.get('addr', ''); if (!a) { toast(L({ es: 'Primero guarda tu dirección', en: 'Save your address first' })); go('home'); return; } open('https://www.google.com/maps/dir/?api=1&travelmode=transit&destination=' + encodeURIComponent(a + ', ' + CITY), '_blank', 'noopener'); }
function openShow() {
  const a = store.get('addr', '');
  if (!a) { toast(L({ es: 'Primero guarda tu dirección en Inicio', en: 'Save your address on Home first' })); go('home'); return; }
  $('#show-big').innerHTML = 'Buenas, qué pena con usted. Soy nuevo en El Carmen y me perdí.<br>¿Me ayuda a llegar a esta dirección, por favor?<br><span class="small muted" style="font-family:Barlow">Hi, sorry. I\'m new in El Carmen and I\'m lost. Could you help me get to this address?</span>';
  $('#show-addr').textContent = a; $('#showcard').classList.add('on');
}
function planTrip() { const d = $('#j-to').value.trim(); if (!d) return; open('https://www.google.com/maps/dir/?api=1&travelmode=transit&destination=' + encodeURIComponent(d + ', ' + CITY), '_blank', 'noopener'); }

/* ---------- Mapa (Leaflet) ---------- */
let map = null, layers = {};
const CAT_COLOR = { city: '#1E4FB8', nature: '#2FB59A', help: '#0B0B0C' };
function initMap() {
  const el = $('#map'); if (!el || map || typeof window.L === 'undefined') return;
  const LF = window.L;
  map = LF.map(el, { zoomControl: true }).setView([6.075, -75.32], 12);
  LF.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { attribution: '© OpenStreetMap, © CARTO', subdomains: 'abcd', maxZoom: 19 }).addTo(map);
  layers = {};
  [...PLACES, ...MAP_EXTRA].forEach(p => {
    const icon = LF.divIcon({ className: '', html: `<div class="mk" style="background:${CAT_COLOR[p.cat]}"></div>`, iconSize: [16, 16], iconAnchor: [8, 8] });
    const img = PHOTO_CACHE[p.id] ? `<div style="width:220px;height:110px;border-radius:8px;background:url('${PHOTO_CACHE[p.id]}') center/cover;margin-bottom:6px"></div>` : '';
    const m = LF.marker([p.lat, p.lon], { icon }).bindPopup(`${img}<b>${esc(L(p.n))}</b><br><span>${esc(L(p.d))}</span><br><a href="https://www.google.com/maps/dir/?api=1&destination=${p.q ? encodeURIComponent(p.q) : p.lat + ',' + p.lon}" target="_blank" rel="noopener">${L({ es: 'Cómo llegar', en: 'Directions' })}</a>`, { maxWidth: 240 });
    m._cat = p.cat; m.addTo(map); layers[p.id] = m;
  });
  setTimeout(() => map.invalidateSize(), 200);
  if (pendingPlace) { const id = pendingPlace; pendingPlace = null; setTimeout(() => focusPlace(id), 250); }
}
function mapFilter(c) {
  $$('#map-chips button').forEach(b => b.classList.toggle('on', b.dataset.c === c));
  if (!map) return;
  Object.values(layers).forEach(m => { const show = c === 'all' || m._cat === c; if (show && !map.hasLayer(m)) m.addTo(map); if (!show && map.hasLayer(m)) map.removeLayer(m); });
}
let pendingPlace = null;
function showOnMap(id) { pendingPlace = id; go('map'); if (map) { pendingPlace = null; setTimeout(() => focusPlace(id), 120); } }
function focusPlace(id) { const m = layers[id]; if (!m) return; mapFilter('all'); map.setView(m.getLatLng(), ['melcocho', 'santodomingo', 'rionegro', 'laceja', 'guatape', 'migra', 'airport', 'hosprio'].includes(id) ? 12 : 16); m.openPopup(); }
function locateMe() {
  if (!navigator.geolocation) { toast(L({ es: 'Tu celular no permite ubicación', en: 'Location not available' })); return; }
  navigator.geolocation.getCurrentPosition(p => {
    if (!map) return; const ll = [p.coords.latitude, p.coords.longitude];
    window.L.circleMarker(ll, { radius: 9, color: '#fff', weight: 3, fillColor: '#2D7FF9', fillOpacity: 1 }).addTo(map).bindPopup(L({ es: 'Estás aquí', en: 'You are here' })).openPopup();
    map.setView(ll, 14);
  }, () => toast(L({ es: 'No pude obtener tu ubicación', en: 'Could not get your location' })), { enableHighAccuracy: true, timeout: 10000 });
}

/* ---------- Otras ciudades de la serie ---------- */
const HUB = 'https://haroldco45.github.io/latinos-por-el-mundo/ciudades.json';
const CITY_FALLBACK = [
  { id: 'barranquilla', es: 'Barranquilla', en: 'Barranquilla', pais: { es: 'Colombia', en: 'Colombia' }, url: 'https://haroldco45.github.io/barranquilla-para-latinos/' },
  { id: 'cartagena', es: 'Cartagena', en: 'Cartagena', pais: { es: 'Colombia', en: 'Colombia' }, url: 'https://haroldco45.github.io/cartagena-para-latinos/' },
  { id: 'norcasia', es: 'Norcasia', en: 'Norcasia', pais: { es: 'Colombia', en: 'Colombia' }, url: 'https://haroldco45.github.io/norcasia-para-latinos/' },
  { id: 'londres', es: 'Londres', en: 'London', pais: { es: 'Reino Unido', en: 'United Kingdom' }, url: 'https://haroldco45.github.io/londres-para-latinos/' },
  { id: 'madrid', es: 'Madrid', en: 'Madrid', pais: { es: 'España', en: 'Spain' }, url: 'https://haroldco45.github.io/madrid-para-latinos/' },
  { id: 'bilbao', es: 'Bilbao', en: 'Bilbao', pais: { es: 'España', en: 'Spain' }, url: 'https://haroldco45.github.io/bilbao-para-latinos/' },
  { id: 'medellin', es: 'Medellín', en: 'Medellín', pais: { es: 'Colombia', en: 'Colombia' }, url: 'https://haroldco45.github.io/medellin-para-latinos/' },
  { id: 'miami', es: 'Miami', en: 'Miami', pais: { es: 'Estados Unidos', en: 'United States' }, url: 'https://haroldco45.github.io/miami-para-latinos/' },
  { id: 'nueva-york', es: 'Nueva York', en: 'New York', pais: { es: 'Estados Unidos', en: 'United States' }, url: 'https://haroldco45.github.io/nueva-york-para-latinos/' },
  { id: 'toledo', es: 'Toledo', en: 'Toledo', pais: { es: 'España', en: 'Spain' }, url: 'https://haroldco45.github.io/toledo-para-latinos/' },
  { id: 'leamington', es: 'Leamington', en: 'Leamington', pais: { es: 'Canadá', en: 'Canada' }, url: 'https://haroldco45.github.io/leamington-para-latinos/' },
  { id: 'hamamatsu', es: 'Hamamatsu', en: 'Hamamatsu', pais: { es: 'Japón', en: 'Japan' }, url: 'https://haroldco45.github.io/hamamatsu-para-latinos/' },
  { id: 'oizumi', es: 'Oizumi', en: 'Oizumi', pais: { es: 'Japón', en: 'Japan' }, url: 'https://haroldco45.github.io/oizumi-para-latinos/' },
  { id: 'getxo', es: 'Getxo', en: 'Getxo', pais: { es: 'España', en: 'Spain' }, url: 'https://haroldco45.github.io/getxo-para-latinos/' },
  { id: 'willemstad', es: 'Willemstad', en: 'Willemstad', pais: { es: 'Curazao', en: 'Curaçao' }, url: 'https://haroldco45.github.io/willemstad-para-latinos/' },
  { id: 'monteria', es: 'Montería', en: 'Montería', pais: { es: 'Colombia', en: 'Colombia' }, url: 'https://monteria-para-latinos.netlify.app/' }
];
const CITY_WIKI = { londres: 'London', madrid: 'Madrid', bilbao: 'Bilbao', medellin: 'Medellín', miami: 'Miami', 'nueva-york': 'New York City', toledo: 'Toledo, Spain', leamington: 'Leamington, Ontario', hamamatsu: 'Hamamatsu', oizumi: 'Ōizumi, Gunma', getxo: 'Getxo', willemstad: 'Willemstad', cartagena: 'Cartagena, Colombia', norcasia: 'Norcasia', svalbard: 'Svalbard', barranquilla: 'Barranquilla', 'cano-canoas': 'Caño Canoas', aldeas: 'Spain', monteria: 'Montería', 'carmen-de-viboral': 'El Carmen de Viboral' };
let CITIES = store.get('cities', CITY_FALLBACK);
const CITY_PH = store.get('cityph', {});
function renderCities() {
  const box = $('#cx'); if (!box) return;
  box.innerHTML = CITIES.filter(c => c.id !== 'carmen-de-viboral').map(c => {
    const name = c[LANG] || c.es, pais = (c.pais && (c.pais[LANG] || c.pais.es)) || '';
    const bg = CITY_PH[c.id] ? `background-image:url('${CITY_PH[c.id]}');` : '';
    if (c.pronto) return `<div class="cxc soon" style="--fb:${fbColor(c.id)};${bg}"><b>${esc(name)}</b><small>${esc(pais)} · ${L({ es: 'Muy pronto', en: 'Coming soon' })}</small></div>`;
    return `<a class="cxc" style="--fb:${fbColor(c.id)};${bg}" href="${esc(c.url)}"><b>${esc(name)}</b><small>${esc(pais)}</small></a>`;
  }).join('');
}
async function loadCities() {
  try {
    const j = await getJSON(HUB + '?v=' + Date.now());
    if (j && j.ciudades && j.ciudades.length) {
      // Une la lista del hub con las ciudades conocidas que aún no estén publicadas allí
      const ids = new Set(j.ciudades.map(c => c.id));
      CITIES = j.ciudades.concat(CITY_FALLBACK.filter(c => !ids.has(c.id))); store.set('cities', CITIES);
    }
  } catch (e) {}
  renderCities();
  const need = CITIES.filter(c => !CITY_PH[c.id]);
  if (need.length) {
    const titles = need.map(c => CITY_WIKI[c.id] || c.en || c.es);
    const got = await wikiBatch(titles);
    need.forEach((c, i) => { if (got[titles[i]]) CITY_PH[c.id] = got[titles[i]]; });
    store.set('cityph', CITY_PH); renderCities();
  }
}

/* ---------- PWA ---------- */
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt = e; setTimeout(() => $('#install').classList.add('on'), 4000); });
$('#install-btn').addEventListener('click', async () => { if (!deferredPrompt) return; deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; $('#install').classList.remove('on'); });
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));

/* ---------- Arranque ---------- */
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeVideo(); });
window.addEventListener('hashchange', () => go(location.hash.slice(1) || 'home'));
current = VIEWS.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'home';
render();
$$('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.v === current));
setTimeout(() => $('#splash').classList.add('off'), 900);
loadWeather(); loadFX(); loadCities(); loadNews(); loadRobotVids();
loadPhotos().then(() => { paintPhotos(); if (map) { map.remove(); map = null; if (current === 'map') initMap(); } });
setInterval(() => { tickClock(); renderAlert(); }, 30000);
setInterval(() => { buildTicker(); renderFiestas(); }, 300000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) { tickClock(); renderAlert(); buildTicker(); renderFiestas(); loadWeather(); loadFX(); loadNews(); loadRobotVids(); } });
