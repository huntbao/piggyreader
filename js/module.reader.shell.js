//Piggy Reader
//author @huntbao
(function ($) {
    'use strict';
    $.jps.subscribe('init-reader', function () {
        App.modules.reader.init();
    });

    $.jps.subscribe('init-selectionphrase', function (container) {
        App.modules.selectionPhrase.init(container);
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

    $(function () {
        $.jps.publish('init-reader');
        $.jps.publish('init-selectionphrase', $('#jz-contentwrap'));
    });

}(jQuery));