
import {EMAILS, saveJSON, loadJSON} from "./utils.js";

export const AppState = {
  highContrast: false,
  ttsEnabled: false,
};

export function initGlobalUI(){
  // High contrast toggle
  const hc = document.querySelector("#btnHighContrast");
  if(hc){
    hc.addEventListener("click", ()=>{
      AppState.highContrast = !AppState.highContrast;
      document.documentElement.classList.toggle("hc", AppState.highContrast);
    });
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
