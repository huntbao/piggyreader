//Piggy Reader
//author @huntbao
(function ($) {
    'use strict';

    $(function () {
        var __settings = null;
        chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
            if (!sender || sender.id !== chrome.i18n.getMessage("@@extension_id")) return;
            switch (request.name) {
                case 'settings':
                    __settings = request.data;
                    $.jps.publish('init-selectionphrase', {
                        container: $(document.body),
                        dictLookup: __settings.dictHostpage || 'selection',
                        from: 'page'
                    });
                    break;
                case 'lookupphrase-result':
                    if (request.data.from !== 'page') return;
                    $.jps.publish('init-dict-layer', {
                        dictData: request.data.dictData,
                        position: request.data.position,
                        hover: __settings.dictHostpage === 'hover'
                    });
                    break;
                default:
                    break;
            }
        });
        chrome.extension.connect({name: 'getsettings'}).postMessage();
        $(document.body).keydown(function (e) {
            if ((e.metaKey || e.ctrlKey) && e.keyCode === 88) {
                chrome.extension.connect({name: 'createreader'});
            }
        });
    });

}(jQuery));