
import {signInWithEmailAndPassword,signOut,onAuthStateChanged,sendPasswordResetEmail,setPersistence,browserLocalPersistence} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {collection,doc,getDoc,setDoc,addDoc,updateDoc,deleteDoc,onSnapshot,query,orderBy,limit} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {auth,db} from "/firebase.js";

const app = document.getElementById("app");
const h = (t, a, ...k) => { const e = document.createElement(t); for (const [n, v] of Object.entries(a || {})) { if (n === "class") e.className = v; else if (n.startsWith("on")) e[n] = v; else if (v != null && v !== false) e.setAttribute(n, v === true ? "" : v); } e.append(...k.flat().filter(x => x != null && x !== false)); return e; };
const money = v => "R$ " + Number(v || 0).toFixed(2).replace(".", ",");
const ERR = {"auth/invalid-credential":"E-mail ou senha incorretos.","auth/wrong-password":"Senha incorreta.","auth/user-not-found":"Não existe conta com este e-mail.","auth/invalid-email":"E-mail inválido.","auth/missing-password":"Digite a senha.","auth/too-many-requests":"Muitas tentativas. Aguarde alguns minutos e tente de novo.","auth/network-request-failed":"Sem conexão com a internet.","auth/user-disabled":"Esta conta foi desativada.","auth/operation-not-allowed":"Ative o login por E-mail/senha no Firebase (Authentication).","permission-denied":"Sem permissão. Publique as regras do Firestore e confira se sua conta está em admins."};
const em = e => ERR[e.code] || ("Erro: " + (e.code || e.message));
const STAT = {novo:"Aguardando pagamento",pago:"Pago",em_producao:"Em produção",enviado:"Enviado",concluido:"Concluído",cancelado:"Cancelado"};
const SEED = [["Gato decorativo low poly","Decoração","🐱",49.9,"Peça decorativa facetada, várias cores."],["Vaso espiral","Decoração","🏺",59.9,"Vaso moderno com textura em espiral."],["Porta-canetas com logo","Empresas","🖊️",39.9,"Organizador de mesa com sua marca."],["Luminária árvore","Presentes","💡",89.9,"Luminária recortada com luz quente."],["Chaveiro personalizado","Brindes","🔑",12.9,"Com nome, logo ou desenho à sua escolha."],["Suporte de celular","Organização","📱",29.9,"Suporte firme para mesa, personalizável."],["Vasinho suculenta","Decoração","🪴",24.9,"Vaso geométrico para suculentas."],["Placa “Sua Marca”","Empresas","🏷️",69.9,"Placa para balcão ou mesa com seu logo."],["Projeto sob encomenda","Presentes","✨",0,"Mande sua ideia e criamos para você."]];
let unsubs = [], PR = [], OR = [], ST = {}, view = "dash", flt = "todos", ed = null, DRAW = () => {};
const stop = () => { unsubs.forEach(f => f()); unsubs = []; };
const mount = (...k) => app.replaceChildren(...k);
const shrink = (f, max, q) => new Promise((ok, no) => { const r = new FileReader(); r.onerror = () => no(new Error("Não foi possível ler a imagem.")); r.onload = () => { const i = new Image(); i.onerror = () => no(new Error("Arquivo de imagem inválido.")); i.onload = () => { const k = Math.min(1, max / Math.max(i.width, i.height)), c = document.createElement("canvas"); c.width = Math.round(i.width * k); c.height = Math.round(i.height * k); c.getContext("2d").drawImage(i, 0, 0, c.width, c.height); const u = c.toDataURL("image/jpeg", q); u.length > 900000 ? no(new Error("Imagem muito grande. Use uma menor.")) : ok(u); }; i.src = r.result; }; r.readAsDataURL(f); });

function login(msg, info){
  stop();
  const mail = h("input", {type:"email", placeholder:"voce@email.com", autocomplete:"username"}), pw = h("input", {type:"password", placeholder:"Sua senha", autocomplete:"current-password"});
  const out = h("p", {class:"empty", style:"color:#ff8a6a"}, msg || ""), ok = h("p", {class:"empty", style:"color:var(--gold)"}, info || "");
  const go = async () => { out.textContent = ""; ok.textContent = ""; try { await signInWithEmailAndPassword(auth, mail.value.trim(), pw.value); } catch (e) { out.textContent = em(e); } };
  const rec = async () => { out.textContent = ""; ok.textContent = ""; if (!mail.value.trim()) { out.textContent = "Digite seu e-mail acima para receber o link."; return; } try { await sendPasswordResetEmail(auth, mail.value.trim()); ok.textContent = "Se este e-mail tiver conta, enviamos o link para criar uma nova senha. Olhe também o spam."; } catch (e) { out.textContent = em(e); } };
  pw.onkeydown = e => { if (e.key === "Enter") go(); };
  mount(h("div", {class:"lg"}, h("div", {class:"box"}, h("div", {class:"brand lgb"}, "NEXORA ", h("span", {class:"gold"}, "3D")), h("p", {class:"sub", style:"text-align:center"}, "Painel do proprietário"), h("label", {}, "E-mail"), mail, h("label", {}, "Senha"), pw, h("button", {class:"btn", style:"width:100%;margin-top:16px", onclick:go}, "Entrar"), h("button", {class:"chip", style:"margin-top:10px", onclick:rec}, "Esqueci minha senha"), out, ok, h("p", {class:"empty"}, h("a", {href:"/", style:"color:var(--mut)"}, "← Voltar para a loja")))));
}

