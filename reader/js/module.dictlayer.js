//Piggy Reader
//author @huntbao
(function ($) {
  'use strict'

  var dictLayer = {

    __layerEl: null,

    __isEntered: false,

    init: function (data) {
      var self = this
      self.__hideLayer()
      self.__layerEl = $(self.getLayerStr(data.dictData))
      self.__layerEl.appendTo(document.body)
      var layerElHeight = self.__layerEl.height()
      var layerElWidth = self.__layerEl.width()
      var position = data.position
      if (position.bottom + layerElHeight > $(window).height()) {
        position.bottom = position.top - layerElHeight - 4
        self.__layerEl.find('.jz-arrow').appendTo(self.__layerEl)
        self.__layerEl.addClass('jz-dict-layer-bottom')
      }
      var left = Math.max((position.right + position.left - layerElWidth) / 2, 0)
      if ($(document.body).css('position') === 'relative') {
        left -= ($(window).width() - $(document.body).width()) / 2
      }
      self.__layerEl.css({
        left: left + document.body.scrollLeft,
        top: position.bottom + document.body.scrollTop
      })
      self.__layerEl.mouseup(function (e) {
        e.stopPropagation()
      })
      if (data.hover) {
        self.__layerEl.mouseenter(function () {
          self.__isEntered = true
        })
        self.__layerEl.mouseleave(function () {
          self.__isEntered = false
          self.__hideLayer()
        })
      }
      $(document).mouseup(function () {
        self.__hideLayer()
      })
      self.__layerEl.addClass('jz-opacity-ani')
    },

    hideLayer: function () {
      var self = this
      setTimeout(function () {
        if (!self.__isEntered) {
          self.__hideLayer()
        }
      }, 0)
    },

    __hideLayer: function () {
      var self = this
      self.__layerEl && self.__layerEl.remove()
      self.__layerEl = null
    },

    isLayerShown: function () {
      return this.__layerEl
    },

    getLayerStr: function (data) {
      var phoneticSymbolStr = ''
      if (data.phoneticSymbol) {
        data.phoneticSymbol.split(', ').forEach(function (el) {
          phoneticSymbolStr += '<span class="jz-phonetic-symbol">[' + el + ']</span>'
        })
      }
      var translationStr = ''
      if (data.translation) {
        data.translation.forEach(function (el) {
          translationStr += '<div class="jz-phrase-tran">' + el + '</div>'
        })
      }
      var moreTransStr = ''
      if (data.hasMore) {
        moreTransStr += '<div class="jz-trans-moreitems"><div class="jz-trans-more"></div>'
        data.moreTranslatioin.forEach(function (el) {
          moreTransStr += '<div class="jz-phrase-tran"><span class="jz-phrase-key">' + el.key + ': ' + '</span><span class="jz-phrase-value">' + el.value + '</span></div>'
        })
      }
      var str = dictLayerTpl.replace(/{{phrase}}/, data.phrase)
        .replace(/{{phoneticSymbol}}/, phoneticSymbolStr)
        .replace(/{{translation}}/, translationStr)
        .replace(/{{moreTranslation}}/, moreTransStr)
      return str
    }

  }

  var dictLayerTpl = '' +
    '<div class="jz-mod-dict-layer">' +
    '   <div class="jz-arrow">' +
    '       <div class="jz-arrow-shadow"></div>' +
    '   </div>' +
    '   <div class="jz-layer-content">' +
    '       <div class="jz-layer-content-wrap">' +
    '           <div class="jz-phrase-wrap">' +
    '               <span class="jz-phrase">{{phrase}}</span>' +
    '               {{phoneticSymbol}}' +
    '           </div>' +
    '           <div class="jz-trans-items">' +
    '           {{translation}}' +
    '           </div>' +
    '           {{moreTranslation}}' +
    '       </div>' +
    '   </div>' +
    '</div>'

  App.modules.dictLayer = dictLayer

})(Zepto)