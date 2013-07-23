//Piggy Reader
//author @huntbao
(function($){
    'use strict';
    window.jiZhuReaderBackground = {
        init: function(){
            var self = this;
            self.initConnect();
            self.browserAction();
            self.createContextMenu();
        },
        initConnect: function(){
            var self = this;
            chrome.extension.onConnect.addListener(function(port){
                switch(port.name){
                    case 'articlefrompage':
                        self.articlefrompageHandler(port);
                        break;
                    case 'appendcontent':
                        self.appendContentHandler(port);
                        break;
                    default: 
			break;
                }
            });
        },
        articlefrompageHandler: function(port){
            var self = this;
            port.onMessage.addListener(function(data){
                chrome.tabs.sendRequest(port.sender.tab.id, {name: 'sendarticletoreader', data: data, settings: self.getSettings()});
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
                self.createReader();
            });
        },
        createContextMenu: function(){
            var self = this;
            chrome.contextMenus.create({
                contexts: ['all'],
                title: chrome.i18n.getMessage('ExtensionName'),
                onclick: function(info, tab){
                    self.createReader();
                }
            });
        },
        createReader: function(){
            chrome.tabs.executeScript(null, {code: 'jiZhuReader.create();'});
        },
        getSettings: function(){
            return {
                fontSize: window.jiZhuReaderOptions.fontSize + 'px'
            }
        }
    }
    $(function(){
        jiZhuReaderBackground.init();
    });
})(jQuery);