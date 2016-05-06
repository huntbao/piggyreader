//Piggy Reader
//author @huntbao
(function ($) {
  'use strict'

  var maskLayer = {

    __layerEl: null,

    create: function (refEl, type, keyword) {
      var self = this
      var tpl = tpls[type || 'promotion']
      self.__layerEl = $(tpl).appendTo(refEl)
      if (refEl !== document.body) {
        $(refEl).css('position', 'relative')
      }
      if (keyword) {
        self.__layerEl.find('.jz-putian-keyword').text(keyword)
      }
      self.__layerEl.find('.jz-closebtn').click(function () {
        $(this).parent().remove()
      })
    },

    hideAll: function() {
      $('.jizhureader-mask-layer').remove()
    }

  }

  var maskLayerPromotionTpl = '' +
    '<div class="jizhureader-mask-layer">' +
    '   <div class="jz-closebtn">×</div>' +
    '   <div class="jz-layer-content">' +
    '       <div class="jz-layer-content-wrap">' +
    '        <h3 class="jz-layer-warn-title">危险!!!</h3>' +
    '        <p class="jz-layer-warn-tip">此处是营销推广产品, 请不要访问</p>' +
    '       </div>' +
    '   </div>' +
    '</div>'

  var maskLayerPuTianTpl = '' +
    '<div class="jizhureader-mask-layer">' +
    '   <div class="jz-closebtn">×</div>' +
    '   <div class="jz-layer-content">' +
    '       <div class="jz-layer-content-wrap">' +
    '        <h3 class="jz-layer-warn-title">危险!!!</h3>' +
    '        <p class="jz-layer-warn-tip">"<span class="jz-putian-keyword"></span>" 疑是莆田系医院, 请不要访问</p>' +
    '        <p class="jz-layer-warn-tip2">—— 珍惜生命, 远离莆田 <a href="https://github.com/open-power-workgroup/Hospital" target="_blank">名单来源</a></p>' +
    '       </div>' +
    '   </div>' +
    '</div>'


  var tpls = {
    putian: maskLayerPuTianTpl,
    promotion: maskLayerPromotionTpl
  }

  App.modules.maskLayer = maskLayer

})(Zepto)