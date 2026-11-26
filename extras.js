var LS="nexora3d";
function ld(){try{return JSON.parse(localStorage.getItem(LS))||{}}catch(x){return {}}}
function sv(o){try{localStorage.setItem(LS,JSON.stringify(o))}catch(x){}}
function disc(){return Math.min((ld().orders||0)*5,15)}
function sub(){var t=0;Object.keys(cart).forEach(function(i){t+=P.filter(function(y){return y.id==i})[0].p*cart[i]});return t}
tot=function(){return sub()*(1-disc()/100)};
var _r=render;render=function(){_r();var d=disc();$("tot").textContent=R(sub()*(1-d/100));$("dl").textContent=d?"🎁 Desconto fidelidade de "+d+"% aplicado!":"Compre e ganhe desconto na próxima compra!"};
var _m=msg;msg=function(){var m=_m(),d=disc();return d?m+"\n*Desconto fidelidade:* "+d+"% → total a pagar: "+R(tot()):m};
function pre(){var d=ld();if(d.n)$("n").value=d.n;if(d.t)$("t").value=d.t;if(d.e)$("e").value=d.e}
var cnt=false;
function won(){if(cnt)return;cnt=true;var d=ld();d.orders=(d.orders||0)+1;sv(d);$("gift").textContent="🎁 Pedido registrado! Você ganhou "+disc()+"% de desconto na próxima compra (salvo neste aparelho)."}
$("bw").addEventListener("click",won);$("bm").addEventListener("click",won);
var _s=$("send").onclick;
$("send").onclick=function(){_s();if($("ok").style.display!="block")return;cnt=false;
var m=decodeURIComponent($("bw").href.split("text=")[1]||"");
$("bm").href="https://mail.google.com/mail/?view=cm&fs=1&to="+encodeURIComponent(EMAIL)+"&su="+encodeURIComponent("Novo pedido — NEXORA 3D")+"&body="+encodeURIComponent(m);
$("bm").target="_blank";$("bm").rel="noopener";
if($("sd").checked){var d=ld();d.n=$("n").value;d.t=$("t").value;d.e=$("e").value;sv(d)}};
var _n=$("nw").onclick;$("nw").onclick=function(){_n();pre();$("gift").textContent="";render()};
$("cd").onclick=function(){var d=ld();delete d.n;delete d.t;delete d.e;sv(d);$("f").reset();$("err").textContent="Dados salvos apagados deste aparelho."};
pre();render();
document.body.insertAdjacentHTML("beforeend",'<button class="bb" id="bb">🤖 NEXORA DÚVIDAS</button><div class="bp" id="bp"><div class="bh"><span class="gold">NEXORA DÚVIDAS</span><span id="bx" style="cursor:pointer">✕</span></div><div class="bm2" id="bms"></div><div class="qk" id="qk"></div><div class="bi"><input id="bin" placeholder="Escreva a sua dúvida" enterkeyhint="send"><button class="add" id="bs">Enviar</button></div></div>');
var KB=[
[["desconto","fidelidade","cupom","promoc"],"A cada pedido você ganha 5% de desconto na próxima compra, acumulando até 15%. O desconto fica salvo neste aparelho e é aplicado sozinho no carrinho."],
[["pix","pagamento","pagar","qr"],"O pagamento é por Pix. Ao finalizar, geramos o QR Code com o valor exato (ou use o copia e cola). Depois de pagar, toque em Enviar pedido + comprovante e anexe o comprovante no WhatsApp. O pedido só entra em produção depois que o pagamento for confirmado."],
[["prazo","entrega","demora","frete","envio"],"O prazo e a entrega dependem do item e da personalização. Combinamos tudo pelo WhatsApp assim que recebermos o seu pedido."],
[["dados","salvar","cadastro","conta"],"Marque Salvar meus dados neste aparelho no formulário do pedido: nome, WhatsApp e e-mail ficam guardados só no seu aparelho e já vêm preenchidos na próxima vez. Dá para apagar quando quiser."],
[["personaliz","logo"," cor ","medida","gravar"],"Sim, personalizamos! Descreva nome, cor, logo ou medidas no campo Detalhes do pedido, ou escolha Projeto sob encomenda."],
[["empresa","brinde","orcamento","atacado","quantidade"],"Atendemos pessoas e empresas. Para brindes ou quantidades maiores, escolha Projeto sob encomenda ou chame no WhatsApp para receber um orçamento."],
[["whatsapp","gmail","email","contato","falar"],"Você pode falar com a gente pelo botão verde do WhatsApp. Seus pedidos também podem ser enviados por Gmail depois do pagamento."],
[["preco","valor","quanto","custa"],"Os preços aparecem em cada produto, na aba Produtos. Itens sob encomenda têm o valor combinado pelo WhatsApp."],
[["comprar","pedido","como","carrinho"],"Para comprar: 1) abra a aba Produtos e toque em Comprar; 2) preencha seus dados na aba Pedido; 3) pague o Pix; 4) envie o pedido e o comprovante pelo WhatsApp."],
[["material","filamento","resist"],"Para detalhes de material, cor e acabamento de cada peça, pergunte pelo botão verde do WhatsApp."],
[[" oi "," ola ","bom dia","boa tarde","boa noite"],"Olá! Eu sou o NEXORA DÚVIDAS 🤖. Pergunte sobre produtos, pagamento, prazo, desconto ou personalização."]
];
function ans(q){q=" "+q.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")+" ";for(var i=0;i<KB.length;i++)for(var j=0;j<KB[i][0].length;j++)if(q.indexOf(KB[i][0][j])>=0)return KB[i][1];return "Não encontrei essa resposta por aqui. Toque no botão verde do WhatsApp e fale com a gente!"}
function say(t,w){var d=document.createElement("div");d.className="m "+w;d.textContent=t;$("bms").appendChild(d);$("bms").scrollTop=1e5}
function ask(t){t=t.trim();if(!t)return;say(t,"u");setTimeout(function(){say(ans(t),"b")},450)}
["Como comprar","Pagamento","Prazo","Desconto","Personalizar"].forEach(function(q){var b=document.createElement("button");b.className="chip";b.textContent=q;b.onclick=function(){ask(q)};$("qk").appendChild(b)});
var hi=false;$("bb").onclick=function(){$("bp").classList.toggle("on");if(!hi){hi=true;say("Olá! Eu sou o NEXORA DÚVIDAS 🤖. Escreva a sua dúvida sobre o site ou toque numa opção abaixo.","b")}};
$("bx").onclick=function(){$("bp").classList.remove("on")};
$("bs").onclick=function(){ask($("bin").value);$("bin").value=""};
$("bin").addEventListener("keydown",function(e){if(e.key=="Enter"){ask($("bin").value);$("bin").value=""}});
