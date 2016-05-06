//Piggy Reader
//author @huntbao
(function ($) {
  'use strict'
  var changeHandler = function () {
    $.jps.publish('hide-all-mask-layers')
    var links = $('a[href]')
    links.forEach(function (link) {
      if (link.text == '搜狗推广') {
        var node = link.parentNode
        var boundRect = node.getBoundingClientRect()
        if (boundRect.left > 200) {
          node = link.parentNode.parentNode
        }
        $.jps.publish('create-mask-layer', node)
      }
    })
    var titles = $('h3 a')
    var hospitalNames = window.putianHospitalDataJiZhuReader.names
    var hospitalUrls = window.putianHospitalDataJiZhuReader.urls
    titles.forEach(function (title) {
      var node = title.parentNode.parentNode
      var innerText = node.innerText
      var found = false
      for (var i = 0; i < hospitalNames.length; i++) {
        if (innerText.indexOf(hospitalNames[i]) !== -1) {
          $.jps.publish('create-mask-layer', node, 'putian', hospitalNames[i])
          found = true
          break
        }
      }
      if (!found) {
        for (var i = 0; i < hospitalUrls.length; i++) {
          if (innerText.indexOf(hospitalUrls[i]) !== -1) {
            $.jps.publish('create-mask-layer', node, 'putian', hospitalUrls[i])
            break
          }
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