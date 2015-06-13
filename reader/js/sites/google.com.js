//Piggy Reader
//author @huntbao
Zepto(function () {
    'use strict'
    if (document.domain.indexOf('google.com') !== -1) {
        var dealFunc = function () {
            setTimeout(function () {
                var links = document.querySelectorAll('h3 a')
                for(var i = 0, l = links.length; i < l; i++) {
                    links[i].removeAttribute('onmousedown')
                    links[i].parentNode.replaceChild(links[i].cloneNode(true), links[i])
                }
            }, 1000)
        }
        dealFunc()
        window.addEventListener('hashchange', dealFunc, false)
    }
})

