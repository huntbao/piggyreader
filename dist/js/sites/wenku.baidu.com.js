!function(e){"use strict";jiZhuReader.getPageContent=function(){function n(o){var i=chrome.extension.connect({name:"articlefrompage"});i.postMessage({content:chrome.i18n.getMessage("LoadingTip"),title:document.title}),jiZhuReaderGetPageContent.getDocByUrl(o,function(o){if(!a){a=!0;var i=e('a[accesskey="4"]',o);if(1===i.length)return void n(i[0].href.replace(/pn=\d+/,"pn=1"))}var r=t(o);if(r){var c=chrome.extension.connect({name:"articlefrompage"});c.postMessage({content:r}),jiZhuReaderGetPageContent.getContentTimer=setTimeout(function(){var t=e('a[accesskey="6"]',o);1===t.length&&n(t[0].href)},10)}})}function t(n){var t=e(".xreader",n),a="";if(1===t.length)return t.find(".page_info").remove(),a=t.html()}var a=!1,o=window.location.href;o.indexOf("wapwenku.baidu.com")===-1&&(o=o.replace("wenku.baidu.com","wapwenku.baidu.com")),n(o)}}(Zepto);