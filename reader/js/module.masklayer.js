//Piggy Reader
//author @huntbao
(function ($) {
  'use strict'

  var maskLayer = {

    __layerEl: null,

    create: function (refEl, type) {
      var self = this
      var tpl = tpls[type || 'promotion']
      self.__layerEl = $(tpl).appendTo(refEl)
      $(refEl).css('position', 'relative')
      self.__layerEl.css({
        left: 0,
        top: 0,
        width: $(refEl).width(),
        height: $(refEl).height()
      })
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
    '        <p class="jz-layer-warn-tip">疑似莆田系医院, 请不要访问 <a href="https://github.com/open-power-workgroup/Hospital" target="_blank">名单来源</a></p>' +
    '        <p class="jz-layer-warn-tip2">——珍惜生命, 远离莆田!!!</p>' +
    '       </div>' +
    '   </div>' +
    '</div>'


  var tpls = {
    putian: maskLayerPuTianTpl,
    promotion: maskLayerPromotionTpl
  }

  App.modules.maskLayer = maskLayer

})(Zepto)