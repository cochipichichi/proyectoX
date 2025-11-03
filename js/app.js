
import {EMAILS, saveJSON, loadJSON} from "./utils.js";

export const AppState = {
  highContrast: false,
  ttsEnabled: false,
};

// mount controls (index has ./js, pages use ../js)
  const isIndex = location.pathname.endsWith("/index.html") || location.pathname === "/" || location.pathname === "";
  renderHeaderControls(isIndex ? "index.html" : "../index.html");
  // click-to-speak remains
  document.addEventListener("click", e=>{
    const el = e.target.closest("[data-say]");
    if(!el || !AppState.ttsEnabled) return;
    const u = new SpeechSynthesisUtterance((el.getAttribute("data-say")||el.textContent||"").trim());
    u.lang = "es-CL"; speechSynthesis.cancel(); speechSynthesis.speak(u);
  });
}
);
  }
  // Narrator (Web Speech API)
  const narr = document.querySelector("#btnNarrator");
  if(narr){
    narr.addEventListener("click", ()=>{
      AppState.ttsEnabled = !AppState.ttsEnabled;
      narr.setAttribute("aria-pressed", AppState.ttsEnabled ? "true" : "false");
      narr.querySelector("span").textContent = AppState.ttsEnabled ? "Narrador: ON" : "Narrador: OFF";
    });
  }
  // Click-to-speak on any [data-say] element
  document.addEventListener("click", e=>{
    const el = e.target.closest("[data-say]");
    if(!el || !AppState.ttsEnabled) return;
    const u = new SpeechSynthesisUtterance((el.getAttribute("data-say")||el.textContent||"").trim());
    u.lang = "es-CL";
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  });
}

export function studentFieldsHTML(){
  return `
  <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">
    <label>Nombre completo<input id="alumno_nombre" required placeholder="Nombre y apellido"/></label>
    <label>Curso<input id="alumno_curso" required placeholder="1°A, 2°B..."/></label>
    <label>Correo del alumno<input id="alumno_correo" type="email" placeholder="nombre@dominio.com"/></label>
  </div>`;
}

export function getStudent(){
  return {
    nombre: (document.getElementById("alumno_nombre")||{}).value || "",
    curso: (document.getElementById("alumno_curso")||{}).value || "",
    correo: (document.getElementById("alumno_correo")||{}).value || ""
  };
}

export async function sendEmailWithAttachment(subject, message, base64pdf){
  const cfg = await fetch("../emailjs.config.json").then(r=>r.json());
  // EmailJS via CDN (must be loaded on page): emailjs.send()
  const params = {
    to_emails: EMAILS.join(","),
    subject,
    message,
    // Attachment as base64 data URL (EmailJS supports 'attachments')
    attachment: base64pdf // e.g., "data:application/pdf;base64,...."
  };
  if(!window.emailjs){
    alert("EmailJS no cargó. Revisa la conexión o el script de CDN.");
    return;
  }
  window.emailjs.init(cfg.EMAILJS_PUBLIC_KEY);
  const res = await window.emailjs.send(cfg.EMAILJS_SERVICE_ID, cfg.EMAILJS_TEMPLATE_ID, params);
  return res;
}


import {EMAILS, saveJSON, loadJSON} from "./utils.js";

export const AppState = {highContrast:false, ttsEnabled:false};