function denied(u){
  stop();
  mount(h("div", {class:"lg"}, h("div", {class:"box"}, h("h3", {class:"gold"}, "Sem acesso ao painel"), h("p", {class:"empty"}, "A conta " + u.email + " entrou, mas ainda não é administradora. O proprietário libera o acesso cadastrando o UID abaixo na coleção admins do Firestore (passo a passo no README)."), h("input", {readonly:true, value:u.uid}), h("div", {style:"margin-top:12px"}, h("button", {class:"btn", onclick:e => { navigator.clipboard && navigator.clipboard.writeText(u.uid); e.target.textContent = "UID copiado ✔"; }}, "Copiar UID"), h("button", {class:"btn ghost", onclick:() => signOut(auth)}, "Sair")))));
}

function panel(u){
  stop();
  const vw = h("main", {class:"wrap pn"}), tabs = h("div", {class:"wrap tabs"});
  const T = [["dash","Dashboard"],["prod","Produtos"],["ped","Pedidos"],["loja","Loja"]], V = {dash, prod:prods, ped:orders, loja:shop};
  DRAW = () => { tabs.replaceChildren(...T.map(([k, l]) => h("button", {class:"tb" + (view === k ? " on" : ""), onclick:() => { view = k; ed = null; DRAW(); }}, l))); vw.replaceChildren(V[view]()); };
  mount(h("header", {}, h("div", {class:"wrap nav"}, h("span", {class:"brand"}, "NEXORA ", h("span", {class:"gold"}, "3D"), " · Painel"), h("div", {}, h("span", {class:"empty", style:"margin-right:10px"}, u.email), h("button", {class:"chip", onclick:() => signOut(auth)}, "Sair"))), tabs), vw);
  const on = (q, fn, vs) => unsubs.push(onSnapshot(q, s => { fn(s); if (vs.includes(view)) DRAW(); }, e => vw.prepend(h("p", {class:"empty", style:"color:#ff8a6a"}, em(e)))));
  on(collection(db, "products"), s => { PR = s.docs.map(d => ({id:d.id, ...d.data()})).sort((a, b) => (a.o || 0) - (b.o || 0)); }, ["dash","prod"]);
  on(query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(300)), s => { OR = s.docs.map(d => ({id:d.id, ...d.data()})); }, ["dash","ped"]);
  on(doc(db, "settings", "store"), s => { ST = s.exists() ? s.data() : {}; }, ["loja"]);
  DRAW();
}

function dash(){
  const sum = a => a.reduce((s, o) => s + (Number(o.total) || 0), 0), paid = OR.filter(o => ["pago","em_producao","enviado","concluido"].includes(o.status)), open = OR.filter(o => o.status === "novo");
  const st = (l, v, s) => h("div", {class:"box stat"}, h("span", {class:"empty"}, l), h("b", {class:"gold"}, v), s ? h("span", {class:"empty"}, s) : null);
  return h("div", {}, h("div", {class:"cards"}, st("Produtos", String(PR.length), PR.filter(p => p.active !== false).length + " ativos"), st("Pedidos", String(OR.length)), st("Pendentes", String(open.length), "aguardando pagamento"), st("Vendas confirmadas", money(sum(paid)), paid.length + " pedidos"), st("A receber", money(sum(open))), st("Concluídos", String(OR.filter(o => o.status === "concluido").length))), h("h3", {class:"gold", style:"margin:22px 0 8px"}, "Últimos pedidos"), OR.length ? OR.slice(0, 5).map(o => orderCard(o, true)) : h("p", {class:"empty"}, "Nenhum pedido ainda."));
}

