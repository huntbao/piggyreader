﻿//Piggy Reader
//author @huntbao
(function ($) {
    'use strict'
    jiZhuReader.getPageContent = function () {
        //override
        var titleCon = $('#zh-question-title').clone()
        var questionDetail = $('#zh-question-detail').clone()
        questionDetail.find('img').attr('src', function () {
            var imgSrc = $(this).data('original')
            if (imgSrc.startsWith('//')) {
                return window.location.protocol + imgSrc
            } else {
                return imgSrc
            }
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
    }
    function getContent() {
        var commentItems = $('.zm-item-answer')
        var title
        var content
        var htmlStr = ''
        commentItems.each(function (idx, el) {
            el = $(el).clone(true, true)
            title = el.find('.zm-item-answer-author-wrap').text()
                + '&nbsp;' + el.find('.zm-item-vote-info').data('votecount') + '&nbsp票'
                + '&nbsp;' + el.find('.answer-date-link').html()
                + '&nbsp;<a href="#" data-aid="' + el.data('aid') + '">' + el.find('.toggle-comment').text() + '</a>'
            var richText = el.find('.zm-item-rich-text')
            richText.find('img').attr('src', function () {
                var imgSrc = $(this).data('actualsrc')
                if (imgSrc.startsWith('//')) {
                    return window.location.protocol + imgSrc
                } else {
                    return imgSrc
                }
            })
            content = richText.html()
            htmlStr += '<p class="jz-stitle jz-zhihu-title">' + (idx + 1) + '#&nbsp&nbsp' + title + '</p><div class="jz-scontent">' + content + '</div>'
        })
        return htmlStr
    }
})(Zepto)