export function toggleTheme(){
  document.documentElement.classList.toggle("light");
  localStorage.setItem("theme_light", document.documentElement.classList.contains("light") ? "1":"0");
}
export function applySavedTheme(){
  if(localStorage.getItem("theme_light")==="1"){
    document.documentElement.classList.add("light");
  }
}
export function fontScale(delta){
  const cur = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--scale") || "1");
  let next = Math.min(1.6, Math.max(0.8, cur + delta));
  document.documentElement.style.setProperty("--scale", String(next));
  localStorage.setItem("font_scale", String(next));
}
export function applySavedFontScale(){
  const s = parseFloat(localStorage.getItem("font_scale") || "1");
  document.documentElement.style.setProperty("--scale", String(s));
}
export function toggleLang(){
  const current = localStorage.getItem("lang") || "es";
  const next = current === "es" ? "en" : "es";
  localStorage.setItem("lang", next);
  alert("Idioma cambiado a: " + next.toUpperCase() + " (placeholder)");
}
export function toggleAccessPanel(){
  const p = document.getElementById("accessPanel");
  if(!p) return;
  p.classList.toggle("show");
}
export function runSearch(){
  const q = prompt("Buscar (filtra tarjetas/encabezados):");
  if(!q) return;
  const items = document.querySelectorAll(".card, h2, h3");
  items.forEach(el=>{
    const txt = (el.innerText||"").toLowerCase();
    el.style.outline = txt.includes(q.toLowerCase()) ? "2px solid var(--accent-2)" : "";
    el.style.opacity = txt.includes(q.toLowerCase()) ? "1" : "0.35";
  });
}
export function renderHeaderControls(hrefHome="../index.html"){
  const container = document.querySelector("header .container");
  if(!container) return;
  const old = container.querySelector(".header-controls");
  if(old) old.remove();
  let homeHref = hrefHome;
  if(location.pathname.endsWith("/index.html") || location.pathname.endsWith("/")){
    homeHref = "index.html";
  }
  const bar = document.createElement("div");
  bar.className = "header-controls";
  bar.innerHTML = `
    <div class="header-spacer"></div>
    <a class="ctrl" title="Inicio" href="${homeHref}" data-say="Inicio">🏠</a>
    <button class="ctrl" id="ctrlVoice" title="Narrador" data-say="Narrador">🗣️</button>
    <button class="ctrl" id="ctrlTheme" title="Claro/Oscuro" data-say="Claro oscuro">🌓</button>
    <button class="ctrl" id="ctrlAPlus" title="Aumentar letra" data-say="Aumentar letra">A+</button>
    <button class="ctrl" id="ctrlAMinus" title="Disminuir letra" data-say="Disminuir letra">A−</button>
    <button class="ctrl" id="ctrlLang" title="Idioma" data-say="Idioma">🌐</button>
    <button class="ctrl" id="ctrlAccess" title="Accesibilidad" data-say="Accesibilidad">🧠</button>
    <button class="ctrl" id="ctrlSearch" title="Buscar" data-say="Buscar">🔍</button>
  `;
  container.appendChild(bar);

  if(!document.getElementById("accessPanel")){
    const panel = document.createElement("div");
    panel.id = "accessPanel";
    panel.innerHTML = `
      <h4>🧠 Accesibilidad</h4>
      <div class="row">
        <button class="btn secondary" id="btnHighContrast">⬛ Alto contraste</button>
        <button class="btn ghost" id="btnNarrator"><span>Narrador: ${AppState.ttsEnabled ? "ON":"OFF"}</span></button>
        <button class="btn ghost" id="btnResetVis">Reiniciar visual</button>
      </div>
      <p class="muted">Usa los controles del header para tema, letra, idioma y búsqueda.</p>
    `;
    document.body.appendChild(panel);
  }

  const narrBtn = document.getElementById("ctrlVoice");
  narrBtn.addEventListener("click", ()=>{
    AppState.ttsEnabled = !AppState.ttsEnabled;
    const u = new SpeechSynthesisUtterance(AppState.ttsEnabled? "Narrador activado":"Narrador desactivado");
    u.lang = "es-CL"; speechSynthesis.cancel(); speechSynthesis.speak(u);
    const label = document.querySelector("#btnNarrator span");
    if(label) label.textContent = "Narrador: " + (AppState.ttsEnabled?"ON":"OFF");
  });
  document.getElementById("ctrlTheme").addEventListener("click", toggleTheme);
  document.getElementById("ctrlAPlus").addEventListener("click", ()=>fontScale(0.1));
  document.getElementById("ctrlAMinus").addEventListener("click", ()=>fontScale(-0.1));
  document.getElementById("ctrlLang").addEventListener("click", toggleLang);
  document.getElementById("ctrlAccess").addEventListener("click", toggleAccessPanel);
  document.getElementById("ctrlSearch").addEventListener("click", runSearch);

  const hc = document.getElementById("btnHighContrast");
  if(hc){hc.addEventListener("click", ()=>{
    AppState.highContrast = !AppState.highContrast;
    document.documentElement.classList.toggle("hc", AppState.highContrast);
  });}
  const narrToggle = document.getElementById("btnNarrator");
  if(narrToggle){narrToggle.addEventListener("click", ()=>{
    AppState.ttsEnabled = !AppState.ttsEnabled;
    narrToggle.querySelector("span").textContent = "Narrador: " + (AppState.ttsEnabled? "ON":"OFF");
  });}
  const resetVis = document.getElementById("btnResetVis");
  if(resetVis){resetVis.addEventListener("click", ()=>{
    document.documentElement.classList.remove("hc","light");
    document.documentElement.style.setProperty("--scale","1");
    localStorage.removeItem("font_scale");
    localStorage.removeItem("theme_light");
  });}
}
// mount controls (index has ./js, pages use ../js)
  const isIndex = location.pathname.endsWith("/index.html") || location.pathname === "/" || location.pathname === "";
  renderHeaderControls(isIndex ? "index.html" : "../index.html");
  // click-to-speak remains
  document.addEventListener("click", e=>{
    const el = e.target.closest("[data-say]");
    if(!el || !AppState.ttsEnabled) return;
    const u = new SpeechSynthesisUtterance((el.getAttribute("data-say")||el.textContent||"").trim());
    u.lang = "es-CL"; speechSynthesis.cancel(); speechSynthesis.speak(u);
  });
}

