!function(r){"use strict";var e={__layerEl:null,__isEntered:!1,init:function(e){"string"==typeof e&&(e=JSON.parse(e));var a=this;a.__hideLayer(),console.log(e),e.init?a.__layerEl=r(a.getInitTip(e.words)):(a.__layerEl=r(a.getWordsStr(e.dictDataArr)),a.__layerElWrap=a.__layerEl.find(".jz-mod-dict-checkresult-layer-wrap"),a.__layerElWrap.mouseup(function(r){r.stopPropagation()}),r(document).mouseup(function(){a.__hideLayer()})),r(document.body).addClass("jz-mod-dict-hidden-scroll"),a.__layerEl.appendTo(document.body)},__hideLayer:function(){var r=this;r.__layerEl&&r.__layerEl.remove(),r.__layerEl=null},getWordStr:function(r,e){Object.keys(r);var t="";r.phoneticSymbol&&r.phoneticSymbol.split(", ").forEach(function(r){t+='<span class="jz-phonetic-symbol">['+r+"]</span>"});var l="";r.translation&&r.translation.forEach(function(r){l+='<span class="jz-phrase-tran">'+r+"</span>"});var n=a.replace(/{{num}}/,e).replace(/{{phrase}}/,r.phrase).replace(/{{phoneticSymbol}}/,t);return n=l?n.replace(/{{translation}}/,l):n.replace(/{{translation}}/,"拼写错误，请在页面使用 Command+F 搜索确认").replace(/jz-layer-worditem/,"jz-layer-worditem jz-layer-worditem-error")},getWordsStr:function(r){var e=this,a="",l=0,n=[],i=[];return r.forEach(function(r){r.translation&&r.translation.length?i.push(r):n.push(r)}),n.forEach(function(r){a+=e.getWordStr(r,++l)}),i.forEach(function(r){a+=e.getWordStr(r,++l)}),t.replace(/{{words}}/,a)},getInitTip:function(r){return l.replace(/{{num}}/,r.length).replace(/{{words}}/,r.join(", "))}},a='<div class="jz-layer-worditem">    <div class="jz-layer-worditem-wrap">        <span class="jz-word">{{num}}. {{phrase}}: </span>        {{phoneticSymbol}}        <span class="jz-trans-items">        {{translation}}        </span>    </div></div>',t='<div class="jz-mod-dict-checkresult-layer">   <div class="jz-mod-dict-checkresult-layer-wrap">       {{words}}   </div></div>',l='<div class="jz-mod-dict-checkresult-layer">   <div class="jz-mod-dict-checkresult-layer-wrap">       <div class="jz-mod-dict-checkresult-layer-init">共找到 {{num}} 个单词，正在查询中，请稍候...</div>       <div>{{words}}</div>   </div></div>';App.modules.dictCheckResultLayer=e}(Zepto);