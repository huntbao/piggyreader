!function(e){"use strict";var a,t=function(){e.jps.publish("hide-all-mask-layers");var a=e("a[href]");a.forEach(function(a){if("搜狗推广"==a.text){var t=a.parentNode,r=t.getBoundingClientRect();r.left>200&&(t=a.parentNode.parentNode),e.jps.publish("create-mask-layer",t)}});var t=e("h3 a"),r=window.putianHospitalDataJiZhuReader.names,i=window.putianHospitalDataJiZhuReader.urls;t.forEach(function(a){for(var t=a.parentNode.parentNode,n=t.innerText,o=!1,u=0;u<r.length;u++)if(n.indexOf(r[u])!==-1){e.jps.publish("create-mask-layer",t,"putian",r[u]),o=!0;break}if(!o)for(var u=0;u<i.length;u++)if(n.indexOf(i[u])!==-1){e.jps.publish("create-mask-layer",t,"putian",i[u]);break}})},r=function(){clearTimeout(a),a=setTimeout(t,10)};r();var i=new MutationObserver(function(e){e.forEach(function(e){r()})}),n={attributes:!0,childList:!0,characterData:!0};i.observe(document.querySelector("title"),n)}(Zepto);