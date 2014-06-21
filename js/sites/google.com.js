//Piggy Reader
//author @huntbao
jQuery(function () {
    'use strict'
    if (document.domain.indexOf('google.com') !== -1) {
        setTimeout(function () {
            var links = document.querySelectorAll('h3 a')
            for(var i = 0, l = links.length; i < l; i++) {
                links[i].removeAttribute('onmousedown')
                links[i].parentNode.replaceChild(links[i].cloneNode(true), links[i])
            }
        }, 0)
    }
})

