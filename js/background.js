//@huntbao
//All right reserved
(function($){
    'use strict';
    window.jiZhuReaderBack = {
        init: function(){
            var self = this;
            self.initExtensionConnect();
            self.browserAction();
        },
        initExtensionConnect: function(){
            var self = this;
            chrome.extension.onConnect.addListener(function(port){
                switch(port.name){
                    case 'articlefrompage':
                        self.articlefrompageHandler(port);
                        break;
                    case 'appendcontent':
                        self.appendcontentHandler(port);
                        break;
                    default: 
			break;
                }
            });
        },
        articlefrompageHandler: function(port){
            var self = this;
            port.onMessage.addListener(function(data){
                chrome.tabs.sendRequest(port.sender.tab.id, {name: 'sendarticletoreader', data: data});
            });
        },
        appendcontentHandler: function(port){
            var self = this;
            port.onMessage.addListener(function(data){
                chrome.tabs.sendRequest(port.sender.tab.id, {name: 'superaddtoreader', data: data});
            });
        },
        browserAction: function(){
            var self = this;
            chrome.browserAction.onClicked.addListener(function(tab){
                chrome.tabs.executeScript(null, {code: 'jiZhuReader.init();'});
            });
        }
    }
    $(function(){
        jiZhuReaderBack.init();
    });
})(jQuery);