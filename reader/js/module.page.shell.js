//Piggy Reader
//author @huntbao
(function ($) {
  'use strict'
  var page = {
    init: function () {
      var self = this
      var __settings = null
      chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
        if (!sender || sender.id !== chrome.i18n.getMessage("@@extension_id")) return
        switch (request.name) {
          case 'settings':
            __settings = request.data
            $.jps.publish('init-selectionphrase', {
              container: $(document.body),
              dictLookup: __settings.dictHostpage || 'selection',
              from: 'page'
            })
            break
          case 'lookupphrase-result':
            if (request.data.from !== 'page') return
            if (request.data.phrase !== document.getSelection().toString().trim()) return
            $.jps.publish('init-dict-layer', {
              dictData: request.data.dictData,
              position: request.data.position,
              hover: __settings.dictHostpage === 'hover'
            })
            break
          default:
            break
        }
      })
      chrome.extension.connect({name: 'getsettings'}).postMessage()
      $(document.body).keydown(function (e) {
        if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.keyCode === 88) {
          chrome.extension.connect({name: 'createreader'})
        }
      })
      self.addEvent()
      self.fuckPutian()
    },

    addEvent: function () {
      $.jps.subscribe('create-mask-layer', function (refEl, type, keyword) {
        App.modules.maskLayer.create(refEl, type, keyword)
      })
      $.jps.subscribe('hide-all-mask-layers', function () {
        App.modules.maskLayer.hideAll()
      })
    },

    fuckPutian: function() {
      var hospitalUrls = window.putianHospitalDataJiZhuReader.urls
      var hostname = window.location.hostname
      for (var i = 0; i < hospitalUrls.length; i++) {
        if (hospitalUrls[i].indexOf(hostname) !== -1 || hostname.indexOf(hospitalUrls[i]) !== -1) {
          $(document.body).css({
            overflow: 'hidden',
            position: 'static'
          })
          $.jps.publish('create-mask-layer', document.body, 'putian', hospitalUrls[i])
          break
        }
      }
    }

  }

  $(function () {
    page.init()
  })

}(Zepto))