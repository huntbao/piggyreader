//Piggy Reader
//author @huntbao
(function ($) {
    'use strict';

    var dictLayer = {

        __layerEl: null,

        __isEntered: false,

        init: function (data) {
            var self = this;
            self.__hideLayer();
            self.__layerEl = $(Mustache.to_html(dictLayerTpl, data.dictData));
            self.__layerEl.appendTo(document.body);
            var layerElHeight = self.__layerEl.height();
            var layerElWidth = self.__layerEl.width();
            var position = data.position;
            if (position.bottom + layerElHeight > $(window).height()) {
                position.bottom = position.top - layerElHeight - 4;
                self.__layerEl.find('.jz-arrow').appendTo(self.__layerEl);
                self.__layerEl.addClass('jz-dict-layer-bottom');
            }
            var left = Math.max((position.right + position.left - layerElWidth) / 2, 0);
            self.__layerEl.css({
                left: left,
                top: position.bottom
            });
            self.__layerEl.mouseup(function (e) {
                e.stopPropagation();
            });
            if (data.hover) {
                self.__layerEl.mouseenter(function () {
                    self.__isEntered = true;
                });
                self.__layerEl.mouseleave(function () {
                    self.__isEntered = false;
                    self.__hideLayer();
                });
            }
            $(document).mouseup(function () {
                self.__hideLayer();
            });
            self.__layerEl.addClass('jz-opacity-ani');
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
        '<div class="jz-mod-dict-layer">' +
        '   <div class="jz-arrow">' +
        '       <div class="jz-arrow-shadow"></div>' +
        '   </div>' +
        '   <div class="jz-layer-content">' +
        '       <div class="jz-layer-content-wrap">' +
        '           <div class="jz-phrase-wrap">' +
        '               <span class="jz-phrase">{{phrase}}</span>' +
        '               {{#phoneticSymbol}}' +
        '               <span class="jz-phonetic-symbol">[{{phoneticSymbol}}]</span>' +
        '               {{/phoneticSymbol}}' +
        '           </div>' +
        '           <div class="jz-trans-items">' +
        '           {{#translation}}' +
        '               <div class="jz-phrase-tran">{{.}}</div>' +
        '           {{/translation}}' +
        '           </div>' +
        '           {{#hasMore}}' +
        '           <div class="jz-trans-moreitems">' +
        '               <div class="jz-trans-more"></div>' +
        '           {{#moreTranslatioin}}' +
        '               <div class="jz-phrase-tran">' +
        '                   <span class="jz-phrase-key">{{key}}: </span>' +
        '                   <span class="jz-phrase-value">{{value}}</span>' +
        '               </div>' +
        '           {{/moreTranslatioin}}' +
        '           </div>' +
        '           {{/hasMore}}' +
        '       </div>' +
        '   </div>' +
        '</div>';

    App.modules.dictLayer = dictLayer;

})(jQuery);