//Piggy Reader
//author @huntbao
(function ($) {
    'use strict'
    jiZhuReader.getPageContent = function () {
        //override
        var startTime = Date.now()
        var titleCon = $('#zh-question-title').clone()
        var questionDetail = $('#zh-question-detail')
        questionDetail.find('img').each(function () {
            this.src = $(this).data('original') || $(this).data('actualsrc') || this.src
        })
        questionDetail.find('a').each(function (i, link) {
            link.href = link.href
        })
        titleCon.find('a').remove()
        questionDetail.find('a.zu-edit-button, .zm-editable-tip').remove()
        var title = titleCon.text()
        var port = chrome.extension.connect({name: 'articlefrompage'})
        port.postMessage({
            content: questionDetail.html() + getContent(),
            title: title,
            url: window.location.href
        })
        console.log('time: ' + (Date.now() - startTime))
    }
    function getContent() {
        var commentItems = $('.zm-item-answer')
        var title
        var content
        var htmlStr = ''
        commentItems.each(function (idx, el) {
            el = $(el)//.clone(true, true)
            title = el.find('.zm-item-answer-author-info').text()
                + '&nbsp;' + el.find('.zm-item-vote-info').data('votecount') + '&nbsp票'
                + '&nbsp;' + el.find('.answer-date-link').html()
                + '&nbsp;<a href="#" data-aid="' + el.data('aid') + '">' + el.find('.toggle-comment').text() + '</a>'
            var richText = el.find('.zm-item-rich-text')
            richText.find('a').each(function () {
                this.href = this.href
            })
            richText.find('img').each(function () {
                this.src = $(this).data('original') || $(this).data('actualsrc') || this.src
            })
            content = richText.html()
            htmlStr += '' +
                '<p class="jz-stitle jz-zhihu-title">' + (idx + 1) + '#&nbsp;&nbsp;' + title + '</p>' +
                '<div class="jz-scontent">' + content + '</div>'
        })
        return htmlStr
    }
})(Zepto)