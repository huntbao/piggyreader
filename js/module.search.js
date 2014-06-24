//Piggy Reader
//author @huntbao
(function ($) {
    'use strict'
    App.modules.search = {

        __searchContainer: null,

        __searchResultContainer1: null,

        __searchResultContainer2: null,

        init: function (container, options) {
            var self = this
            self.__body = container
            self.preparePage()
            var searchBoxWrap = $('<div>', {
                class: 'pr-searchbox-wrap'
            }).appendTo(self.__body)
            searchBoxWrap.css({
                top: options.searchBoxCss.top
            })
            var __searchBox = $('<input>', {
                type: 'text',
                placeholder: 'google/baidu search',
                class: 'pr-search-box',
                autofocus: true
            }).appendTo(searchBoxWrap)
            __searchBox.css({
                width: options.searchBoxCss.width,
                height: options.searchBoxCss.height
            })
            __searchBox.keydown(function (e) {
                if (e.keyCode === 13) {
                    $(this).val($.trim($(this).val()))
                    if ($(this).val()) {
                        self.__searchContainer.css('opacity', 1)
                        searchBoxWrap.addClass('after-search')
                        self.searchFromGoogle($(this).val())
                        self.searchFromBaidu($(this).val())
                    }
                }
            })
        },

        searchFromGoogle: function (query, newsearch, pn) {
            var self = this
            if (newsearch) {
                self.__searchResultContainer1.css('opacity', .5)
            }
            self.getDocByUrl(self.buildGoogleSearchUrl(query, pn), function (doc) {
                self.__searchResultContainer1.empty().css('opacity', 1)
                self.buildGoogleSearchResult(doc, query, pn)
            })
        },

        searchFromBaidu: function (query, newsearch, pn) {
            var self = this
            if (newsearch) {
                self.__searchResultContainer2.css('opacity', .5)
            }
            self.getDocByUrl(self.buildBaiduSearchUrl(query, pn), function (doc) {
                self.__searchResultContainer2.empty().css('opacity', 1)
                self.buildBaiduSearchResult(doc, query, pn)
            })
        },

        buildGoogleSearchResult: function (doc, query, pn) {
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
                        html: dUrlEl.find('cite').html(),
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

            // build pagination
            var currentPageEl = $(doc).find('#nav .cur')
            var paginationWrap = $('<div>', {
                class: 'mod-result-pagination-btn'
            }).appendTo(self.__searchResultContainer1)

            if (pn) {
                // build prev button
                var prevBtn = $('<a>', {
                    text: 'Prev',
                    class: 'pagination-prev',
                    click: function () {
                        if ($(this).data('loading')) return false
                        $(this).data('loading', true)
                        self.searchFromGoogle(query, true, self.getUrlPara(this.href, 'start') >> 0)
                        self.__nextPNOfGoogle -= self.__itemsPerPageOfGoogle
                        return false
                    },
                    href: '#&start=' + (self.__nextPNOfGoogle - self.__itemsPerPageOfGoogle * 2)
                })
                prevBtn.appendTo(paginationWrap)
            }

            var nextA = currentPageEl.next().find('a')
            if (nextA.length) {
                // build next button
                if (!pn) {
                    self.__itemsPerPageOfGoogle = self.getUrlPara(nextA.attr('href'), 'start') >> 0
                    self.__nextPNOfGoogle = self.__itemsPerPageOfGoogle
                }
                var nextBtn = $('<a>', {
                    text: 'Next',
                    class: 'pagination-next',
                    click: function () {
                        if ($(this).data('loading')) return
                        $(this).data('loading', true)
                        self.searchFromGoogle(query, true, self.getUrlPara(this.href, 'start') >> 0)
                        self.__nextPNOfGoogle += self.__itemsPerPageOfGoogle
                        return false
                    },
                    href: '#&start=' + self.__nextPNOfGoogle
                })
                nextBtn.appendTo(paginationWrap)
            }

            // build related search
            var rsSeeds = $(doc).find('#brs a')
            if (rsSeeds.length) {
                var rsCon = $('<div>', {
                    class: 'mod-related-search'
                }).append('<span>Related search:</span>').appendTo(self.__searchResultContainer1)
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

            genPage().insertBefore(paginationWrap)
        },

        buildBaiduSearchResult: function (doc, query, pn) {
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

            // build pagination
            var currentPageEl = $(doc).find('#page strong')
            var paginationWrap = $('<div>', {
                class: 'mod-result-pagination-btn'
            }).appendTo(self.__searchResultContainer2)

            if (pn) {
                // build prev button
                var prevBtn = $('<a>', {
                    text: '<Prev',
                    class: 'pagination-prev',
                    click: function () {
                        if ($(this).data('loading')) return false
                        $(this).data('loading', true)
                        self.searchFromBaidu(query, true, self.getUrlPara(this.href, 'pn') >> 0)
                        self.__nextPNOfBaidu -= self.__itemsPerPageOfBaidu
                        return false
                    },
                    href: '#&pn=' + (self.__nextPNOfBaidu - self.__itemsPerPageOfBaidu * 2)
                })
                prevBtn.appendTo(paginationWrap)
            }

            var nextA = currentPageEl.next()
            if (nextA.length) {
                // build next button
                if (!pn) {
                    self.__itemsPerPageOfBaidu = self.getUrlPara(nextA.attr('href'), 'pn') >> 0
                    self.__nextPNOfBaidu = self.__itemsPerPageOfBaidu
                }
                var nextBtn = $('<a>', {
                    text: 'Next>',
                    class: 'pagination-next',
                    click: function () {
                        if ($(this).data('loading')) return false
                        $(this).data('loading', true)
                        self.searchFromBaidu(query, true, self.getUrlPara(this.href, 'pn') >> 0)
                        self.__nextPNOfBaidu += self.__itemsPerPageOfBaidu
                        return false
                    },
                    href: '#&pn=' + self.__nextPNOfBaidu
                })
                nextBtn.appendTo(paginationWrap)
            }

            // build related search
            var rsSeeds = $(doc).find('#rs a')
            if (rsSeeds.length) {
                var rsCon = $('<div>', {
                    class: 'mod-related-search'
                }).append('<span>Related search:</span>').appendTo(self.__searchResultContainer2)
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

            genPage().insertBefore(paginationWrap)
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

        buildGoogleSearchUrl: function (query, start) {
            //return 'http://search.aol.com/aol/search?q=' + query.replace(/\s/g, '+')
            return 'https://wen.lu/search?q=' + query.replace(/\s/g, '+') + (start ? '&start=' + start : '')
        },

        buildBaiduSearchUrl: function (query, pn) {
            return 'http://www.baidu.com/s?wd=' + query + (pn ? '&pn=' + pn : '')
        },

        preparePage: function () {
            var self = this
            if (!self.__searchContainer) {
                self.__searchContainer = $('<div>', {
                    class: 'search-result-wrap'
                }).appendTo(self.__body)
                self.__searchResultContainer1 = $('<div>', {
                    class: 'mod-search-result'
                })
                self.__searchResultContainer2 = self.__searchResultContainer1.clone()
                self.__searchContainer.append(self.__searchResultContainer1)
                self.__searchContainer.append(self.__searchResultContainer2)
                self.__searchContainer.append($('<div>', {
                    class: 'mod-search-result-ph'
                }))
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