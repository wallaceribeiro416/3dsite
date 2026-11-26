var P=[
{id:1,n:"Gato decorativo low poly",c:"Decoração",e:"🐱",p:49.9,d:"Peça decorativa facetada, várias cores."},
{id:2,n:"Vaso espiral",c:"Decoração",e:"🏺",p:59.9,d:"Vaso moderno com textura em espiral."},
{id:3,n:"Porta-canetas com logo",c:"Empresas",e:"🖊️",p:39.9,d:"Organizador de mesa com sua marca."},
{id:4,n:"Luminária árvore",c:"Presentes",e:"💡",p:89.9,d:"Luminária recortada com luz quente."},
{id:5,n:"Chaveiro personalizado",c:"Brindes",e:"🔑",p:12.9,d:"Com nome, logo ou desenho à sua escolha."},
{id:6,n:"Suporte de celular",c:"Organização",e:"📱",p:29.9,d:"Suporte firme para mesa, personalizável."},
{id:7,n:"Vasinho suculenta",c:"Decoração",e:"🪴",p:24.9,d:"Vaso geométrico para suculentas."},
{id:8,n:"Placa “Sua Marca”",c:"Empresas",e:"🏷️",p:69.9,d:"Placa para balcão ou mesa com seu logo."},
{id:9,n:"Projeto sob encomenda",c:"Presentes",e:"✨",p:0,d:"Mande sua ideia e criamos para você."}
];
var cart={},cat="Todos",$=function(i){return document.getElementById(i)};
var R=function(v){return "R$ "+v.toFixed(2).replace(".",",")};
function chips(){var cs=["Todos"];P.forEach(function(x){if(cs.indexOf(x.c)<0)cs.push(x.c)});
$("chips").innerHTML=cs.map(function(c){return '<button class="chip'+(c==cat?' on':'')+'" data-c="'+c+'">'+c+'</button>'}).join("")}
function grid(){$("grid").innerHTML=P.filter(function(x){return cat=="Todos"||x.c==cat}).map(function(x){
return '<div class="prod"><div class="pic">'+x.e+'</div><div class="pb"><h3>'+x.n+'</h3><p>'+x.d+'</p><div class="row"><span class="price">'+(x.p?R(x.p):"Orçamento")+'</span><button class="add" data-a="'+x.id+'">Comprar</button></div></div></div>'}).join("")}
function render(){var ids=Object.keys(cart),n=0,t=0;
$("items").innerHTML=ids.length?ids.map(function(i){var x=P.filter(function(y){return y.id==i})[0],q=cart[i];n+=q;t+=q*x.p;
return '<div class="it"><span>'+x.n+'</span><span class="q"><button data-m="'+i+'">−</button><span>'+q+'</span><button data-p="'+i+'">+</button></span></div>'}).join(""):'<div class="empty">Seu carrinho está vazio. Adicione produtos acima.</div>';
$("cc").textContent=n;$("tot").textContent=R(t)}
document.addEventListener("click",function(e){var t=e.target;
if(t.dataset.c){cat=t.dataset.c;chips();grid()}
if(t.dataset.tab){e.preventDefault();show(t.dataset.tab)}
if(t.dataset.a||t.dataset.p){var i=t.dataset.a||t.dataset.p;cart[i]=(cart[i]||0)+1;render();if(t.dataset.a){t.textContent="✔ Adicionado";setTimeout(function(){t.textContent="Comprar"},900)}}
if(t.dataset.m){var k=t.dataset.m;cart[k]--;if(cart[k]<=0)delete cart[k];render()}});
$("cb").onclick=function(){show("pedido")};
function msg(){var L=["*NOVO PEDIDO — NEXORA 3D*","","Nome: "+$("n").value,"WhatsApp: "+$("t").value];
if($("e").value)L.push("E-mail: "+$("e").value);L.push("","*Itens:*");var t=0;
Object.keys(cart).forEach(function(i){var x=P.filter(function(y){return y.id==i})[0];t+=x.p*cart[i];L.push("• "+cart[i]+"x "+x.n+(x.p?" ("+R(x.p)+")":" (orçamento)"))});
L.push("","Total estimado: "+R(t));if($("d").value)L.push("","Detalhes: "+$("d").value);return L.join("\n")}
$("send").onclick=function(){
if(!$("n").value.trim()||!$("t").value.trim()){$("err").textContent="Preencha seu nome e WhatsApp.";return}
if(!Object.keys(cart).length){$("err").textContent="Adicione ao menos um produto ao carrinho.";return}
$("err").textContent="";var m=msg();
$("bw").href="https://wa.me/"+WHATSAPP+"?text="+encodeURIComponent(m);
$("bm").href="mailto:"+EMAIL+"?subject="+encodeURIComponent("Novo pedido — NEXORA 3D")+"&body="+encodeURIComponent(m);
$("f").style.display="none";$("ok").style.display="block";
if(WHATSAPP)window.open($("bw").href,"_blank")};
$("nw").onclick=function(){cart={};render();$("f").reset();$("f").style.display="block";$("ok").style.display="none"};
$("wa").href="https://wa.me/"+WHATSAPP+"?text="+encodeURIComponent("Olá! Preciso de ajuda para comprar no app da NEXORA 3D.");
function show(n){document.querySelectorAll(".tab").forEach(function(x){x.classList.toggle("on",x.id=="t-"+n)});document.querySelectorAll(".tb").forEach(function(x){x.classList.toggle("on",x.dataset.tab==n)});window.scrollTo(0,0)}
function crc(s){var c=0xFFFF;for(var i=0;i<s.length;i++){c^=s.charCodeAt(i)<<8;for(var j=0;j<8;j++)c=(c&0x8000)?((c<<1)^0x1021):(c<<1);c&=0xFFFF}return c.toString(16).toUpperCase().padStart(4,"0")}
function pix(v){var a=v.toFixed(2),s=PIX_A+"54"+("0"+a.length).slice(-2)+a+PIX_B+"6304";return s+crc(s)}
function tot(){var t=0;Object.keys(cart).forEach(function(i){t+=P.filter(function(y){return y.id==i})[0].p*cart[i]});return t}
$("send").onclick=function(){
if(!$("n").value.trim()||!$("t").value.trim()){$("err").textContent="Preencha seu nome e WhatsApp.";return}
if(!Object.keys(cart).length){$("err").textContent="Adicione ao menos um produto ao carrinho.";return}
$("err").textContent="";var v=tot(),m=msg();
if(v>0){var code=pix(v);$("pv").textContent=R(v);$("pc").value=code;$("qr").innerHTML="";$("qr").style.display="inline-block";
try{new QRCode($("qr"),{text:code,width:220,height:220,correctLevel:QRCode.CorrectLevel.M})}catch(x){$("qr").style.display="none"}
m+="\n\n*Pagamento:* Pix de "+R(v)+". Comprovante em anexo.\n_Liberar o pedido só após confirmar o recebimento._"}
else{$("pv").textContent="a combinar";$("pc").value="";$("qr").style.display="none";m+="\n\n*Pagamento:* itens sob orçamento, aguardando valor."}
$("bw").href="https://wa.me/"+WHATSAPP+"?text="+encodeURIComponent(m);
$("bm").href="mailto:"+EMAIL+"?subject="+encodeURIComponent("Novo pedido — NEXORA 3D")+"&body="+encodeURIComponent(m);
$("f").style.display="none";$("ok").style.display="block"};
$("cp").onclick=function(){$("pc").select();try{navigator.clipboard.writeText($("pc").value)}catch(x){document.execCommand("copy")}$("cp").textContent="Copiado ✔"};
chips();grid();render();
