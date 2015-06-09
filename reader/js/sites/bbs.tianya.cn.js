//Piggy Reader
//author @huntbao
(function ($) {
    'use strict'
    var itemNum = 1
    jiZhuReaderGetPageContent.findNextLink = function (doc) {
        var nextA = $('#post_head .atl-pages strong', doc).next('a').clone()
        if (nextA.length === 1) {
            console.log('found Link: ' + nextA[0].href)
            return nextA[0].href
        }
        return false
    }
    jiZhuReader.getPageContent = function (doc, url) {
        //override
        doc = doc || document
        url = url || window.location.href
        var title = $('#post_head .s_title', doc).text()
        var port = chrome.extension.connect({name: 'articlefrompage'})
        port.postMessage({
            content: getContent(doc),
            title: title,
            url: url
        })
        jiZhuReaderGetPageContent.getContentTimer = setTimeout(function () {
            findNextPageContent(doc)
        }, 5000)
    }
    function getContent(doc) {
        var commentItems = $('.atl-item', doc)
        var title
        var content
        var htmlStr = ''
        commentItems.each(function (idx, el) {
            if (itemNum === 1) {
                title = $('#post_head', doc).find('.atl-info').html()
            } else {
                title = $(el).find('.atl-info').html()
            }
            var richText = $(el).find('.bbs-content')
            richText.find('img').attr('src', function () {
                return this.getAttribute('original')
            })
            content = richText.html()
            htmlStr += '<p class="jz-stitle">' + (itemNum++) + '#&nbsp&nbsp' + title + '</p>' + '<div class="jz-scontent">' + content + '</div>'
        })
        return htmlStr
    }

    function findNextPageContent(doc) {
        var nextLinkHref = jiZhuReaderGetPageContent.findNextLink(doc)
        if (nextLinkHref) {
            jiZhuReaderGetPageContent.getDocByUrl(nextLinkHref, function (doc) {
                jiZhuReader.getPageContent(doc, nextLinkHref)
            })
        }
    }
})(jQuery)