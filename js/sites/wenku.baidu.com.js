//Piggy Reader
//author @huntbao
(function($){
    'use strict';
    jiZhuReader.getPageContent = function(){
        var initPage = false;
        function getDocByUrl(url){
            var port = chrome.extension.connect({name: 'articlefrompage'});
            port.postMessage({
                content: chrome.i18n.getMessage("LoadingTip"),
                title: document.title
            });
            jiZhuReaderGetPageContent.getDocByUrl(url, function(doc){
                if(!initPage){
                    initPage = true;
                    var prevLink = $('a[accesskey="4"]', doc);
                    if(prevLink.length === 1){
                        getDocByUrl(prevLink[0].href.replace(/pn=\d+/, 'pn=1'));
                        return;
                    }
                }
                var content = getContent(doc);
                if(content){
                    var port = chrome.extension.connect({name: 'articlefrompage'});
                    port.postMessage({
                        content: content
                    });
                    jiZhuReaderGetPageContent.getContentTimer = setTimeout(function(){
                        var nextLink = $('a[accesskey="6"]', doc);
                        if(nextLink.length === 1){
                            getDocByUrl(nextLink[0].href);
                        }
                    } , 10);
                }
            });
        }
        function getContent(doc){
            var xreader = $('.xreader', doc);
            var content = '';
            if(xreader.length === 1){
                xreader.find('.page_info').remove();
                content  = xreader.html();
                return content;
            }
        }
        var url = window.location.href;
        if(url.indexOf('wapwenku.baidu.com') === -1){
            url = url.replace('wenku.baidu.com', 'wapwenku.baidu.com');
        }
        getDocByUrl(url);
    }
})(jQuery);

//test page: http://wenku.baidu.com/view/618ac92d10661ed9ad51f3c5.html