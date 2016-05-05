//Piggy Reader
//author @huntbao
(function ($) {
  'use strict'
  $.jps.subscribe('init-reader', function () {
    App.modules.reader.init()
  })

  $(function () {
    $.jps.publish('init-reader')
  })

}(Zepto))