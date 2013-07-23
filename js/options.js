//Piggy Reader
//author @huntbao
(function($){
    'use strict';
    window.JiZhuReaderSettings = {
        init: function(){
            var self = this,
            jiZhuReaderOptions = window.jiZhuReaderOptions;
            self.i18nPage();
            var demonstrateFontSize = $('#demonstratefontsize'),
            changeFunc = function(fs){
                demonstrateFontSize.css('font-size', fs + 'px');
            }
            $('#fontsize').change(function(){
                var fontSize = $(this).val();
                $(this).next().text(fontSize);
                changeFunc(fontSize);
                jiZhuReaderOptions.fontSize = fontSize;
            }).val(jiZhuReaderOptions.fontSize).trigger('change');
        },
        i18nPage: function(){
            var self = this;
            document.title = chrome.i18n.getMessage('JiZhuReaderOption');
            $('#option').text(chrome.i18n.getMessage('Option'));
            $('#readerfontsize').text(chrome.i18n.getMessage('ReaderFontSize'));
            $('#copyright').text(chrome.i18n.getMessage('Copyright'));
            $('#demonstratefontsize').text(chrome.i18n.getMessage('ExtensionName'));
        }
    }
    $(function(){
        JiZhuReaderSettings.init();
    });
})(jQuery);