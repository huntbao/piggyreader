//Piggy Reader
//author @huntbao
(function ($) {
    'use strict'
    App.modules.search = {

        __searchBox: null,

        init: function () {
            var self = this
            self.__searchBox = $('input[type="search"]')
            self.__searchBox.keydown(function (e) {
                if (e.keyCode === 13) {
                    $(this).val($.trim($(this).val()))
                    if ($(this).val()) {
//                    self.getDocByUrl(self.buildAolSearchUrl($(this).val()), function (doc) {
//                        self.buildAolSearchResult(doc)
//                    })
                        self.getDocByUrl(self.buildBaiduSearchUrl($(this).val()), function (doc) {
                            self.buildBaiduSearchResult(doc)
                        })
                    }
                }
            })
        },
        buildAolSearchResult: function (doc) {
            var self = this
            var results = doc.querySelectorAll('h3 a')
            var content = $('<div>', {class: 'mod-search-result'})
            for (var i = 0, l = results.length, wrap, el, descEl, dUrlEl; i < l; i++) {
                el = results[i]
                wrap = $('<div>', {
                    class: 'result-item'
                }).appendTo(content)
                wrap.append($('<a>', {
                    href: el.href,
                    target: '_blank',
                    html: el.innerHTML,
                    class: 'result-title'
                }))
                dUrlEl = $(el).closest('li').find('.durl').find('[property="f:durl"]')
                wrap.append($('<p>', {
                    html: dUrlEl.html(),
                    class: 'result-durl'
                }))
                descEl = $(el).closest('li').find('p[property="f:desc"]')
                wrap.append($('<p>', {
                    html: descEl.html(),
                    class: 'result-desc'
                }))
            }
            $.jps.publish('set-reader-content', content)
        },
        buildBaiduSearchResult: function (doc) {
            var self = this
            var results = doc.querySelectorAll('h3 a:not(.OP_LOG_LINK)')
            var content = $('<div>', {class: 'mod-search-result'})
            for (var i = 0, l = results.length, wrap, el, descEl, dUrlEl; i < l; i++) {
                el = results[i]
                wrap = $('<div>', {
                    class: 'result-item'
                }).appendTo(content)
                wrap.append($('<a>', {
                    href: el.href,
                    target: '_blank',
                    html: el.innerHTML,
                    class: 'result-title'
                }))
                dUrlEl = $(el).closest('.c-container').find('.f13 .g')
                wrap.append($('<p>', {
                    html: dUrlEl.html(),
                    class: 'result-durl'
                }))
                descEl = $(el).closest('.c-container').find('.c-abstract')
                wrap.append($('<p>', {
                    html: descEl.html(),
                    class: 'result-desc'
                }))
            }
            $.jps.publish('set-reader-content', content)
        },
        getDocByUrl: function (url, callback) {
            var xhr = new XMLHttpRequest()
            xhr.open('get', url, true)
            xhr.responseType = 'document'
            xhr.onload = function (e) {
                if (e.target.status === 200) {
                    callback && callback(xhr.response)
                }
            }
            xhr.send(null)
        },
        buildAolSearchUrl: function (query) {
            return 'http://search.aol.com/aol/search?q=' + query.replace(/\s/g, '+')
        },
        buildBaiduSearchUrl: function (query) {
            return 'http://www.baidu.com/s?wd=' + query.replace(/\s/g, '+')
        }
    }

})(jQuery)