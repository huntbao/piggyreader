!function(e){"use strict";var a,t=function(){e.jps.publish("hide-all-mask-layers");var a=e("h3 a"),t=window.putianHospitalDataJiZhuReader.names,r=window.putianHospitalDataJiZhuReader.urls;a.forEach(function(a){a.removeAttribute("onmousedown");var i=a.cloneNode(!0);a.parentNode.replaceChild(i,a);for(var n=i.parentNode.parentNode,o=n.innerText,u=!1,s=0;s<t.length;s++)if(-1!==o.indexOf(t[s])){e.jps.publish("create-mask-layer",n,"putian",t[s]),u=!0;break}if(!u)for(var s=0;s<r.length;s++)if(-1!==o.indexOf(r[s])){e.jps.publish("create-mask-layer",n,"putian",r[s]);break}})},r=function(){clearTimeout(a),a=setTimeout(t,10)};r();var i=new MutationObserver(function(e){e.forEach(function(e){r()})}),n={attributes:!0,childList:!0,characterData:!0};i.observe(document.querySelector("title"),n)}(Zepto);