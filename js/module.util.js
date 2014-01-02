//Piggy Reader
//author @huntbao
(function ($) {
    'use strict';
    var util = {

        getParaValue: function (param, str) {
            var paras = str.split('&');
            var findValue;
            $.each(paras, function (idx, para) {
                var p = para.split('=');
                if (p[0] === param) {
                    findValue = p[1];
                    return false;
                }
            });
            return findValue;
        },

        getQueryParams: function (str) {
            var paras = str.split('&');
            var queryParams = {};
            $.each(paras, function (idx, para) {
                var p = para.split('=');
                queryParams[p[0]] = p[1];
            });
            return queryParams;
        }

    }

    App.modules.util = util;

}(jQuery));