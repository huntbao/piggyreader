//@huntbao
//All right reserved
(function($){
    'use strict';
    window.jiZhuReader = {
        init: function(){
            var self = this;
            self.hidePage();
            self.insertIframe();
            self.addWindowEventListener();
        },
        hidePage: function(){
            var self = this,
            html = $('html').addClass('jizhureader-hidden'),
            body = $('body').addClass('jizhureader-hidden');
        },
        insertIframe: function(){
            var self = this,
            iframe = $('<iframe>', {
                id: 'jizhureader-iframe',
                frameborder: 0,
                allowtransparency: true,
                scrolling: 'auto',
                src: chrome.extension.getURL('reader.html')
            }).appendTo(document.body);
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
                    case 'getpagecontent':
                        self.getPageContent();
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
            cloneEl,
            color,
            cssStyleDeclaration,
            styleObj = {},
            cssValue,
            saveStyles = self.saveStyles;
            for(var j = allElesLength - 1, tagName; j >= 0; j--){
                cloneEl = allElesCloned[j];
                tagName = cloneEl.tagName.toLowerCase();
                if(filterTagsObj[tagName] || cloneEl.getAttribute('mkclip')){
                    $(cloneEl).remove();
                    continue;
                }
                if(tagName === 'br'){
                    continue;
                }
                el = allEles[j];
                cssStyleDeclaration = getComputedStyle(el);
                cloneEl = $(cloneEl);
                color = cssStyleDeclaration.color;
                styleObj = {};
                if(tagName == 'img'){
                    cloneEl[0].src = cloneEl[0].src;
                    cloneEl.css({
                        width: cssStyleDeclaration.width,
                        height: cssStyleDeclaration.height,
                        float: cssStyleDeclaration.float,
                        background: cssStyleDeclaration.background,
                    });
                    continue;
                }
                for(var cssProperty in saveStyles){
                    cssValue = cssStyleDeclaration[cssProperty];
                    if(cssValue == saveStyles[cssProperty]) continue;
                    if(cssProperty == 'color'){
                        styleObj[cssProperty] = (color == 'rgb(255,255,255)' ? '#000' : color);
                        continue;
                    }
                    styleObj[cssProperty] = cssValue;
                }
                if(tagName == 'a'){
                    cloneEl.attr('href', el.href);
                }else if(/^(ul|ol|li)$/.test(tagName)){
                    styleObj['list-style'] = cssStyleDeclaration['list-style'];
                }
                cloneEl.css(styleObj);
                self.removeAttrs(cloneEl);
            }
            if(nodeTagName == 'body'){
                return cloneNode[0].innerHTML;
            }else{
                color = nodeCSSStyleDeclaration.color;
                styleObj = {};
                for(var cssProperty in saveStyles){
                    cssValue = nodeCSSStyleDeclaration[cssProperty];
                    if(cssValue == saveStyles[cssProperty]) continue;
                    if(/^(margin|float)$/.test(cssProperty)) continue;
                    if(cssProperty == 'color'){
                        styleObj[cssProperty] = (color == 'rgb(255,255,255)' ? '#000' : color);
                        continue;
                    }
                    styleObj[cssProperty] = cssValue;
                }
                cloneNode.css(styleObj);
                self.removeAttrs(cloneNode);
                return cloneNode[0].outerHTML;
            }
        },
        filterTagsObj: {style:1,script:1,link:1,iframe:1,frame:1,frameset:1,noscript:1,head:1,html:1,applet:1,base:1,basefont:1,bgsound:1,blink:1,ilayer:1,layer:1,meta:1,object:1,embed:1,input:1,textarea:1,button:1,select:1,canvas:1,map:1},
        saveStyles:{
            'background': 'rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box',
            'border': '0px none rgb(0, 0, 0)',
            'bottom': 'auto',
            'box-shadow': 'none',
            'clear': 'none',
            'color': 'rgb(0, 0, 0)',
            'cursor': 'auto',
            'display': '',//consider inline tag or block tag, this value must have
            'float': 'none',
            'font': '',//this value must have, since it affect the appearance very much and style inherit is very complex
            'height': 'auto',
            'left': 'auto',
            'letter-spacing': 'normal',
            'line-height': 'normal',
            'margin': '',
            'max-height': 'none',
            'max-width': 'none',
            'min-height': '0px',
            'min-width': '0px',
            'opacity': '1',
            'outline': 'rgb(0, 0, 0) none 0px',
            'overflow': 'visible',
            'padding': '',
            'position': 'static',
            'right': 'auto',
            'table-layout': 'auto',
            'text-align': 'start',
            'text-decoration': '',
            'text-indent': '0px',
            'text-shadow': 'none',
            'text-overflow': 'clip',
            'text-transform': 'none',
            'top': 'auto',
            'vertical-align': 'baseline',
            'visibility': 'visible',
            'white-space': 'normal',
            'width': 'auto',
            'word-break': 'normal',
            'word-spacing': '0px',
            'word-wrap': 'normal',
            'z-index': 'auto',
            'zoom': '1'
        },
        removeAttrs: function(node){
            var removeAttrs = ['id', 'class', 'height', 'width'];
            for(var i = 0, l = removeAttrs.length; i < l; i++){
                node.removeAttr(removeAttrs[i]);
            }
            return node;
        }
    }
})(jQuery);