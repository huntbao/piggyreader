//Piggy Reader
//author @huntbao
(function ($) {
    'use strict';
    $.jps.subscribe('init-reader', function () {
        App.reader.init();
    });

    $.jps.subscribe('init-selectionword', function () {
        App.selectionWord.init();
    });

    $.jps.subscribe('lookup-word', function (word) {

    });

    $(function () {
        $.jps.publish('init-reader');
        $.jps.publish('init-selectionword');
    });

}(jQuery));