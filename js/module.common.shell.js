//Piggy Reader
//author @huntbao
(function ($) {
    'use strict';
    window.App = {
        modules: {}
    };
    $.jps.subscribe('init-reader', function () {
        App.modules.reader.init();
    });

    $.jps.subscribe('init-selectionphrase', function (data) {
        App.modules.selectionPhrase.init({
            container: data.container,
            dictLookup: data.dictLookup || 'selection'
        });
    });

    $.jps.subscribe('lookup-phrase', function (data) {
        if (data.isSamePhraseWithPrevious) {
            if (App.modules.dictLayer.isLayerShown()) {
                return;
            }
        }
        $.jps.publish('hide-dict-layer');
        var port = chrome.extension.connect({name: 'lookup-phrase'});
        port.postMessage({
            phrase: data.phrase,
            position: data.position
        });
    });

    $.jps.subscribe('init-dict-layer', function (dictData) {
        App.modules.dictLayer.init(dictData);
    });

    $.jps.subscribe('hide-dict-layer', function () {
        App.modules.dictLayer.hideLayer();
    });

}(jQuery));