//Piggy Reader
//author @huntbao
(function ($) {
    'use strict';

    var dictLayer = {

        __layerEl: null,

        __isEntered: false,

        init: function (data) {
            var self = this;
            if (self.__layerEl) {
                self.__layerEl.remove();
            }
            self.__layerEl = $(Mustache.to_html(dictLayerTpl, data.dictData));
            self.__layerEl.appendTo(document.body);
            var layerElHeight = self.__layerEl.height();
            if (data.position.clientY + layerElHeight > $(window).height()) {
                data.position.top -= layerElHeight + 20;
                self.__layerEl.find('.arrow').appendTo(self.__layerEl);
                self.__layerEl.addClass('dict-layer-bottom');
            }
            self.__layerEl.css({
                left: data.position.left - self.__layerEl.width() / 2,
                top: data.position.top
            });
            self.__layerEl.mouseup(function (e) {
                e.stopPropagation();
            });
            self.__layerEl.mouseenter(function () {
                self.__isEntered = true;
            });
            self.__layerEl.mouseleave(function () {
                self.__isEntered = false;
                self.__hideLayer();
            });
            $(document).mouseup(function () {
                self.__hideLayer();
            });
            self.__layerEl.addClass('opacity-ani');
        },

        hideLayer: function () {
            var self = this;
            setTimeout(function () {
                if (!self.__isEntered) {
                    self.__hideLayer();
                }
            }, 0);
        },

        __hideLayer: function () {
            var self = this;
            self.__layerEl && self.__layerEl.remove();
            self.__layerEl = null;
        },

        isLayerShown: function () {
            return this.__layerEl;
        }

    };

    var dictLayerTpl = '' +
        '<div class="mod-dict-layer">' +
        '   <div class="arrow">' +
        '       <div class="arrow-shadow"></div>' +
        '   </div>' +
        '   <div class="layer-content">' +
        '       <div class="layer-content-wrap">' +
        '           <div class="phrase-wrap">' +
        '               <span class="phrase">{{phrase}}</span>' +
        '               {{#phoneticSymbol}}' +
        '               <span class="phonetic-symbol">[{{phoneticSymbol}}]</span>' +
        '               {{/phoneticSymbol}}' +
        '           </div>' +
        '           <div class="trans-items">' +
        '           {{#translation}}' +
        '               <div class="phrase-tran">{{.}}</div>' +
        '           {{/translation}}' +
        '           </div>' +
        '       </div>' +
        '   </div>' +
        '</div>';

    App.modules.dictLayer = dictLayer;

})(jQuery);