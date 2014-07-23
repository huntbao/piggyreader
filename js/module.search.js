//Piggy Reader
//author @huntbao
(function ($) {
    'use strict'
    App.modules.search = {

        __searchContainer: null,

        __searchResultContainer1: null,

        __searchResultContainer2: null,

        __searchBox: null,

        init: function (container, options) {
            var self = this
            self.__body = container
            self.preparePage()
            var searchBoxWrap = $('<div>', {
                class: 'pr-searchbox-wrap'
            }).prependTo(self.__body)
            searchBoxWrap.css({
                top: options.searchBoxCss.top
            })
            var __searchBox = $('<input>', {
                type: 'text',
                placeholder: 'google/baidu search',
                class: 'pr-search-box',
                autofocus: true,
                tabIndex: 1,
                name: 'q'
            }).appendTo(searchBoxWrap)
            __searchBox.css({
                width: options.searchBoxCss.width,
                height: options.searchBoxCss.height
            })
            var searchFun = function () {
                __searchBox.val($.trim(__searchBox.val()))
                if (__searchBox.val()) {
                    self.__searchContainer.css('opacity', 1).css('display', 'flex')
                    searchBoxWrap.addClass('after-search')
                    __searchBox.autocomplete('dispose')
                    addAutocompleteFunc()
                    self.searchFromGoogle('https://wen.lu/search?q=' + __searchBox.val().replace(/\s/g, '+'))
                    self.searchFromBaidu('http://www.baidu.com/s?wd=' + __searchBox.val())
                }
            }
            var addAutocompleteFunc = function () {
                __searchBox.autocomplete({
                    serviceUrl: 'https://wen.lu/complete/search?client=hp&hl=zh-CN&xhr=t',
                    paramName: 'q',
                    dataType: 'json',
                    transformResult: function(response, originalQuery) {
                        var d = response[1]
                        var lookup = []
                        for (var i = 0, l = d.length; i < l; i++) {
                            lookup.push({
                                value: d[i][0],
                                data: d[i][0]
                            })
                        }
                        return {
                            suggestions: lookup
                        }
                    },
                    deferRequestBy: 50,
                    maxHeight: 310
                })
            }
            __searchBox.keydown(function (e) {
                if (e.keyCode === 13) {
                    searchFun()
                }
            })
            addAutocompleteFunc()
            self.__searchBox = __searchBox
        },

        searchFromGoogle: function (url) {
            var self = this
            self.__searchResultContainer1.css('opacity',.5).text('loading data...')
            self.getDocByUrl(url, function (text) {
                self.__searchResultContainer1.empty().css('opacity', 1)
                var iframe = $('<iframe>', {
                    frameborder: 0
                }).appendTo(self.__searchResultContainer1)
                var iframeWin = iframe[0].contentWindow
                var iframeDoc = iframe[0].contentDocument || iframeWin.document
                iframeDoc.open()
                iframeDoc.write(text)
                iframeDoc.close()
                $('#sfcnt', iframeDoc).parent().remove()
                $('#mngb, #footcnt, #fbar, #top_nav, #rhs', iframeDoc).remove()
                $('html', iframeDoc).css('overflow', 'hidden')
                var links = $('#brs a, #nav a, #trev a', iframeDoc)
                links.click(function () {
                    $(window).scrollTop(0)
                    self.searchFromGoogle('https://wen.lu' + $(this).attr('href'))
                    return false
                })
                $('#hdtb_msb > .hdtb_mitem:first-child, .ab_tnav_wrp, #cnt #center_col, .mw #center_col', iframeDoc).css('margin-left', 0)
                $('#cnt', iframeDoc).css('padding-top', 0)
                var resultLinks = iframeDoc.querySelectorAll('h3 a')
                for(var i = 0, l = resultLinks.length; i < l; i++) {
                    resultLinks[i].removeAttribute('onmousedown')
                    var clonedLink = resultLinks[i].cloneNode(true)
                    clonedLink.target = '_blank'
                    resultLinks[i].parentNode.replaceChild(clonedLink, resultLinks[i])
                }
                iframe.height($(iframeDoc.body).height() + 50)
                $(iframeDoc).click(function () {
                    self.__searchBox.autocomplete('hide')
                })
                $('a', iframeDoc).each(function (idx, a) {
                    a.target = '_blank'
                })
            })
        },

        searchFromBaidu: function (url) {
            var self = this
            self.__searchResultContainer2.css('opacity',.5).text('loading data...')
            self.getDocByUrl(url, function (text) {
                self.__searchResultContainer2.empty().css('opacity', 1)
                var iframe = $('<iframe>', {
                    frameborder: 0
                }).appendTo(self.__searchResultContainer2)
                var iframeWin = iframe[0].contentWindow
                var iframeDoc = iframe[0].contentDocument || iframeWin.document
                iframeDoc.open()
                iframeDoc.write(text)
                iframeDoc.close()
                $('#head, #page .nums, #search, #foot, #u, #content_right', iframeDoc).remove()
                $('html', iframeDoc).css('overflow', 'hidden')
                var links = $('#page a, #rs a, #rs_top a, .hit_top .jc a', iframeDoc)
                links.click(function () {
                    $(window).scrollTop(0)
                    self.searchFromBaidu('http://www.baidu.com' + $(this).attr('href'))
                    return false
                })
                iframe.height($(iframeDoc.body).height() + 50)
                $(iframeDoc).click(function () {
                    self.__searchBox.autocomplete('hide')
                })
                $('a', iframeDoc).each(function (idx, a) {
                    a.target = '_blank'
                    a.protocol = 'http'
                })
            })
        },

        getDocByUrl: function (url, callback) {
            var xhr = new XMLHttpRequest()
            xhr.open('get', url, true)
            xhr.responseType = 'text'
            xhr.onload = function (e) {
                if (e.target.status === 200) {
                    callback(xhr.response)
                }
            }
            xhr.send(null)
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
            }
        }
    }

})(jQuery)