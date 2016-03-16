//Piggy Reader
//author @huntbao
(function ($) {

    'use strict'

    window.jiZhuReaderBackground = {

        init: function () {
            var self = this
            self.initConnect()
            self.browserAction()
            self.createContextMenu()
        },

        initConnect: function () {
            var self = this
            chrome.extension.onConnect.addListener(function (port) {
                switch (port.name) {
                    case 'createreader':
                        self.createReader()
                        break
                    case 'articlefrompage':
                        self.articlefrompageHandler(port)
                        break
                    case 'appendcontent':
                        self.appendContentHandler(port)
                        break
                    case 'lookup-phrase':
                        self.lookupPhraseHandler(port)
                        break
                    case 'getsettings':
                        self.getSettingsHandler(port)
                        break
                    default:
                        break
                }
            })
        },

        articlefrompageHandler: function (port) {
            var self = this
            port.onMessage.addListener(function (data) {
                chrome.tabs.sendRequest(port.sender.tab.id, {
                    name: 'sendarticletoreader',
                    data: data,
                    settings: self.getSettings()
                })
            })
        },

        appendContentHandler: function (port) {
            var self = this
            port.onMessage.addListener(function (data) {
                chrome.tabs.sendRequest(port.sender.tab.id, {
                    name: 'superaddtoreader',
                    data: data
                })
            })
        },

        lookupPhraseHandler: function (port) {
            var self = this
            port.onMessage.addListener(function (data) {
                var callback = function (dictData) {
                    chrome.tabs.sendRequest(port.sender.tab.id, {
                        name: 'lookupphrase-result',
                        data: {
                            dictData: dictData,
                            position: data.position,
                            from: data.from,
                            phrase: data.phrase
                        }
                    })
                }
                var dictDataSavedKey = 'DICT-DATA'
                var isOutDate
                var sendRequest = function () {
                    $.ajax({
                        url: 'http://dict.youdao.com/fsearch?q=' + encodeURIComponent(data.phrase),
                        success: function (xmlDoc) {
                            // save xmlDoc for next use
                            var dictData = self.getDictData($(xmlDoc))
                            var savedObj = {}
                            savedObj[dictDataSavedKey] = {}
                            savedObj[dictDataSavedKey][data.phrase] = {
                                dictData: dictData,
                                createTime: Date.now()
                            }
                            StorageArea.set(savedObj)
                            if (!isOutDate) {
                                callback(dictData)
                            }
                        }
                    })
                }
                StorageArea.get(dictDataSavedKey, function (result) {
                    if (result[dictDataSavedKey] && result[dictDataSavedKey][data.phrase]) {
                        // one month: 30 * 24 * 60 * 60 * 1000 = 2592000000
                        isOutDate = Date.now() - result[dictDataSavedKey][data.phrase].createTime > 2592000000
                        callback(result[dictDataSavedKey][data.phrase].dictData)
                    } else {
                        sendRequest()
                    }
                    if (isOutDate) {
                        sendRequest()
                    }
                })
            })
        },

        getSettingsHandler: function (port) {
            var self = this
            port.onMessage.addListener(function (data) {
                chrome.tabs.sendRequest(port.sender.tab.id, {
                    name: 'settings',
                    data: self.getSettings()
                })
            })
        },

        browserAction: function () {
            var self = this
            chrome.browserAction.onClicked.addListener(function (tab) {
                self.createReader()
            })
        },

        createContextMenu: function () {
            var self = this
            chrome.contextMenus.create({
                contexts: ['all'],
                title: chrome.i18n.getMessage('ExtensionName'),
                onclick: function (info, tab) {
                    self.createReader()
                }
            })
        },

        createReader: function () {
            chrome.tabs.executeScript(null, {code: 'jiZhuReader.create()'})
        },

        getSettings: function () {
            var options = window.jiZhuReaderOptions
            return {
                dictHostpage: options.dictHostpage,
                dictJzpage: options.dictJzpage
            }
        },

        getDictData: function (xmlDoc) {
            var trans = []
            var translation = xmlDoc.find('custom-translation content')
            $.each(translation, function (idx, tr) {
                trans.push($(tr).text())
            })
            var moreTrans = []
            var moreTranslatioin = xmlDoc.find('web-translation')
            $.each(moreTranslatioin, function (idx, tr) {
                moreTrans.push({
                    key: $(tr).find('key').text(),
                    value: (function () {
                        var _trans = []
                        $.each($(tr).find('trans value'), function () {
                            _trans.push($(this).text())
                        })
                        return _trans.join(', ')
                    }())
                })
            })
            var o = {
                phrase: xmlDoc.find('return-phrase').text(),
                phoneticSymbol: xmlDoc.find('phonetic-symbol').text(),
                translation: trans,
                hasMore: moreTrans.length > 0,
                moreTranslatioin: moreTrans
            }
            return o
        }

    }

    $(function () {
        jiZhuReaderBackground.init()
    })

})(Zepto)