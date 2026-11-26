var pb=document.createElement("button");pb.id="pb";pb.className="btn";pb.style.cssText="position:fixed;left:0;right:0;margin:0 auto;width:max-content;max-width:90vw;bottom:calc(84px + env(safe-area-inset-bottom,0px));z-index:29;padding:9px 18px;font-size:13px;display:none";document.body.appendChild(pb);
pb.onclick=function(){show("pedido")};
function upd(){var n=0;Object.keys(cart).forEach(function(k){n+=cart[k]});var on=document.getElementById("t-pedido").classList.contains("on");pb.style.display=(n&&!on)?"block":"none";pb.textContent="Prosseguir com a compra ("+n+") \u2192"}
var _r2=render;render=function(){_r2();upd()};var _sh=show;show=function(n){_sh(n);upd()};upd();
