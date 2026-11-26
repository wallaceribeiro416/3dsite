document.getElementById("items").insertAdjacentHTML("afterend",'<button type="button" class="chip" id="ec" style="margin-top:6px">Esvaziar carrinho</button>');
document.getElementById("gift").insertAdjacentHTML("beforebegin",'<div style="margin-top:14px"><button type="button" class="chip" id="cx1">Cancelar pedido</button> <a class="chip" id="cx2" target="_blank" rel="noopener" style="text-decoration:none;display:none">Já enviei e quero cancelar</a></div>');
$("ec").onclick=function(){cart={};render()};
$("cx1").onclick=function(){$("ok").style.display="none";$("f").style.display="block";$("err").textContent="Pedido cancelado. Seu carrinho foi mantido."};
function sent(){var m=decodeURIComponent($("bw").href.split("text=")[1]||"");
$("cx2").href="https://wa.me/"+WHATSAPP+"?text="+encodeURIComponent("*CANCELAR PEDIDO — NEXORA 3D*\nQuero cancelar o pedido abaixo. Se já paguei, combinamos o estorno por aqui.\n\n"+m);
$("cx2").style.display="inline-block";$("cx1").style.display="none"}
$("bw").addEventListener("click",sent);$("bm").addEventListener("click",sent);
$("cx2").addEventListener("click",function(){var d=ld();if(cnt&&d.orders){d.orders=Math.max(0,d.orders-1);sv(d)}cnt=true;$("gift").textContent="Cancelamento enviado. O desconto ganho com este pedido foi desfeito.";render()});
var _s3=$("send").onclick;$("send").onclick=function(){_s3();if($("ok").style.display=="block"){$("cx1").style.display="inline-block";$("cx2").style.display="none"}};
