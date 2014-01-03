//Piggy Reader
//author @huntbao
(function ($) {
    'use strict';
    window.App = {
        modules: {}
    };

    $.jps.subscribe('init', function () {
        App.modules.background.init();
    });

    $(function () {
        chrome.extension.onConnect.addListener(function (port) {
            switch (port.name) {
                case 'articlefrompage':
                    App.modules.background.articlefrompageHandler(port);
                    break;
                case 'appendcontent':
                    App.modules.background.appendContentHandler(port);
                    break;
                case 'lookup-phrase':
                    App.modules.background.lookupPhraseHandler(port);
                    break;
                case 'getsettings':
                    App.modules.background.getSettingsHandler(port);
                    break;
                case 'get-evernoteoauth':
                    App.modules.evernoteOAuth.getOAuthHandler(port);
                    break;
                case 'save-evernote':
                    App.modules.evernoteOAuth.saveNoteHandler(port);
                    break;
                default:
                    break;
            }
        });
        $.jps.publish('init');
    });
})(jQuery);