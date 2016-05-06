//Piggy Reader
//author @huntbao
(function ($) {
  'use strict'
  var changeHandler = function () {
    $.jps.publish('hide-all-mask-layers')
    var links = $('h3 a')
    var hospitalNames = window.putianHospitalDataJiZhuReader.names
    var hospitalUrls = window.putianHospitalDataJiZhuReader.urls
    links.forEach(function (link) {
      var node = link.parentNode.parentNode.parentNode.parentNode
      var resultText = node.innerText
      var found = false
      for (var i = 0; i < hospitalNames.length; i++) {
        if (resultText.indexOf(hospitalNames[i]) !== -1) {
          $.jps.publish('create-mask-layer', node, 'putian', hospitalNames[i])
          found = true
          break
        }
      }
      if (!found) {
        for (var i = 0; i < hospitalUrls.length; i++) {
          if (resultText.indexOf(hospitalUrls[i]) !== -1) {
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
    changeTimer = setTimeout(changeHandler, 300)
  }

  handler()

  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      console.log(mutation.type)
      handler()
    })
  })

  // configuration of the observer:
  var config = {attributes: true, childList: true, characterData: true}

  // pass in the target node, as well as the observer options
  observer.observe(document.querySelector('title'), config)

  $(window)

})(Zepto)
