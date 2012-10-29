//@huntbao
//All right reserved
(function($){
    'use strict';
    window.jiZhuReader = {
        init: function(){
            var self = this;
            if(self.iframe){
                self.hideHTML();
                self.iframe.animate({
                    left: '0%'
                }, function(){
                    self.afterInitReader();
                });
                return;
            }
            self.hidePage();
            self.insertIframe();
            self.addWindowEventListener();
        },
        hidePage: function(){
            var self = this,
            beforeReaderCls = 'jizhureader-beforereader',
            readerCls = 'jizhureader-reader',
            html = $('html').addClass(beforeReaderCls),
            body = $('body').addClass(beforeReaderCls);
            self.hideHTML = function(){
                html.addClass(beforeReaderCls);
                body.addClass(beforeReaderCls);
            }
            self.removeIframe = function(){
                html.removeClass(beforeReaderCls).removeClass(readerCls);
                body.removeClass(beforeReaderCls).removeClass(readerCls);
                self.iframe.animate({
                    left: '-100%'
                });
            }
            self.afterInitReader = function(){
                $(window).scrollTop(0);
                html = $('html').addClass(readerCls),
                body = $('body').addClass(readerCls);
            }
        },
        insertIframe: function(){
            var self = this;
            self.iframe = $('<iframe>', {
                id: 'jizhureader-iframe',
                frameborder: 0,
                allowtransparency: true,
                scrolling: 'auto',
                src: chrome.extension.getURL('reader.html')
            }).appendTo(document.body).animate({
                left: '0%'
            }, function(){
                self.afterInitReader();
            });
        },
        getPageContent: function(){
            var self = this,
            extract = self.extractContent(document),
            content = '',
            title = document.title && document.title.split('-')[0];
            if(extract.isSuccess){
                var extractedContent = extract.content.asNode();
                if(extractedContent.nodeType === 3){
                    extractedContent = extractedContent.parentNode;
                }
                content = self.getHTMLByNode($(extractedContent));
            }
            var port = chrome.extension.connect({name:'articlefrompage'});
            port.postMessage({
                content: content,
                title: title
            });
        },
        extractContent: function(doc){
            var ex = new ExtractContentJS.LayeredExtractor();
            ex.addHandler(ex.factory.getHandler('Heuristics'));
            var res = ex.extract(doc);
            return res;
        },
        addWindowEventListener: function(){
            var self = this;
            window.addEventListener('message', function(e){
                switch(e.data.name){
                    case 'afterinitreader':
                        //self.afterInitReader();
                        break;
                    case 'getpagecontent':
                        self.getPageContent();
                        break;
                    case 'removeiframe':
                        self.removeIframe();
                        break;
                    default:
                        break;
                }
            }, true);
        },
        getHTMLByNode: function(node){
            var self = this,
            filterTagsObj = self.filterTagsObj,
            nodeTagName = node[0].tagName.toLowerCase();
            if(filterTagsObj[nodeTagName]){
                return '';
            }
            var allEles = node[0].querySelectorAll('*'),
            allElesLength = allEles.length,
            nodeCSSStyleDeclaration = getComputedStyle(node[0]);
            if(allElesLength == 0){
                //no child
                if(!/^(img|a)$/.test(nodeTagName) && node[0].innerHTML == 0 && nodeCSSStyleDeclaration['background-image'] == 'none'){
                     return '';
                }
            }
            var cloneNode = node.clone(),
            allElesCloned = cloneNode[0].querySelectorAll('*'),
            el,
            cloneEl;
            for(var j = allElesLength - 1, tagName; j >= 0; j--){
                cloneEl = allElesCloned[j];
                tagName = cloneEl.tagName.toLowerCase();
                if(filterTagsObj[tagName]){
                    $(cloneEl).remove();
                    continue;
                }
                if(tagName === 'br'){
                    continue;
                }
                el = allEles[j];
                cloneEl = $(cloneEl);
                if(tagName == 'img'){
                    cloneEl[0].src = cloneEl[0].src;
                    continue;
                }
                if(tagName == 'a'){
                    cloneEl.attr('href', el.href);
                }
                self.removeAttrs(cloneEl);
            }
            if(nodeTagName == 'body'){
                return cloneNode[0].innerHTML;
            }else{
                self.removeAttrs(cloneNode);
                return cloneNode[0].outerHTML;
            }
        },
        filterTagsObj: {style:1,script:1,link:1,iframe:1,frame:1,frameset:1,noscript:1,head:1,html:1,applet:1,base:1,basefont:1,bgsound:1,blink:1,ilayer:1,layer:1,meta:1,object:1,embed:1,input:1,textarea:1,button:1,select:1,canvas:1,map:1},
        removeAttrs: function(node){
            var removeAttrs = ['id', 'class', 'height', 'width'];
            for(var i = 0, l = removeAttrs.length; i < l; i++){
                node.removeAttr(removeAttrs[i]);
            }
            return node;
        }
    }
})(jQuery);