export function fontScale(d){const cur=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--scale")||"1");let n=Math.min(1.6,Math.max(0.8,cur+d));document.documentElement.style.setProperty("--scale",String(n));localStorage.setItem("font_scale",String(n));}
export function toggleTheme(){document.documentElement.classList.toggle("light");localStorage.setItem("theme_light",document.documentElement.classList.contains("light")?"1":"0");}
export function applySavedPrefs(){const s=parseFloat(localStorage.getItem("font_scale")||"1");document.documentElement.style.setProperty("--scale",String(s));if(localStorage.getItem("theme_light")==="1"){document.documentElement.classList.add("light");}}
export function renderHeaderControls(hrefHome="../index.html"){
  const c=document.querySelector("header .container"); if(!c) return;
  const old=c.querySelector(".header-controls"); if(old) old.remove();
  let home=hrefHome; if(location.pathname.endsWith("/index.html")||location.pathname.endsWith("/")) home="index.html";
  const bar=document.createElement("div"); bar.className="header-controls";
  bar.innerHTML = `
    <div class="header-spacer"></div>
    <a class="ctrl" href="${home}" title="Inicio" data-say="Inicio">🏠</a>
    <button class="ctrl" id="ctrlVoice" title="Narrador" data-say="Narrador">🗣️</button>
    <button class="ctrl" id="ctrlTheme" title="Claro/Oscuro" data-say="Claro oscuro">🌓</button>
    <button class="ctrl" id="ctrlAPlus" title="Aumentar letra" data-say="Aumentar letra">A+</button>
    <button class="ctrl" id="ctrlAMinus" title="Disminuir letra" data-say="Disminuir letra">A−</button>
    <button class="ctrl" id="ctrlLang" title="Idioma" data-say="Idioma">🌐</button>
    <button class="ctrl" id="ctrlAccess" title="Accesibilidad" data-say="Accesibilidad">🧠</button>
    <button class="ctrl" id="ctrlSearch" title="Buscar" data-say="Buscar">🔍</button>
  `;
  c.appendChild(bar);

  document.getElementById("ctrlVoice").addEventListener("click", ()=>{
    window.AppState = window.AppState || {ttsEnabled:false};
    AppState.ttsEnabled = !AppState.ttsEnabled;
    try{ const u=new SpeechSynthesisUtterance(AppState.ttsEnabled? "Narrador activado":"Narrador desactivado"); u.lang="es-CL"; speechSynthesis.cancel(); speechSynthesis.speak(u);}catch(e){}
  });
  document.getElementById("ctrlTheme").addEventListener("click", toggleTheme);
  document.getElementById("ctrlAPlus").addEventListener("click", ()=>fontScale(0.1));
  document.getElementById("ctrlAMinus").addEventListener("click", ()=>fontScale(-0.1));
  document.getElementById("ctrlLang").addEventListener("click", ()=>alert("Idioma (placeholder)"));
  document.getElementById("ctrlAccess").addEventListener("click", ()=>document.documentElement.classList.toggle("hc"));
  document.getElementById("ctrlSearch").addEventListener("click", ()=>{
    const q=prompt("Buscar (filtra tarjetas/encabezados):"); if(!q) return;
    document.querySelectorAll(".card,h2,h3").forEach(el=>{
      const t=(el.innerText||'').toLowerCase();
      el.style.outline=t.includes(q.toLowerCase())?"2px solid var(--accent-2)":"";
      el.style.opacity=t.includes(q.toLowerCase())?"1":"0.35";
    });
  });
}
export function initGlobalUI(){
  applySavedPrefs();
  const isIndex = location.pathname.endsWith("/index.html") || location.pathname === "/" || location.pathname === "";
  renderHeaderControls(isIndex ? "index.html" : "../index.html");
  document.addEventListener("click", e=>{
    const el = e.target.closest("[data-say]");
    if(!el || !window.AppState || !AppState.ttsEnabled) return;
    const txt=(el.getAttribute("data-say")||el.textContent||"").trim();
    try{ const u=new SpeechSynthesisUtterance(txt); u.lang="es-CL"; speechSynthesis.cancel(); speechSynthesis.speak(u);}catch(e){}
  });
}
