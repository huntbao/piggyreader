//Piggy Reader
//author @huntbao
(function ($) {
    'use strict'
    App.modules.search = {

        __isInited: false,

        __searchBox: null,

        __body: null,

        __container: null,

        __searchResultContainer1: null,

        __searchResultContainer2: null,

        init: function () {
            var self = this
            self.__body = $(document.body)
            self.__searchBox = $('#search-box')
            self.__searchBox.keydown(function (e) {
                if (e.keyCode === 13) {
                    $(this).val($.trim($(this).val()))
                    if ($(this).val()) {
                        self.preparePage()
                        self.searchFromGoogle($(this).val())
                        self.searchFromBaidu($(this).val())
                        $(this).blur()
                    }
                }
            })
        },

        searchFromGoogle: function (query, append) {
            var self = this
            if (!append) {
                self.__searchResultContainer1.empty().text('loading data...')
            }
            self.getDocByUrl(self.buildGoogleSearchUrl(query), function (doc) {
                !append && self.__searchResultContainer1.empty()
                self.buildGoogleSearchResult(doc, query, append)
            })
        },

        searchFromBaidu: function (query, append) {
            var self = this
            if (!append) {
                self.__searchResultContainer2.empty().text('loading data...')
            }
            self.getDocByUrl(self.buildBaiduSearchUrl(query), function (doc) {
                !append && self.__searchResultContainer2.empty()
                self.buildBaiduSearchResult(doc, query, append)
            })
        },

        buildGoogleSearchResult: function (doc, query, append) {
            var self = this
            var genPage = function () {
                // build results
                var page = $('<div>', {
                    class: 'result-page'
                })
                var results = doc.querySelectorAll('h3 a')
                for (var i = 0, l = results.length, wrap, el, descEl, dUrlEl; i < l; i++) {
                    el = results[i]
                    wrap = $('<div>', {
                        class: 'result-item'
                    }).appendTo(page)
                    wrap.append($('<a>', {
                        href: el.href,
                        target: '_blank',
                        html: el.innerHTML,
                        class: 'result-title'
                    }))
                    dUrlEl = $(el).closest('.rc').find('.kv')
                    wrap.append($('<p>', {
                        html: dUrlEl.find('._Zd').html(),
                        class: 'result-durl'
                    }))
                    descEl = $(el).closest('.rc').find('.st')
                    wrap.append($('<p>', {
                        html: descEl.html(),
                        class: 'result-desc'
                    }))
                }
                return page
            }
            // build more
            if (!append) {
                var moreBtn = $('<a>', {
                    text: 'more>>',
                    click: function () {
                        if ($(this).data('loading')) return
                        $(this).text('loading...').data('loading', true)
                        self.searchFromGoogle(query + '&start=' + self.getUrlPara(this.href, 'start'), true)
                        return false
                    }
                })
                moreBtn.appendTo($('<div>', {
                    class: 'mod-result-more-btn'
                }).appendTo(self.__searchResultContainer1))
                // build related search
                var rsSeeds = $(doc).find('#brs a')
                if (rsSeeds.length) {
                    var rsCon = $('<div>', {
                        class: 'mod-related-search'
                    }).append('<span>related search:</span>').appendTo(self.__searchResultContainer1)
                    rsSeeds.each(function () {
                        rsCon.append($('<a>', {
                            href: '#',
                            text: $(this).text()
                        }))
                    })
                    rsCon.on('click', 'a', function (e) {
                        self.searchFromGoogle($(this).text())
                        return false
                    })
                }
            }
            var moreBtnWrap = self.__searchResultContainer1.find('.mod-result-more-btn')
            moreBtnWrap.find('a').attr('href', $(doc).find('#nav .cur').next().find('a').attr('href')).text('more>>').data('loading', false)
            genPage().insertBefore(moreBtnWrap)
        },

        buildBaiduSearchResult: function (doc, query, append) {
            var self = this
            var genPage = function () {
                var results = doc.querySelectorAll('h3 a:not(.OP_LOG_LINK)')
                // build results
                var page = $('<div>', {
                    class: 'result-page'
                })
                for (var i = 0, l = results.length, wrap, el, descEl, dUrlEl; i < l; i++) {
                    el = results[i]
                    wrap = $('<div>', {
                        class: 'result-item'
                    }).appendTo(page)
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
                    descEl = $(el).closest('.c-container').find('.c-abstract').clone()
                    descEl.find('div').remove()
                    wrap.append($('<p>', {
                        html: descEl.html(),
                        class: 'result-desc'
                    }))
                }
                return page
            }
            // build more
            if (!append) {
                var moreBtn = $('<a>', {
                    text: 'more>>',
                    click: function () {
                        if ($(this).data('loading')) return
                        $(this).text('loading...').data('loading', true)
                        self.searchFromBaidu(query + '&pn=' + self.getUrlPara(this.href, 'pn'), true)
                        return false
                    }
                })
                moreBtn.appendTo($('<div>', {
                    class: 'mod-result-more-btn'
                }).appendTo(self.__searchResultContainer2))
                // build related search
                var rsSeeds = $(doc).find('#rs a')
                if (rsSeeds.length) {
                    var rsCon = $('<div>', {
                        class: 'mod-related-search'
                    }).append('<span>related search:</span>').appendTo(self.__searchResultContainer2)
                    rsSeeds.each(function () {
                        rsCon.append($('<a>', {
                            href: '#',
                            text: $(this).text()
                        }))
                    })
                    rsCon.on('click', 'a', function (e) {
                        self.searchFromBaidu($(this).text())
                        return false
                    })
                }
            }
            var moreBtnWrap = self.__searchResultContainer2.find('.mod-result-more-btn')
            moreBtnWrap.find('a').attr('href', $(doc).find('#page strong').next().attr('href')).text('more>>').data('loading', false)
            genPage().insertBefore(moreBtnWrap)
        },

        getDocByUrl: function (url, callback) {
            var xhr = new XMLHttpRequest()
            xhr.open('get', url, true)
            xhr.responseType = 'document'
            xhr.onload = function (e) {
                if (e.target.status === 200) {
                    callback(xhr.response)
                }
            }
            xhr.send(null)
        },

        buildGoogleSearchUrl: function (query) {
            //return 'http://search.aol.com/aol/search?q=' + query.replace(/\s/g, '+')
            return 'https://wen.lu/search?q=' + query.replace(/\s/g, '+')
        },

        buildBaiduSearchUrl: function (query) {
            return 'http://www.baidu.com/s?wd=' + query
        },

        preparePage: function () {
            var self = this
            if (!self.__isInited) {
                self.__isInited = true
                self.__body.removeAttr('class')
                $('#jz-contentwrap').remove()
                self.__container = $('<div>', {
                    class: 'search-result-wrap'
                }).appendTo(self.__body).css('width', Math.min(1200, ($(window).width() - 200)))
                self.__searchResultContainer1 = $('<div>', {
                    class: 'mod-search-result'
                })
                self.__searchResultContainer2 = self.__searchResultContainer1.clone()
                self.__container.append(self.__searchResultContainer1)
                self.__container.append($('<div>', {
                    class: 'mod-search-result-sep'
                }))
                self.__container.append(self.__searchResultContainer2)
            }
        },

        getUrlPara: function (url, key) {
            var paras = url.split('&')
            for (var i = 0, l = paras.length; i < l; i++) {
                var s = paras[i].split('=')
                if (s.length === 2 && s[0] === key) {
                    return s[1]
                }
            }
        }
    }

})(jQuery)