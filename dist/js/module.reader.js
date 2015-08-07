!function(t){"use strict";App.modules.reader={__settings:{},init:function(){var e=this;e.currentPageNum=1,e.jzContentWrap=t("#jz-contentwrap"),e.jzArticle=t("#jz-article"),e.jzTitle=t("#jz-title"),e.jzSubtitle=t("#jz-subtitle"),e.notifyParent(),e.getPageContent(),e.initExtensionRequest(),e.initActionBtn()},getPageContent:function(){parent.postMessage({name:"getpagecontent"},"*")},notifyParent:function(){parent.postMessage({name:"afterinitreader"},"*")},initExtensionRequest:function(){var t=this;chrome.extension.onRequest.addListener(function(e,n,i){if(n&&n.id===chrome.i18n.getMessage("@@extension_id"))switch(e.name){case"sendarticletoreader":t.sendarticletoreaderHandler(e.data,e.settings);break;case"superaddtoreader":t.superaddtoreaderHandler(e.data);break;case"lookupphrase-result":if("reader"!==e.data.from)return;t.lookupPhraseResultHandler(e.data)}})},sendarticletoreaderHandler:function(e,n){var i=this;if(""!==e.content){var a=t("<section>",{"class":"jz-addcontent",html:e.content});i.jzArticle.find(".jz-loading-tip").remove(),i.jzArticle.append(a).find("pre, code, xmp").addClass("prettyprint"),prettyPrint()}var o=e.title.trim();""!==o&&(i.jzTitle.html(o),document.title=o,/.*[\u4e00-\u9fa5]+.*$/.test(o)&&t(document.body).addClass("chinese-article")),""!==e.subtitle&&i.jzSubtitle.html(e.subtitle),t.jps.publish("init-selectionphrase",{container:t("#jz-contentwrap"),dictLookup:n.dictJzpage||"selection",from:"reader"}),i.__settings=n},superaddtoreaderHandler:function(e){var n=this;if(""!==e.content){n.currentPageNum++;var i=t("<section>",{"class":"jz-addcontent"}),a=t("<div>",{"class":"jz-pagecontent",html:e.content}),o=t("<h6>",{text:chrome.i18n.getMessage("Pagination",[n.currentPageNum]),"class":"jz-pagenum"});i.append(o).append(a),n.jzArticle.append(i).find("pre, code, xmp").addClass("prettyprint"),prettyPrint(i[0])}},initActionBtn:function(){var e=this;t("#jz-closebtn").click(function(){parent.postMessage({name:"removeiframe"},"*")}).attr("title",chrome.i18n.getMessage("Goback")),t("#jz-editbtn").click(function(){e.editContent()}).attr("title",chrome.i18n.getMessage("Edit")),t("#jz-printbtn").click(function(){t("#jz-sider").removeClass("hover"),window.print()}).attr("title",chrome.i18n.getMessage("Print")),t("#jz-helpbtn").click(function(){return e.showHelpTip(),!1}).attr("title",chrome.i18n.getMessage("Help")),t("#jz-sider").mouseenter(function(){t(this).addClass("hover")}).mouseleave(function(){t(this).removeClass("hover")}),t(document).keydown(function(t){27===t.which&&parent.postMessage({name:"removeiframe"},"*")}),t(document).on("click",".jz-zhihu-title a",function(){function n(){t.ajax({url:"http://www.zhihu.com/node/AnswerCommentBoxV2?params="+encodeURIComponent('{"answer_id":"'+a+'","load_all":true}'),success:function(n){var i=t(n).find(".zm-item-comment"),a='<div class="jz-zhihu-comment">';i.each(function(e,n){n=t(n),a+='<p class="jz-clr item-comment">'+n.find(".zm-item-img-avatar")[0].outerHTML+n.find(".zm-comment-hd").html()+":"+n.find(".zm-comment-content").html();var i=n.find(".like-num");"0"!==i.find("em").text()&&(a+='<span class="like-num">('+i.html().trim()+")"),a+="</p>"}),a+="</div>",e.modal.find(".jz-modal-bd").html(a)}})}var i=t(this),a=i.data("aid");return e.showModal('<div class="jz-zhihu-comment">评论加载中，请稍候...</div>',"用户评论",n()),!1})},editContent:function(){var e=this;"true"===e.jzContentWrap.attr("contenteditable")?(e.jzContentWrap.attr("contenteditable","false").blur(),t("#jz-editbtn").attr("title",chrome.i18n.getMessage("Edit"))):(e.jzContentWrap.attr("contenteditable","true").focus(),t("#jz-editbtn").attr("title",chrome.i18n.getMessage("Save")))},showHelpTip:function(){var t=this;t.showModal(chrome.i18n.getMessage("HelpModalTip"))},showModal:function(e,n,i){var a=this,o=t(document.body).addClass("ov-hidden"),s=t("<div>",{"class":"jz-modal-backdrop"}).appendTo(o),r='<div class="jz-modal jz-help-modal">   <div class="jz-modal-hd">       <button type="button" class="close">×</button>       <h3></h3>   </div>   <div class="jz-modal-bd"></div></div>',c=t(r);c.find("h3").append(n||chrome.i18n.getMessage("ExtensionName")),c.find(".jz-modal-bd").append(e),c.appendTo(o);var d=function(){o.off("click.closemodal").removeClass("ov-hidden"),c.css("opacity",0),setTimeout(function(){c.remove(),s.remove(),a.modal=null},300)};o.on("click.closemodal",function(t){return 0===c.has(t.target).length?(d(),!1):!0}),c.find(".close").click(function(t){return d(),!1}),a.modal=c,i&&i()},lookupPhraseResultHandler:function(e){var n=this;t.jps.publish("init-dict-layer",{dictData:e.dictData,position:e.position,hover:"hover"===n.__settings.dictJzpage})}}}(Zepto);