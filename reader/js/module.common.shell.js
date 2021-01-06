//Piggy Reader
//author @huntbao
(function ($) {
  'use strict'
  window.App = {
    modules: {}
  }

  $.jps.subscribe('init-selectionphrase', function (data) {
    App.modules.selectionPhrase.init({
      container: data.container,
      dictLookup: data.dictLookup || 'selection',
      from: data.from
    })
  })

  $.jps.subscribe('lookup-phrase', function (data) {
    if (data.isSamePhraseWithPrevious) {
      if (App.modules.dictLayer.isLayerShown()) {
        return
      }
    }
    $.jps.publish('hide-dict-layer')
    var port = chrome.extension.connect({name: 'lookup-phrase'})
    port.postMessage({
      phrase: data.phrase,
      position: data.position,
      from: data.from
    })
  })

  $.jps.subscribe('check-words', function (data) {
    var port = chrome.extension.connect({name: 'check-words'})
    port.postMessage({
      words: data.words
    })
  })

  $.jps.subscribe('init-dict-layer', function (dictData) {
    App.modules.dictLayer.init(dictData)
  })

  $.jps.subscribe('init-dict-checkresult-layer', function (dictData) {
    App.modules.dictCheckResultLayer.init(dictData)
  })

  $.jps.subscribe('hide-dict-layer', function () {
    App.modules.dictLayer.hideLayer()
  })

}(Zepto))