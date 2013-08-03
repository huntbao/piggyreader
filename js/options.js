//Piggy Reader
//author @huntbao
(function($){
    'use strict';
    window.JiZhuReaderSettings = {
        init: function(){
            var self = this;
            self.i18nPage();
            self.initFontSize();
        },
        i18nPage: function(){
            document.title = chrome.i18n.getMessage('JiZhuReaderOption');
            $('.i18n').each(function(idx, el){
               $(this).text(chrome.i18n.getMessage($(this).data('i18n')));
            });
        },
        initFontSize: function(){
            var jiZhuReaderOptions = window.jiZhuReaderOptions;
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
        }
    }
    $(function(){
        JiZhuReaderSettings.init();
    });
})(jQuery);