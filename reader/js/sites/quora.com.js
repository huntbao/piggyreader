//Piggy Reader
//author @huntbao
(function ($) {
    'use strict'
    jiZhuReader.getPageContent = function () {
        //override
        var titleCon = $('h1:not(.header_logo)').clone()
        var questionDetail = $('.question_details .QuestionDetailsInlineEditor').eq(0).clone()
        questionDetail.find('a, .hidden').remove()
        titleCon.find('a').remove()
        var title = titleCon.text()
        var port = chrome.extension.connect({name: 'articlefrompage'})
        port.postMessage({
            content: questionDetail.html() + getContent(),
            title: title,
            url: window.location.href
        })
    }
    function getContent() {
        var commentItems = $('.QuestionMain .pagedlist_item')
        var title
        var content
        var htmlStr = ''
        commentItems.each(function (idx, el) {
            var ele = $(el).find('.feed_item_answer_user').clone()
            ele.find('.hidden, a:not(.user)').remove()
            title = ele.text()
            if (title.length) {
                var richText = $(el).find('.inline_editor_value')
                content = richText.html()
                htmlStr += '<p class="jz-stitle">' + (idx + 1) + '#&nbsp;&nbsp;' + title + '</p>' + '<div class="jz-scontent">' + content + '</div>'
            }
        })
        return htmlStr
    }
})(Zepto)