function orderCard(o, mini){
  const d = o.createdAt && o.createdAt.toDate ? o.createdAt.toDate().toLocaleString("pt-BR") : "agora";
  const ph = String(o.phone || "").replace(/\D/g, ""), wa = ph ? "https://wa.me/" + (ph.length <= 11 ? "55" + ph : ph) : null;
  const sel = h("select", {onchange:() => updateDoc(doc(db, "orders", o.id), {status:sel.value})}, Object.entries(STAT).map(([k, l]) => h("option", {value:k, selected:o.status === k}, l)));
  return h("div", {class:"box oc s-" + o.status}, h("div", {class:"row"}, h("b", {}, o.name || "(sem nome)"), h("span", {class:"empty"}, d)),
    h("p", {class:"empty"}, wa ? h("a", {href:wa, target:"_blank", rel:"noopener", style:"color:var(--gold)"}, o.phone) : (o.phone || ""), o.email ? " · " + o.email : ""),
    h("ul", {class:"ck"}, (o.items || []).map(i => h("li", {}, i.q + "× " + i.n + " — " + money(i.p * i.q)))),
    o.details ? h("p", {class:"empty"}, "Detalhes: " + o.details) : null,
    h("div", {class:"row"}, h("b", {class:"gold"}, money(o.total) + (o.discountPct ? " (−" + o.discountPct + "% fidelidade)" : "")), mini ? h("span", {class:"empty"}, STAT[o.status] || o.status) : sel),
    mini ? null : h("div", {style:"margin-top:8px"}, o.status !== "concluido" ? h("button", {class:"add", onclick:() => updateDoc(doc(db, "orders", o.id), {status:"concluido"})}, "Marcar como concluído") : null, " ", h("button", {class:"chip", onclick:() => confirm("Excluir este pedido?") && deleteDoc(doc(db, "orders", o.id))}, "Excluir")));
}

function orders(){
  const L = flt === "todos" ? OR : OR.filter(o => o.status === flt);
  return h("div", {}, h("div", {class:"chips"}, ["todos", ...Object.keys(STAT)].map(k => h("button", {class:"chip" + (flt === k ? " on" : ""), onclick:() => { flt = k; DRAW(); }}, k === "todos" ? "Todos (" + OR.length + ")" : STAT[k] + " (" + OR.filter(o => o.status === k).length + ")"))), L.length ? L.map(o => orderCard(o)) : h("p", {class:"empty"}, "Nenhum pedido aqui."));
}

function prods(){
  const p = PR.find(x => x.id === ed) || {}; let img = p.img || ""; const f = {};
  const fld = (k, l, t, v) => { const i = h(t === "area" ? "textarea" : "input", t === "area" ? {} : {type:t, step:t === "number" ? "0.01" : null, inputmode:t === "number" ? "decimal" : null}); i.value = v == null ? "" : v; f[k] = i; return [h("label", {}, l), i]; };
  const pv = h("div", {class:"pv"}), msg = h("p", {class:"empty", style:"color:#ff8a6a"});
  const showImg = () => pv.replaceChildren(img ? h("img", {src:img, alt:""}) : h("span", {class:"empty"}, "Sem imagem (será usado o emoji)")); showImg();
  const file = h("input", {type:"file", accept:"image/*", onchange:async () => { const x = file.files[0]; if (!x) return; try { img = await shrink(x, 800, .8); showImg(); msg.textContent = ""; } catch (e) { msg.textContent = e.message; } }});
  const url = h("input", {type:"url", placeholder:"ou cole o link https:// da imagem", onchange:() => { img = url.value.trim(); showImg(); }});
  const act = h("input", {type:"checkbox", style:"width:auto"}); act.checked = p.active !== false;
  const save = async () => { const n = f.n.value.trim(); if (!n) { msg.textContent = "Digite o nome do produto."; return; }
    const data = {n, p:parseFloat(f.p.value) || 0, c:f.c.value.trim() || "Geral", e:f.e.value.trim() || "📦", d:f.d.value.trim(), img, active:act.checked};
    try { if (ed) await updateDoc(doc(db, "products", ed), data); else await addDoc(collection(db, "products"), {...data, o:Date.now()}); ed = null; DRAW(); } catch (e) { msg.textContent = em(e); } };
  const form = h("div", {class:"box"}, h("h3", {class:"gold"}, ed ? "Editar produto" : "Adicionar produto"), fld("n", "Nome do produto", "text", p.n), fld("p", "Preço (R$) — 0 = sob orçamento", "number", p.p), fld("c", "Categoria", "text", p.c), fld("e", "Emoji (usado se não houver imagem)", "text", p.e), fld("d", "Descrição", "area", p.d), h("label", {}, "Imagem do produto"), pv, file, url, h("label", {style:"display:flex;gap:8px;align-items:center"}, act, " Produto ativo (visível na loja)"), h("div", {style:"margin-top:14px"}, h("button", {class:"btn", onclick:save}, ed ? "Salvar alterações" : "Adicionar produto"), ed ? h("button", {class:"btn ghost", onclick:() => { ed = null; DRAW(); }}, "Cancelar") : null, h("button", {class:"chip", style:"margin-left:8px", onclick:() => { img = ""; showImg(); }}, "Remover imagem")), msg);
  const list = PR.map(x => h("div", {class:"box pr"}, h("div", {class:"th"}, x.img ? h("img", {src:x.img, alt:""}) : h("span", {}, x.e || "📦")), h("div", {class:"gr"}, h("b", {}, x.n), h("div", {class:"empty"}, (x.p ? money(x.p) : "Orçamento") + " · " + (x.c || "Geral")), h("label", {style:"display:flex;gap:6px;align-items:center;margin:4px 0 0"}, h("input", {type:"checkbox", style:"width:auto", checked:x.active !== false, onchange:e => updateDoc(doc(db, "products", x.id), {active:e.target.checked})}), " Ativo")), h("div", {}, h("button", {class:"chip", onclick:() => { ed = x.id; DRAW(); scrollTo(0, 0); }}, "Editar"), " ", h("button", {class:"chip", onclick:() => confirm("Excluir " + x.n + "?") && deleteDoc(doc(db, "products", x.id))}, "Excluir"))));
  const seed = h("button", {class:"btn ghost", onclick:() => Promise.all(SEED.map((x, i) => addDoc(collection(db, "products"), {n:x[0], c:x[1], e:x[2], p:x[3], d:x[4], img:"", active:true, o:i})))}, "Importar os 9 produtos padrão");
  return h("div", {}, PR.length ? null : h("div", {class:"box"}, h("p", {class:"empty"}, "O banco ainda está vazio e a loja mostra os produtos padrão. Importe-os antes de cadastrar o primeiro produto novo, senão eles somem da loja."), seed), form, h("h3", {class:"gold", style:"margin:22px 0 8px"}, "Produtos (" + PR.length + ")"), list);
}

