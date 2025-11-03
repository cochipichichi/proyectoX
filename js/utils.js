
export const EMAILS = ["franciscoandresp@gmail.com","neotechedulab@gmail.com","belen.acpe@gmail.com"];

export function saveJSON(key, obj){
  localStorage.setItem(key, JSON.stringify(obj));
}
export function loadJSON(key, fallback){
  try{ return JSON.parse(localStorage.getItem(key)) ?? fallback; }catch(e){ return fallback; }
}
export function ts(){ return new Date().toISOString(); }

export function toCSV(rows){
  if(!rows || !rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = v => (''+v).replace(/"/g,'""');
  const lines = [headers.join(",")];
  for(const r of rows){
    lines.push(headers.map(h => `"${escape(r[h]??"")}"`).join(","));
  }
  return lines.join("\n");
}
export function download(filename, text){
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text],{type:"text/plain"}));
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
export function sendMail(subject, body){
  const to = EMAILS.join(",");
  const url = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = url;
}
