//Piggy Reader
//author @huntbao
(function ($) {
    'use strict';
    var background = {

        init: function () {
            var self = this;
            self.initConnect();
            self.browserAction();
            self.createContextMenu();
        },

        initConnect: function () {
            var self = this;
            chrome.extension.onConnect.addListener(function (port) {
                switch (port.name) {
                    case 'articlefrompage':
                        self.articlefrompageHandler(port);
                        break;
                    case 'appendcontent':
                        self.appendContentHandler(port);
                        break;
                    case 'lookup-phrase':
                        self.lookupPhraseHandler(port);
                        break;
                    case 'getsettings':
                        self.getSettingsHandler(port);
                        break;
                    default:
                        break;
                }
            });
        },

        articlefrompageHandler: function (port) {
            var self = this;
            port.onMessage.addListener(function (data) {
                chrome.tabs.sendRequest(port.sender.tab.id, {
                    name: 'sendarticletoreader',
                    data: data,
                    settings: self.getSettings()
                });
            });
        },

        appendContentHandler: function (port) {
            var self = this;
            port.onMessage.addListener(function (data) {
                chrome.tabs.sendRequest(port.sender.tab.id, {
                    name: 'superaddtoreader',
                    data: data
                });
            });
        },

        lookupPhraseHandler: function (port) {
            var self = this;
            port.onMessage.addListener(function (data) {
                $.ajax({
                    url: 'http://dict.youdao.com/fsearch?q=' + encodeURIComponent(data.phrase),
                    success: function (xmlDoc) {
                        chrome.tabs.sendRequest(port.sender.tab.id, {
                            name: 'lookupphrase-result',
                            data: {
                                dictData: self.getDictData($(xmlDoc)),
                                position: data.position,
                                from: data.from
                            }
                        });
                    }
                });
            });
        },

        getSettingsHandler: function (port) {
            var self = this;
            port.onMessage.addListener(function (data) {
                chrome.tabs.sendRequest(port.sender.tab.id, {
                    name: 'settings',
                    data: self.getSettings()
                });
            });
        },

        browserAction: function () {
            var self = this;
            chrome.browserAction.onClicked.addListener(function (tab) {
                self.createReader();
            });
        },

        createContextMenu: function () {
            var self = this;
            chrome.contextMenus.create({
                contexts: ['all'],
                title: chrome.i18n.getMessage('ExtensionName'),
                onclick: function (info, tab) {
                    self.createReader();
                }
            });
        },

        createReader: function () {
            chrome.tabs.executeScript(null, {code: 'jiZhuReader.create();'});
        },

        getSettings: function () {
            var options = window.jiZhuReaderOptions;
            return {
                fontSize: options.fontSize + 'px',
                dictHostpage: options.dictHostpage,
                dictJzpage: options.dictJzpage
            }
        },

        getDictData: function (xmlDoc) {
            var self = this;
            var trans = [];
            var translation = xmlDoc.find('custom-translation content');
            $.each(translation, function (idx, tr) {
                trans.push($(tr).text())
            });
            var moreTrans = [];
            var moreTranslatioin = xmlDoc.find('web-translation');
            $.each(moreTranslatioin, function (idx, tr) {
                moreTrans.push({
                    key: $(tr).find('key').text(),
                    value: (function () {
                        var _trans = [];
                        $.each($(tr).find('trans value'), function () {
                            _trans.push($(this).text())
                        });
                        return _trans.join(', ');
                    }())
                });
            });
            var o = {
                phrase: xmlDoc.find('return-phrase').text(),
                phoneticSymbol: xmlDoc.find('phonetic-symbol').text(),
                translation: trans,
                hasMore: moreTrans.length > 0,
                moreTranslatioin: moreTrans
            }
            return o;
        }

    };

    App.modules.background = background;

})(jQuery);