function shop(){
  const f = {}, b = {v:ST.banner || ""};
  const fld = (k, l, area, ph) => { const i = h(area ? "textarea" : "input", {placeholder:ph || ""}); i.value = ST[k] || ""; f[k] = i; return [h("label", {}, l), i]; };
  const pv = h("div", {class:"pv"}), msg = h("p", {class:"empty"});
  const show = () => pv.replaceChildren(b.v ? h("img", {src:b.v, alt:""}) : h("span", {class:"empty"}, "Sem banner (usa a animação da impressora 3D)")); show();
  const file = h("input", {type:"file", accept:"image/*", onchange:async () => { const x = file.files[0]; if (!x) return; try { b.v = await shrink(x, 1400, .75); show(); } catch (e) { msg.style.color = "#ff8a6a"; msg.textContent = e.message; } }});
  const save = async () => { const d = {banner:b.v}; for (const k in f) d[k] = f[k].value.trim(); msg.style.color = "var(--gold)"; msg.textContent = "Salvando…"; try { await setDoc(doc(db, "settings", "store"), d, {merge:true}); msg.textContent = "Salvo! A loja já foi atualizada ✔"; } catch (e) { msg.style.color = "#ff8a6a"; msg.textContent = em(e); } };
  return h("div", {class:"box"}, h("h3", {class:"gold"}, "Personalização da loja"), h("p", {class:"empty"}, "Campos em branco mantêm o texto original do site."), fld("heroTitle", "Título da página inicial", 0, "Transforme ideias em realidade com"), fld("heroEm", "Destaque do título (dourado)", 0, "impressão 3D!"), fld("heroText", "Texto de apresentação", 1), fld("tagline", "Linha abaixo do logo", 0, "PERSONALIZAÇÃO • DESIGN • IMPRESSÃO 3D"), fld("slogan", "Slogan do rodapé", 0, "Ideias que ganham forma."), fld("whatsapp", "WhatsApp (país + DDD + número)", 0, "5561999999999"), fld("email", "E-mail que recebe os pedidos", 0), fld("info", "Informações no rodapé (endereço, horário, Instagram…)", 1), h("label", {}, "Banner da página inicial"), pv, file, h("button", {class:"chip", style:"margin-top:8px", onclick:() => { b.v = ""; show(); }}, "Remover banner"), h("div", {style:"margin-top:16px"}, h("button", {class:"btn", onclick:save}, "Salvar alterações")), msg);
}

await setPersistence(auth, browserLocalPersistence).catch(() => {});
onAuthStateChanged(auth, async u => {
  if (!u || u.isAnonymous) { login(); return; }
  try { const s = await getDoc(doc(db, "admins", u.uid)); s.exists() ? panel(u) : denied(u); } catch (e) { denied(u); }
});
