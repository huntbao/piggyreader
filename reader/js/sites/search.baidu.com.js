//Piggy Reader
//author @huntbao
(function ($) {
  'use strict'
  var changeHandler = function () {
    $.jps.publish('hide-all-mask-layers')
    var links = $('a[href]')
    links.forEach(function (link) {
      if (link.text == '推广链接') {
        var node = link.parentNode
        var boundRect = node.getBoundingClientRect()
        if (boundRect.left > 200) {
          node = link.parentNode.parentNode
        }
        $.jps.publish('create-mask-layer', node)
      }
    })
    var titles = $('.c-container')
    titles.forEach(function (title) {
      var innerText = title.innerText
      var hospitalNames = window.putianHospitalDataJiZhuReader.names
      for (var i = 0; i < hospitalNames.length; i++) {
        if (innerText.indexOf(hospitalNames[i]) !== -1) {
          $.jps.publish('create-mask-layer', title, 'putian')
          break
        }
      }
    })
  }

  var changeTimer
  var handler = function () {
    clearTimeout(changeTimer)
    changeTimer = setTimeout(changeHandler, 10)
  }

  handler()

  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      handler()
    })
  })

  // configuration of the observer:
  var config = {attributes: true, childList: true, characterData: true}

  // pass in the target node, as well as the observer options
  observer.observe(document.querySelector('title'), config)

})(Zepto)