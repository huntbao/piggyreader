//@huntbao 
//All right reserved
(function($){
    'use strict';
    window.jiZhuReader = {
        init: function(){
            var self = this;
            self.initExtensionRequest();
            self.notifyInitReader();
            self.getContent();
        },
        getContent: function(){
            var self = this;
            parent.postMessage({name: 'getpagecontent'}, '*');
            $('#header').click(function(){
                parent.postMessage({name: 'removeiframe'}, '*');
            });
        },
        notifyInitReader: function(){
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
                $('#article').html(data.content);
            }
            if(data.title !== ''){
                $('#title').html(data.title);
            }
        },
        superaddtoreaderHandler: function(data){
            var self = this;
            if(data.content !== ''){
                var section = $('<section>', {class: 'superaddcontent', html: data.content});
                $('#article').append(section);
            }
        }
    }
    $(function(){
        window.jiZhuReader.init();
    });
})(jQuery);