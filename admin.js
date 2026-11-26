import {firebaseConfig} from "./firebase-config.js";
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {getAuth,signInAnonymously,onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {getFirestore,collection,doc,onSnapshot,setDoc,updateDoc,deleteDoc,addDoc} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
const app=initializeApp(firebaseConfig);
const auth=getAuth(app),db=getFirestore(app),D=window.P.slice();
let uid=null,ownerUid=null,me=null,eds=[],fromDb=false,unE=null,msg="";
const isOwner=()=>!!uid&&ownerUid===uid,canEdit=()=>isOwner()||(me&&me.status==="approved");
function el(tag,txt,cls,fn){const e=document.createElement(tag);if(txt!=null)e.textContent=txt;if(cls)e.className=cls;if(fn)e.onclick=fn;return e}
const dev=()=>{const u=navigator.userAgent;return (["iPhone","iPad","Android","Windows","Macintosh","Linux"].find(k=>u.includes(k))||"Aparelho")+" · "+(/CriOS|Chrome/.test(u)?"Chrome":/Safari/.test(u)?"Safari":"navegador")};
function apply(){Object.keys(window.cart).forEach(k=>{if(!window.P.some(p=>String(p.id)===k))delete window.cart[k]});if(!window.P.some(p=>p.c===window.cat))window.cat="Todos";window.chips();window.grid();window.render()}
document.head.insertAdjacentHTML("beforeend","<style>.am{position:fixed;inset:0;z-index:50;background:rgba(0,0,0,.85);display:none;overflow:auto;padding:calc(16px + env(safe-area-inset-top,0px)) 16px 40px}.am.on{display:block}.ap{max-width:560px;margin:auto;background:var(--card);border:1px solid var(--gold3);border-radius:18px;padding:18px}.pc{border:1px solid var(--line);border-radius:12px;padding:10px;margin:10px 0}.pc input{margin:4px 0}.pc button{margin:6px 6px 0 0}</style>");
document.body.insertAdjacentHTML("beforeend",'<div class="am" id="am"><div class="ap"><div class="row"><b class="gold">Área do editor</b><span id="ax" style="cursor:pointer;font-size:20px">✕</span></div><div id="ab"></div></div></div>');
document.querySelector("footer .wrap").insertAdjacentHTML("beforeend",'<p style="margin-top:10px"><a href="#" id="adl" style="color:var(--mut)">Área do editor</a></p>');
const $$=i=>document.getElementById(i);
$$("adl").onclick=e=>{e.preventDefault();$$("am").classList.add("on");paint()};
$$("ax").onclick=()=>$$("am").classList.remove("on");
const claim=()=>setDoc(doc(db,"config","owner"),{uid}).catch(()=>{msg="Não foi possível: já existe dono ou as regras ainda não foram publicadas.";paint()});
const ask=n=>{if(!n.trim()){msg="Digite um nome para este aparelho.";paint();return}msg="";setDoc(doc(db,"editors",uid),{name:n.trim().slice(0,40),device:dev(),status:"pending",at:Date.now()}).catch(()=>{msg="Erro ao enviar o pedido.";paint()})};
function paint(){const b=$$("ab");if(!b)return;b.replaceChildren();
$$("adl").textContent="Área do editor"+(isOwner()&&eds.some(x=>x.status==="pending")?" 🔴":"");
if(msg)b.append(el("p",msg,"empty"));
if(!uid){b.append(el("p","Conectando…","empty"));return}
if(!ownerUid){b.append(el("p","Este site ainda não tem dono. Toque abaixo para este celular ser o dono.","empty"),el("button","Tornar este celular o dono","btn",claim));return}
if(!canEdit()){
if(me&&me.status==="pending"){b.append(el("p","Pedido enviado! Aguarde o dono autorizar este aparelho.","empty"));const a=el("a","Avisar o dono no WhatsApp","btn ghost");a.href="https://wa.me/"+window.WHATSAPP+"?text="+encodeURIComponent("Pedi acesso de editor no site NEXORA 3D: "+me.name+" ("+me.device+")");a.target="_blank";b.append(a)}
else{const i=el("input");i.placeholder="Nome deste aparelho (ex.: iPhone do João)";b.append(el("h3","Pedir acesso de editor"),i,el("button","Pedir acesso","btn",()=>ask(i.value)))}
return}
if(isOwner()){b.append(el("h3","Pedidos e editores","gold"));if(!eds.length)b.append(el("p","Nenhum pedido ainda.","empty"));
eds.forEach(x=>{const r=el("div",null,"pc");r.append(el("b",x.name),el("p",x.device+" · "+(x.status==="approved"?"autorizado":"aguardando"),"empty"));if(x.status!=="approved")r.append(el("button","Autorizar","add",()=>updateDoc(doc(db,"editors",x.id),{status:"approved"})));r.append(el("button",x.status==="approved"?"Remover":"Recusar","chip",()=>deleteDoc(doc(db,"editors",x.id))));b.append(r)})}
b.append(el("h3","Produtos e preços","gold"));
if(!fromDb){b.append(el("p","Os produtos ainda não estão no banco. Salve os padrão para poder editar.","empty"),el("button","Salvar produtos padrão","btn",()=>D.forEach((x,i)=>setDoc(doc(db,"products","p"+x.id),{n:x.n,c:x.c,e:x.e,p:x.p,d:x.d,o:i}))));return}
{const c=el("div",null,"pc"),f={};c.append(el("b","Adicionar produto","gold"));
[["n","Nome do produto"],["e","Emoji (ex.: 🐱)"],["p","Preço (R$)"],["c","Categoria"],["d","Descrição"]].forEach(([k,l])=>{const i=el("input");i.placeholder=l;i.setAttribute("aria-label",l);if(k==="p"){i.type="number";i.step="0.01";i.inputMode="decimal"}f[k]=i;c.append(i)});
const er=el("p","","empty");
c.append(el("button","Adicionar produto","btn",()=>{if(!f.n.value.trim()){er.textContent="Digite o nome do produto.";return}addDoc(collection(db,"products"),{n:f.n.value.trim(),e:f.e.value||"📦",p:parseFloat(f.p.value)||0,c:f.c.value.trim()||"Geral",d:f.d.value.trim(),o:Date.now()}).catch(()=>{er.textContent="Sem permissão para adicionar."})}),er);b.append(c)}
b.append(el("h3","Produtos cadastrados","gold"));
window.P.forEach(x=>{const c=el("div",null,"pc"),f={};
[["n","Nome"],["e","Emoji"],["p","Preço (R$)"],["c","Categoria"],["d","Descrição"]].forEach(([k,l])=>{const i=el("input");i.placeholder=l;i.value=x[k];i.setAttribute("aria-label",l);if(k==="p"){i.type="number";i.step="0.01"}f[k]=i;c.append(i)});
c.append(el("button","Salvar","add",function(){this.textContent="Salvando…";updateDoc(doc(db,"products",x.id),{n:f.n.value,e:f.e.value,p:parseFloat(f.p.value)||0,c:f.c.value||"Geral",d:f.d.value}).then(()=>{this.textContent="Salvo ✔"}).catch(()=>{this.textContent="Sem permissão"})}),el("button","Excluir","chip",()=>deleteDoc(doc(db,"products",x.id))));b.append(c)});
}
onSnapshot(collection(db,"products"),s=>{fromDb=s.size>0;window.P=fromDb?s.docs.map(d=>{const x=d.data();return{id:d.id,n:x.n||"",c:x.c||"Geral",e:x.e||"📦",p:Number(x.p)||0,d:x.d||"",o:x.o||0}}).sort((a,b)=>a.o-b.o):D.slice();apply();paint()},()=>{});
signInAnonymously(auth).catch(()=>{msg="Login anônimo falhou: ative Authentication → Anônimo e adicione o domínio do site em Domínios autorizados.";paint()});
onAuthStateChanged(auth,u=>{if(!u)return;uid=u.uid;
onSnapshot(doc(db,"config","owner"),s=>{ownerUid=s.exists()?s.data().uid:null;if(isOwner()&&!unE)unE=onSnapshot(collection(db,"editors"),q=>{eds=q.docs.map(d=>({id:d.id,...d.data()}));paint()},()=>{});paint()},()=>{});
onSnapshot(doc(db,"editors",uid),s=>{me=s.exists()?s.data():null;paint()},()=>{})});
