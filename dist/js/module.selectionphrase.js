!function(e){"use strict";var t={__mousemoveTimer:null,__prevPointedContainer:null,__prevPointedAnchorOffset:null,__prevPointedFocusOffset:null,__mouseDownedInput:null,__options:null,init:function(t){var n=this;n.__options=t;var o=t.container||e(document);o.keydown(function(){e.jps.publish("hide-dict-layer")}),"selection"===n.__options.dictLookup&&(e(o).on("mousedown",":input",function(){n.__mouseDownedInput=this}),e(o).mouseup(function(e){setTimeout(function(){n.getSelectedPhrase(),n.__mouseDownedInput=null},0)})),"hover"===n.__options.dictLookup&&(o.mousemove(function(e){e.stopPropagation(),clearTimeout(n.__mousemoveTimer),n.__mousemoveTimer=setTimeout(function(){n.getPointedPhrase()},300)}),e(o).mouseleave(function(e){n.__hideDictLayer()}))},__hideDictLayer:function(){var t=this;clearTimeout(t.__mousemoveTimer),e.jps.publish("hide-dict-layer");var n=window.getSelection();n.removeAllRanges()},getSelectedPhrase:function(t){var n=this;if(!n.__mouseDownedInput||!/^(q|wd)$/.test(n.__mouseDownedInput.name)){var o=document.getSelection(),i=o.toString().trim();if(i){var r=i.toLowerCase().replace(/\s|-|’/g,"");/^[a-z]+$/g.test(r)&&e.jps.publish("lookup-phrase",{phrase:i,position:n.getSeletionPosition(o),isSamePhraseWithPrevious:t,from:n.__options.from})}else e.jps.publish("hide-dict-layer")}},getSeletionPosition:function(e,t){var n=this,o={left:0,top:0,right:0,bottom:0,width:0,height:0},i=e.getRangeAt(0);if(i.collapsed){if(n.__mouseDownedInput){var r=n.__mouseDownedInput.selectionStart,s=n.__mouseDownedInput.selectionEnd;r!==s&&(o=n.getSelectedTextBounding(n.__mouseDownedInput,r,s),n.__mouseDownedInput.setSelectionRange(r,s))}}else o=i.getBoundingClientRect();return o},getPointedPhrase:function(){var e=this,t=function(e){return e=e.toLowerCase().replace(/-|’/g,""),/^[a-z]*$/g.test(e)},n=document.caretRangeFromPoint(position.clientX,position.clientY);if(!n)return!0;var o=n.startOffset,i=n.endOffset,r=n.cloneRange(),s="";if(n.startContainer.data)for(;o>=1;)if(r.setStart(n.startContainer,--o),s=r.toString(),!t(s.charAt(0))){r.setStart(n.startContainer,o+1);break}if(n.endContainer.data)for(;i<n.endContainer.data.length;)if(r.setEnd(n.endContainer,++i),s=r.toString(),!t(s.charAt(s.length-1))){r.setEnd(n.endContainer,i-1);break}var a=window.getSelection();a.removeAllRanges(),a.addRange(r),e.__prevPointedContainer||(e.__prevPointedContainer=n.startContainer);var u=e.__prevPointedContainer===n.startContainer&&e.__prevPointedFocusOffset===a.focusOffset&&e.__prevPointedAnchorOffset===a.anchorOffset;e.__prevPointedContainer=n.startContainer,e.__prevPointedFocusOffset=a.focusOffset,e.__prevPointedAnchorOffset=a.anchorOffset,e.getSelectedPhrase(u)},getSelectedTextBounding:function(t,n,o){function i(e){var t=[];if(3==e.nodeType)t.push(e);else for(var n=e.childNodes,o=0,r=n.length;r>o;++o)t.push.apply(t,i(n[o]));return t}function r(e,t,n){var o=document.createRange();o.selectNodeContents(e);for(var r,s,a=i(e),u=!1,l=0,d=0;s=a[d++];){if(r=l+s.length,!u&&t>=l&&(r>t||t==r&&d<a.length)&&(o.setStart(s,t-l),u=!0),u&&r>=n){o.setEnd(s,n-l);break}l=r}var c=window.getSelection();return c.removeAllRanges(),c.addRange(o),o}var s=t.getBoundingClientRect(),a=e("<div>").html(t.value.replace(/\n/g,"<br />")).appendTo(document.body);a[0].style.cssText=document.defaultView.getComputedStyle(t,null).cssText,a.css({position:"absolute",left:s.left,top:s.top,margin:0,overflow:"hidden"}),a[0].scrollLeft=t.scrollLeft,a[0].scrollTop=t.scrollTop;var u=r(a[0],n,o),l=u.getBoundingClientRect();return a.remove(),l}};App.modules.selectionPhrase=t}(jQuery);