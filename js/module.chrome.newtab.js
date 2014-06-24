//Piggy Reader
//author @huntbao
(function ($) {
    'use strict'

    $(function () {
        if ($('html').attr('manifest').indexOf('/_/chrome/newtab/manifest') !== -1) {
            var originalSearchBox = $('#q')
            var originalSearchBoxOffset = originalSearchBox.offset()
            setTimeout(function () {
                App.modules.search.init($(document.body), {
                    searchBoxCss: {
                        left: originalSearchBoxOffset.left,
                        top: originalSearchBoxOffset.top,
                        width: originalSearchBox.width(),
                        height: originalSearchBox.height()
                    }
                })
                originalSearchBox.parent().hide()
            }, 1000)
        }
    })

}(jQuery))