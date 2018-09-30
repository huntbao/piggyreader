!function(e){"use strict";var t={__mousemoveTimer:null,__getSelectedPhraseTimer:null,__prevPointedContainer:null,__prevPointedAnchorOffset:null,__prevPointedFocusOffset:null,__options:null,init:function(t){var n=this;n.__options=t;var o=t.container||e(document);o.keydown(function(){e.jps.publish("hide-dict-layer")}),"selection"===n.__options.dictLookup&&e(o).mouseup(function(t){e(t.target).is("input, textarea")||setTimeout(function(){n.getSelectedPhrase()},0)}),"hover"===n.__options.dictLookup&&(o.mousemove(function(e){e.stopPropagation(),clearTimeout(n.__mousemoveTimer),n.__mousemoveTimer=setTimeout(function(){n.getPointedPhrase(e)},300)}),e(o).mouseleave(function(e){n.__hideDictLayer()}))},__hideDictLayer:function(){var t=this;clearTimeout(t.__mousemoveTimer),e.jps.publish("hide-dict-layer");var n=window.getSelection();n.removeAllRanges()},getSelectedPhrase:function(t){var n=this;clearTimeout(n.__getSelectedPhraseTimer),n.__getSelectedPhraseTimer=setTimeout(function(){var o=document.getSelection(),i=o.toString().trim();if(i){var r=i.toLowerCase().replace(/\s|-|’/g,"");/^[a-z]+$/g.test(r)&&e.jps.publish("lookup-phrase",{phrase:i,position:n.getSeletionPosition(o),isSamePhraseWithPrevious:t,from:n.__options.from})}else e.jps.publish("hide-dict-layer")},230)},getSeletionPosition:function(e){var t={left:0,top:0,right:0,bottom:0,width:0,height:0},n=e.getRangeAt(0);return n.collapsed||(t=n.getBoundingClientRect()),t},getPointedPhrase:function(e){var t=this,n=function(e){return e=e.toLowerCase().replace(/-|’/g,""),/^[a-z]*$/g.test(e)},o=document.caretRangeFromPoint(e.clientX,e.clientY);if(!o)return!0;var i=o.startOffset,r=o.endOffset,a=o.cloneRange(),s="";if(o.startContainer.data)for(;i>=1;)if(a.setStart(o.startContainer,--i),s=a.toString(),!n(s.charAt(0))){a.setStart(o.startContainer,i+1);break}if(o.endContainer.data)for(;r<o.endContainer.data.length;)if(a.setEnd(o.endContainer,++r),s=a.toString(),!n(s.charAt(s.length-1))){a.setEnd(o.endContainer,r-1);break}var l=window.getSelection();l.removeAllRanges(),l.addRange(a),t.__prevPointedContainer||(t.__prevPointedContainer=o.startContainer);var c=t.__prevPointedContainer===o.startContainer&&t.__prevPointedFocusOffset===l.focusOffset&&t.__prevPointedAnchorOffset===l.anchorOffset;t.__prevPointedContainer=o.startContainer,t.__prevPointedFocusOffset=l.focusOffset,t.__prevPointedAnchorOffset=l.anchorOffset,t.getSelectedPhrase(c)},getSelectedTextBounding:function(t,n,o){function i(e){var t=[];if(3==e.nodeType)t.push(e);else for(var n=e.childNodes,o=0,r=n.length;o<r;++o)t.push.apply(t,i(n[o]));return t}function r(e,t,n){var o=document.createRange();o.selectNodeContents(e);for(var r,a,s=i(e),l=!1,c=0,u=0;a=s[u++];){if(r=c+a.length,!l&&t>=c&&(t<r||t==r&&u<s.length)&&(o.setStart(a,t-c),l=!0),l&&n<=r){o.setEnd(a,n-c);break}c=r}var d=window.getSelection();return d.removeAllRanges(),d.addRange(o),o}var a=t.getBoundingClientRect(),s=e("<div>").html(t.value.replace(/\n/g,"<br />")).appendTo(document.body);s[0].style.cssText=document.defaultView.getComputedStyle(t,null).cssText,s.css({position:"absolute",left:a.left,top:a.top,margin:0,overflow:"hidden"}),s[0].scrollLeft=t.scrollLeft,s[0].scrollTop=t.scrollTop;var l=r(s[0],n,o),c=l.getBoundingClientRect();return s.remove(),c}};App.modules.selectionPhrase=t}(Zepto);