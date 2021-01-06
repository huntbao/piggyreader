//Piggy Reader
//author @huntbao
(function ($) {
  'use strict'

  var dictCheckResultLayer = {

    __layerEl: null,

    __isEntered: false,

    init: function (data) {
      if (typeof data === 'string') {
        data = JSON.parse(data)
      }
      var self = this
      self.__hideLayer()
      console.log(data)
      if (data.init) {
        self.__layerEl = $(self.getInitTip(data.words))
      } else {
        self.__layerEl = $(self.getWordsStr(data.dictDataArr))
        self.__layerElWrap = self.__layerEl.find('.jz-mod-dict-checkresult-layer-wrap')
        self.__layerElWrap.mouseup(function (e) {
          e.stopPropagation()
        })
        $(document).mouseup(function () {
          self.__hideLayer()
        })
      }
      $(document.body).addClass('jz-mod-dict-hidden-scroll')
      self.__layerEl.appendTo(document.body)
    },

    __hideLayer: function () {
      var self = this
      self.__layerEl && self.__layerEl.remove()
      self.__layerEl = null
    },

    getWordStr: function (data, num) {
      Object.keys(data)
      var phoneticSymbolStr = ''
      if (data.phoneticSymbol) {
        data.phoneticSymbol.split(', ').forEach(function (el) {
          phoneticSymbolStr += '<span class="jz-phonetic-symbol">[' + el + ']</span>'
        })
      }
      var translationStr = ''
      if (data.translation) {
        data.translation.forEach(function (el) {
          translationStr += '<span class="jz-phrase-tran">' + el + '</span>'
        })
      }
      var str = wordTpl.replace(/{{num}}/, num)
        .replace(/{{phrase}}/, data.phrase)
        .replace(/{{phoneticSymbol}}/, phoneticSymbolStr)
      if (translationStr) {
        str = str.replace(/{{translation}}/, translationStr)
      } else {
        str = str.replace(/{{translation}}/, '拼写错误，请在页面使用 Command+F 搜索确认')
          .replace(/jz-layer-worditem/, 'jz-layer-worditem jz-layer-worditem-error')
      }

      return str
    },

    getWordsStr: function (dataArr) {
      var self = this
      var str = ''
      var num = 0
      var hasNoTrans = []
      var hasTrans = []
      dataArr.forEach(function (data) {
        if (data.translation && data.translation.length) {
          hasTrans.push(data)
        } else {
          hasNoTrans.push(data)
        }
      })
      hasNoTrans.forEach(function (data) {
        str += self.getWordStr(data, ++num)
      })
      hasTrans.forEach(function (data) {
        str += self.getWordStr(data, ++num)
      })
      return dictLayerTpl.replace(/{{words}}/, str)
    },

    getInitTip: function (dictDataArr) {
      return initDictLayerTpl.replace(/{{num}}/, dictDataArr.length)
        .replace(/{{words}}/, dictDataArr.join(', '))
    }

  }

  var wordTpl = '' +
    '<div class="jz-layer-worditem">' +
    '    <div class="jz-layer-worditem-wrap">' +
    '        <span class="jz-word">{{num}}. {{phrase}}: </span>' +
    '        {{phoneticSymbol}}' +
    '        <span class="jz-trans-items">' +
    '        {{translation}}' +
    '        </span>' +
    '    </div>' +
    '</div>'

  var dictLayerTpl = '' +
    '<div class="jz-mod-dict-checkresult-layer">' +
    '   <div class="jz-mod-dict-checkresult-layer-wrap">' +
    '       {{words}}' +
    '   </div>' +
    '</div>'

  var initDictLayerTpl = '' +
    '<div class="jz-mod-dict-checkresult-layer">' +
    '   <div class="jz-mod-dict-checkresult-layer-wrap">' +
    '       <div class="jz-mod-dict-checkresult-layer-init">共找到 {{num}} 个单词，正在查询中，请稍候...</div>' +
    '       <div>{{words}}</div>' +
    '   </div>' +
    '</div>'

  App.modules.dictCheckResultLayer = dictCheckResultLayer

})(Zepto)