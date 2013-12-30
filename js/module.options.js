//Piggy Reader
//author @huntbao
(function ($) {
    'use strict';
    window.JiZhuReaderSettings = {

        __optionsTip: $('#options-tip'),

        init: function () {
            var self = this;
            self.i18nPage();
            self.initFontSize();
            self.initDictOptions();
        },

        i18nPage: function () {
            document.title = chrome.i18n.getMessage('JiZhuReaderOption');
            $('.i18n').each(function () {
                $(this).text(chrome.i18n.getMessage($(this).data('i18n')));
            });
        },

        initFontSize: function () {
            var self = this;
            var jiZhuReaderOptions = window.jiZhuReaderOptions;
            var demonstrateFontSize = $('#demonstratefontsize');
            var changeFunc = function (fs) {
                demonstrateFontSize.css('font-size', fs + 'px');
            };
            $('#fontsize').change(function (e) {
                var fontSize = $(this).val();
                $(this).next().text(fontSize);
                changeFunc(fontSize);
                jiZhuReaderOptions.fontSize = fontSize;
                if (!e.isTrigger) {
                    self.__tipFunc();
                }
            }).val(jiZhuReaderOptions.fontSize).trigger('change');
        },

        initDictOptions: function () {
            var self = this;
            var jiZhuReaderOptions = window.jiZhuReaderOptions;
            var radios = $('input[type=radio]');
            radios.change(function () {
                jiZhuReaderOptions[this.name] = $(this).prop('value');
                self.__tipFunc();
            })
            $.each(radios, function () {
                if (jiZhuReaderOptions[this.name] === $(this).prop('value')) {
                    this.checked = true;
                }
            });
        },

        __tipFunc: function () {
            var self = this;
            self.__optionsTip.fadeIn(function () {
                setTimeout(function () {
                    self.__optionsTip.fadeOut();
                }, 3000);
            });
        }

    }

    $(function () {
        JiZhuReaderSettings.init();
    });

})(jQuery);