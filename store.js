import {signInAnonymously} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {collection,doc,onSnapshot,addDoc,serverTimestamp} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {auth,db} from "./firebase.js";

const $ = i => document.getElementById(i);
const esc = s => String(s == null ? "" : s).replace(/[<>"']/g, c => ({"<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const okImg = u => typeof u === "string" && /^(data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+\/=]+|https:\/\/[^\s"'<>]+)$/.test(u) ? u : "";
const D = window.P.slice(); // produtos padrão (usados enquanto o banco estiver vazio)

function apply(){
  Object.keys(window.cart).forEach(k => { if (!window.P.some(p => String(p.id) === k)) delete window.cart[k]; });
  if (!window.P.some(p => p.c === window.cat)) window.cat = "Todos";
  window.chips(); window.grid(); window.render();
}

// Produtos: só os ativos aparecem na loja
onSnapshot(collection(db, "products"), s => {
  const L = s.docs.map(d => { const x = d.data(); return {id:d.id, n:esc(x.n), c:esc(x.c || "Geral"), e:esc(x.e || "📦"), p:Number(x.p) || 0, d:esc(x.d), img:okImg(x.img), o:x.o || 0, a:x.active !== false}; })
    .filter(x => x.a).sort((a, b) => a.o - b.o);
  window.P = s.size ? L : D.slice();
  apply();
}, () => {});

// Configurações da loja (textos, banner, contato)
onSnapshot(doc(db, "settings", "store"), s => {
  if (!s.exists()) return;
  const x = s.data();
  const t = (i, v) => { if (v && $(i)) $(i).textContent = v; };
  t("h-title", x.heroTitle); t("h-em", x.heroEm); t("h-text", x.heroText); t("h-tag", x.tagline); t("f-slogan", x.slogan); t("f-info", x.info);
  if (x.whatsapp) window.WHATSAPP = String(x.whatsapp).replace(/\D/g, "");
  if (x.email) window.EMAIL = String(x.email);
  $("wa").href = "https://wa.me/" + window.WHATSAPP + "?text=" + encodeURIComponent("Olá! Preciso de ajuda para comprar no app da NEXORA 3D.");
  const b = okImg(x.banner), pr = document.querySelector(".printer");
  if (b && pr) { pr.replaceChildren(); const im = new Image(); im.src = b; im.alt = ""; im.style.cssText = "width:100%;height:100%;object-fit:cover"; pr.append(im); }
}, () => {});

// Pedidos: salvos no Firestore quando o cliente gera o Pix (se falhar, o fluxo por WhatsApp continua igual)
async function saveOrder(){
  try {
    if (!auth.currentUser) await signInAnonymously(auth);
    const items = Object.keys(window.cart).map(k => { const x = window.P.find(p => String(p.id) === k); return x ? {id:String(x.id), n:x.n, q:window.cart[k], p:x.p} : null; }).filter(Boolean);
    if (!items.length) return;
    const g = i => $(i).value.trim();
    await addDoc(collection(db, "orders"), {
      uid:auth.currentUser.uid, name:g("n").slice(0, 80), phone:g("t").slice(0, 30), email:g("e").slice(0, 120), details:g("d").slice(0, 1000),
      items, subtotal:window.sub(), discountPct:window.disc(), total:Math.round(window.tot() * 100) / 100,
      status:"novo", payment:"pix", createdAt:serverTimestamp()
    });
  } catch (e) { console.warn("Pedido não salvo no banco:", e); }
}
const s0 = $("send").onclick;
$("send").onclick = function(){ s0(); if ($("ok").style.display === "block") saveOrder(); };
