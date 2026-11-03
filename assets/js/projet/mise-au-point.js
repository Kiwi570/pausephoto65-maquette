/* Mise au point : chaque photo [data-mise-au-point] entre floue et devient nette.
   - Photo d'ouverture de la page ([data-hero]), sur ordinateur avec souris et WebGL : flou de bokeh
     calculé par un shader (16 échantillons), qui se resserre jusqu'à l'image exacte ; le canvas est ensuite
     retiré, la photo d'origine reste seule. Tout ce qui coûte (contexte, shader, image redimensionnée hors du
     fil principal, envoi au processeur graphique) est préparé AVANT l'intro, pendant l'attente : l'animation
     elle-même ne fait que changer deux valeurs par image.
   - Toutes les autres photos, et partout sans WebGL : fondu depuis la petite version floue (fond de la
     figure) vers la photo, en opacité et transformation seulement.
   - Mode calme, retour arrière, secours : la photo est nette d'emblée (règles CSS).
   Calcul en demi-résolution, 60 images par seconde au plus. */
const html = document.documentElement;
let modeWebgl = false;
let presse = false; /* le visiteur a accéléré l'intro : plus de calcul lourd, fondu court */
let io = null;
const prepares = new Map();

const VS = 'attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
const FS = `precision mediump float;
uniform sampler2D t;uniform vec2 res;uniform vec2 img;uniform vec2 pos;uniform float rayon;uniform float ech;varying vec2 v;
vec2 couvrir(vec2 uv){float rb=res.x/res.y,ri=img.x/img.y;vec2 s=rb>ri?vec2(1.,ri/rb):vec2(rb/ri,1.);vec2 c=(1.-s)*pos+uv*s;return vec2(c.x,1.-c.y);}
void main(){vec2 uv=(v-.5)/ech+.5;
 if(rayon<.05){gl_FragColor=texture2D(t,couvrir(uv));return;}
 vec3 acc=vec3(0.);float tot=0.;vec2 px=rayon/res;
 for(int i=0;i<16;i++){float fi=float(i);float r=sqrt((fi+.5)/16.);float th=fi*2.39996;
  vec3 c=texture2D(t,couvrir(clamp(uv+vec2(cos(th),sin(th))*r*px,0.,1.))).rgb;
  float w=1.+pow(dot(c,vec3(.3,.59,.11)),3.)*3.;acc+=c*w;tot+=w;}
 gl_FragColor=vec4(acc/tot,1.);}`;

function contexte() {
  const canvas = document.createElement('canvas');
  canvas.className = 'mise-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.setAttribute('data-audit-ignorer', '');
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, premultipliedAlpha: false, preserveDrawingBuffer: false });
  if (!gl) return null;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; };
  const vs = sh(gl.VERTEX_SHADER, VS), fs = sh(gl.FRAGMENT_SHADER, FS);
  if (!vs || !fs) return null;
  const prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const u = (n) => gl.getUniformLocation(prog, n);
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  /* Pas de retournement à l'envoi (ignoré pour les ImageBitmap) : le shader lit l'image dans le bon sens. */
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach((p) => gl.texParameteri(gl.TEXTURE_2D, p, gl.CLAMP_TO_EDGE));
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  return { canvas, gl, u: { res: u('res'), img: u('img'), pos: u('pos'), rayon: u('rayon'), ech: u('ech') } };
}

function position(img) {
  const p = getComputedStyle(img).objectPosition.split(/\s+/).map((x) => (x.endsWith('%') ? parseFloat(x) / 100 : 0.5));
  return [p[0] ?? 0.5, 1 - (p[1] ?? 0.5)];
}

const net = (fig) => fig.classList.add('net');

function doux(fig) {
  fig.classList.add('mise-douce');
  requestAnimationFrame(() => requestAnimationFrame(() => net(fig)));
}

async function decode(img) {
  if (!img) return false;
  if (img.complete && img.naturalWidth) return true;
  try { await img.decode(); return true; } catch {}
  return img.complete && img.naturalWidth > 0;
}

