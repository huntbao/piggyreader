//@huntbao 
//All right reserved
(function($){
    'use strict';
    window.jiZhuReader = {
        init: function(){
            var self = this;
            self.currentPageNum = 1;
            self.jzArticle = $('#jz-article');
            self.jzTitle = $('#jz-title');
            self.notifyParent();
            self.getPageContent();
            self.initExtensionRequest();
        },
        getPageContent: function(){
            var self = this;
            parent.postMessage({name: 'getpagecontent'}, '*');
            $('#jz-header').click(function(){
                parent.postMessage({name: 'removeiframe'}, '*');
            });
        },
        notifyParent: function(){
            parent.postMessage({name: 'afterinitreader'}, '*');
        },
        initExtensionRequest: function(){
            var self = this;
            chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
                if(!sender || sender.id !== chrome.i18n.getMessage("@@extension_id")) return;
                switch(request.name){
                    case 'sendarticletoreader':
                        self.sendarticletoreaderHandler(request.data);
                        break;
                    case 'superaddtoreader':
                        self.superaddtoreaderHandler(request.data);
                    default:
                        break;
                }
            });
        },
        sendarticletoreaderHandler: function(data){
            var self = this;
            if(data.content !== ''){
                var section = $('<section>', {class: 'jz-addcontent', html: data.content});
                self.jzArticle.append(section).find('pre, code, xmp').addClass('prettyprint');
                prettyPrint();
            }
            if(data.title !== ''){
                self.jzTitle.html(data.title);
            }
        },
        superaddtoreaderHandler: function(data){
            var self = this;
            if(data.content !== ''){
                self.currentPageNum++;
                var section = $('<section>', {class: 'jz-addcontent'}),
                pageContent = $('<div>', {class: 'jz-pagecontent', html: data.content}),
                pageNum = $('<h6>', {text: chrome.i18n.getMessage('Pagination', [self.currentPageNum]), class: 'jz-pagenum'});
                section.append(pageNum).append(pageContent);
                self.jzArticle.append(section).find('pre, code, xmp').addClass('prettyprint');
                prettyPrint(section[0]);
            }
        }
    }
    $(function(){
        window.jiZhuReader.init();
    });
})(jQuery);