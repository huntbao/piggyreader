//Piggy Reader
//author @huntbao
(function ($) {
    'use strict';

    $.jps.subscribe('init-reader', function () {
        App.modules.reader.init();
    });

    $.jps.subscribe('init-evernote-savemodal', function (noteData) {
        App.modules.evernoteSaveModal.init(noteData);
    });

    $(function () {
        chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
            if (!sender || sender.id !== chrome.i18n.getMessage("@@extension_id")) return;
            switch (request.name) {
                case 'sendarticletoreader':
                    App.modules.reader.sendarticletoreaderHandler(request.data, request.settings);
                    break;
                case 'superaddtoreader':
                    App.modules.reader.superaddtoreaderHandler(request.data);
                    break;
                case 'lookupphrase-result':
                    if (request.data.from !== 'reader') return;
                    App.modules.reader.lookupPhraseResultHandler(request.data);
                    break;
                case 'got-evernote-oauth':
                    App.modules.evernoteSaveModal.save(request.data);
                    break;
                case 'saved-evernote':
                    App.modules.evernoteSaveModal.afterSavedNote(request.data);
                    break;
                case 'saved-evernote-failed':
                    App.modules.evernoteSaveModal.saveNoteFailed(request.data);
                    break;
                case 'cleared-evernote-oauth':
                    App.modules.evernoteSaveModal.afterClearOAuth();
                    break;
                default:
                    break;
            }
        });
        $.jps.publish('init-reader');
    });

}(jQuery));