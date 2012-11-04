//@huntbao
(function($){
    'use strict';
    window.jiZhuReaderBack = {
        init: function(){
            var self = this;
            self.initConnect();
            self.browserAction();
        },
        initConnect: function(){
            var self = this;
            chrome.extension.onConnect.addListener(function(port){
                switch(port.name){
                    case 'articlefrompage':
                        self.articleFromPageHandler(port);
                        break;
                    case 'appendcontent':
                        self.appendContentHandler(port);
                        break;
                    default: 
			break;
                }
            });
        },
        articleFromPageHandler: function(port){
            var self = this;
            port.onMessage.addListener(function(data){
                chrome.tabs.sendRequest(port.sender.tab.id, {name: 'sendarticletoreader', data: data});
            });
        },
        appendContentHandler: function(port){
            var self = this;
            port.onMessage.addListener(function(data){
                chrome.tabs.sendRequest(port.sender.tab.id, {name: 'superaddtoreader', data: data});
            });
        },
        browserAction: function(){
            var self = this;
            chrome.browserAction.onClicked.addListener(function(tab){
                chrome.tabs.executeScript(null, {code: 'jiZhuReader.create();'});
            });
        }
    }
    $(function(){
        jiZhuReaderBack.init();
    });
})(jQuery);