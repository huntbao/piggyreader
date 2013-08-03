//Piggy Reader
//author @huntbao
(function($){
    'use strict';
    window.jiZhuReader = {
        create: function(){
            var self = this;
            if(self.iframe){
                return;
            }
            self.dealPage();
            self.insertIframe();
            self.addWindowEventListener();
        },
        dealPage: function(){
            var self = this,
            beforeReaderCls = 'jizhureader-beforereader',
            readerCls = 'jizhureader-reader',
            htmlAndBody = $('html, body').addClass(beforeReaderCls);
            self.hidePage = function(){
                htmlAndBody.addClass(beforeReaderCls);
            }
            self.removeIframe = function(){
                htmlAndBody.removeClass(beforeReaderCls).removeClass(readerCls);
                self.iframe.animate({
                    left: '-100%'
                }, function(){
                    self.iframe.remove();
                    self.iframe = null;
                });
                //clear get page content timer
                clearTimeout(jiZhuReaderGetPageContent.getContentTimer);
            }
            self.afterInitReader = function(){
                $(window).scrollTop(0);
                htmlAndBody.addClass(readerCls);
            }
            $(document).keydown(function(e){
                if(e.which === 27){
                    self.removeIframe();
                }
            });
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
            });
        },
        getPageContent: function(){
            var self = this;
            window.jiZhuReaderGetPageContent.getCurrentContent(function(content){
                var port = chrome.extension.connect({name: 'articlefrompage'});
                port.postMessage({
                    content: content || chrome.i18n.getMessage("ClipFailedTip"),
                    title: document.title,
                    url: window.location.href
                });
                var l = window.location;
                if(l.pathname !== ''){
                    jiZhuReaderGetPageContent.findNextPageContent(document, l.origin + l.pathname + l.search, content);
                }
            });
        },
        saveContent: function(noteContent){
            var self = this;
            var port = chrome.extension.connect({name: 'savecontent'});
            if(!noteContent) return;
            port.postMessage({
                noteContent: noteContent,
                noteTitle: document.title,
                noteUrl: window.location.href
            });
        },
        addWindowEventListener: function(){
            var self = this;
            if(self.eventInited) return;
            window.addEventListener('message', function(e){
                switch(e.data.name){
                    case 'afterinitreader':
                        self.afterInitReader();
                        break;
                    case 'getpagecontent':
                        self.getPageContent();
                        break;
                    case 'removeiframe':
                        self.removeIframe();
                        break;
                    case 'savecontent':
                        self.saveContent(e.data.noteContent);
                        break;
                    default:
                        break;
                }
            }, true);
            self.eventInited = true;
        }
    }
})(jQuery);