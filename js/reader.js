//@huntbao 
//All right reserved
(function($){
    'use strict';
    window.jiZhuReader = {
        init: function(){
            var self = this;
            self.initExtensionRequest();
            self.getContent();
        },
        getContent: function(){
            var self = this;
            parent.postMessage({name: 'getpagecontent'}, '*');
        },
        initExtensionRequest: function(){
            var self = this;
            chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
                if(!sender || sender.id !== chrome.i18n.getMessage("@@extension_id")) return;
                switch(request.name){
                    case 'sendarticletoreader':
                        self.sendarticletoreaderHandler(request.data);
                        break;
                    default:
                        break;
                }
            });
        },
        sendarticletoreaderHandler: function(data){
            var self = this;
            if(data.content !== ''){
                $('#article').html(data.content);
                $('#title').html(data.title);
            }
        }
    }
    $(function(){
        window.jiZhuReader.init();
    });
})(jQuery);