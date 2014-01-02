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

    $.jps.subscribe('get-evernote-auth', function () {
        App.modules.evernote.getOAuth();
    });

    $(function () {
        $.jps.publish('init');
        $.jps.publish('get-evernote-auth');
    });
})(jQuery);