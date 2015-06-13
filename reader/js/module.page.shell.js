//Piggy Reader
//author @huntbao
(function ($) {
    'use strict'
    var page = {
        init: function () {
            var self = this
            var __settings = null
            chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
                if (!sender || sender.id !== chrome.i18n.getMessage("@@extension_id")) return
                switch (request.name) {
                    case 'settings':
                        __settings = request.data
                        $.jps.publish('init-selectionphrase', {
                            container: $(document.body),
                            dictLookup: __settings.dictHostpage || 'selection',
                            from: 'page'
                        })
                        break
                    case 'lookupphrase-result':
                        if (request.data.from !== 'page') return
                        if (request.data.phrase !== document.getSelection().toString().trim()) return
                        $.jps.publish('init-dict-layer', {
                            dictData: request.data.dictData,
                            position: request.data.position,
                            hover: __settings.dictHostpage === 'hover'
                        })
                        break
                    default:
                        break
                }
            })
            chrome.extension.connect({name: 'getsettings'}).postMessage()
            $(document.body).keydown(function (e) {
                if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.keyCode === 88) {
                    chrome.extension.connect({name: 'createreader'})
                }
            })
            self.__injectPageLasteModifiedTime()
        },

        __injectPageLasteModifiedTime: function () {
            var tpl = $('<div id="jz-page-lastmodified">' + document.lastModified + '<span>&times;</span></div>')
            $(document.body).append(tpl)
            tpl.find('span').click(function () {
                tpl.remove()
            })
        }
    }

    $(function () {
        page.init()
    })

}(Zepto))