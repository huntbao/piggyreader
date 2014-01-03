//Piggy Reader
//author @huntbao
(function ($) {
    'use strict';
    var util = {
        getQueryParams: function (str) {
            var paras = str.split('&');
            var queryParams = {};
            $.each(paras, function (idx, para) {
                var p = para.split('=');
                queryParams[p[0]] = p[1];
            });
            return queryParams;
        },

        initI18n: function (container) {
            $('.i18n', container).each(function () {
                $(this).text(chrome.i18n.getMessage($(this).data('i18n')));
            });
        }
    };

    App.modules.util = util;

}(jQuery));