/* Préparation de la photo d'ouverture, pendant l'attente de l'intro (jamais pendant une animation). */
async function preparer(fig) {
  const img = fig.querySelector('img');
  if (!(await decode(img))) return null;
  const rect = fig.getBoundingClientRect();
  if (rect.width < 2 || rect.height < 2) return null;
  const ctx = contexte();
  if (!ctx) return null;
  const { canvas, gl, u } = ctx;
  /* Demi-résolution : le flou n'a pas besoin de plus, et le calcul coûte quatre fois moins. */
  const dpr = 0.5;
  canvas.width = Math.max(2, Math.round(rect.width * dpr));
  canvas.height = Math.max(2, Math.round(rect.height * dpr));
  /* Image redimensionnée hors du fil principal à la taille affichée (envoi au GPU rapide). */
  let source = img, iw = img.naturalWidth, ih = img.naturalHeight;
  const k = Math.min(1, Math.max(canvas.width / iw, canvas.height / ih));
  if (window.createImageBitmap) {
    try {
      source = await createImageBitmap(img, { resizeWidth: Math.max(2, Math.round(iw * k)), resizeHeight: Math.max(2, Math.round(ih * k)), resizeQuality: 'high' });
      iw = source.width; ih = source.height;
    } catch { source = img; iw = img.naturalWidth; ih = img.naturalHeight; }
  }
  try { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, source); } catch { return null; }
  if (source.close) source.close();
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.uniform2f(u.res, canvas.width, canvas.height);
  gl.uniform2f(u.img, iw, ih);
  const [px, py] = position(img);
  gl.uniform2f(u.pos, px, py);
  const dessiner = (n) => { gl.uniform1f(u.rayon, n * 28 * dpr); gl.uniform1f(u.ech, 1 + 0.045 * n); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); };
  dessiner(1); /* premier dessin : le shader est compilé et chauffé avant l'intro */
  const p = { canvas, dessiner, dpr, gl };
  prepares.set(fig, p);
  return p;
}

async function webgl(fig, p, duree) {
  p.dessiner(1);
  if (!p.canvas.isConnected) fig.appendChild(p.canvas);
  const t0 = performance.now();
  let dernier = t0;
  await new Promise((fin) => {
    const pas = (t) => {
      if (t - dernier < 15 && t - t0 < duree) { requestAnimationFrame(pas); return; } /* 60 images par seconde au plus */
      dernier = t;
      const q = presse ? 1 : Math.min(1, (t - t0) / duree);
      p.dessiner(Math.pow(1 - q, 2.2));
      if (q < 1) requestAnimationFrame(pas); else fin();
    };
    requestAnimationFrame(pas);
  });
  net(fig);
  requestAnimationFrame(() => {
    p.canvas.remove();
    const ext = p.gl.getExtension('WEBGL_lose_context');
    ext && ext.loseContext();
    prepares.delete(fig);
  });
}

/* Lance la mise au point d'une figure. */
export async function lancer(fig, { duree = 1050 } = {}) {
  if (!fig || fig.dataset.miseLancee) return;
  fig.dataset.miseLancee = '1';
  const p = prepares.get(fig);
  if (p && !presse) { await webgl(fig, p, duree); return; }
  if (p) liberer(fig, p);
  const img = fig.querySelector('img');
  if (!(await decode(img))) { net(fig); return; }
  doux(fig);
}

/* Toutes les photos du premier écran et celles qui entrent ensuite dans l'écran. */
export function observer() {
  if (io) return;
  io = new IntersectionObserver((es) => {
    es.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      lancer(e.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
  document.querySelectorAll('[data-mise-au-point]:not(.net)').forEach((f) => { if (!f.dataset.miseLancee && !f.hasAttribute('data-hero')) io.observe(f); });
}

function liberer(fig, p) {
  p.canvas.remove();
  const ext = p.gl.getExtension('WEBGL_lose_context');
  ext && ext.loseContext();
  prepares.delete(fig);
}

/* Le visiteur accélère ou passe l'intro : la mise au point en cours se termine aussitôt. */
export function presser() { presse = true; }

export function toutNet() {
  document.querySelectorAll('[data-mise-au-point]').forEach(net);
  prepares.forEach((p, fig) => liberer(fig, p));
}

/* À appeler avant demarrer() : décide du mode et prépare la photo d'ouverture (promesse pour « pret »). */
export function initMiseAuPoint() {
  const calme = html.classList.contains('calme') || html.classList.contains('secours') || html.dataset.arrivee === 'retour';
  if (calme) { toutNet(); return Promise.resolve(); }
  const souris = matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (souris && window.innerWidth > 760) {
    try {
      const essai = document.createElement('canvas').getContext('webgl');
      modeWebgl = !!essai;
      if (essai) { const ext = essai.getExtension('WEBGL_lose_context'); ext && ext.loseContext(); }
    } catch { modeWebgl = false; }
  }
  if (!modeWebgl) return Promise.resolve();
  window.__webgl = true;
  const hero = document.querySelector('[data-hero][data-mise-au-point]');
  return hero ? preparer(hero).catch(() => null) : Promise.resolve();
}
