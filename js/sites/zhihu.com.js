//Piggy Reader
//author @huntbao
(function($){
    'use strict';
    jiZhuReader.getPageContent = function(){
        //override
        var titleCon = $('#zh-question-title').clone();
        var questionDetail = $('#zh-question-detail').clone();
        titleCon.find('a').remove();
        questionDetail.find('a.zu-edit-button, .zm-editable-tip').remove();
        var title = titleCon.text();
        var port = chrome.extension.connect({name: 'articlefrompage'});
        port.postMessage({
            content: questionDetail.html() + getContent(),
            title: title,
            url: window.location.href
        });
    }
    function getContent(){
        var commentItems = $('.zm-item-answer'),
        title,
        content,
        htmlStr = '';
        commentItems.each(function(idx, el){
            title = $(el).find('.zm-item-answer-author-wrap').text() 
                + '&nbsp;'+ $(el).find('.zm-item-vote-info').data('votecount') + '&nbsp;票' 
                + '&nbsp;' + $(el).find('.toggle-comment').text();
            var richText = $(el).find('.zm-item-rich-text');
            richText.find('img').attr('src', function(){
                return $(this).data('actualsrc');
            });
            content = richText.html();
            htmlStr += '<p class="jz-stitle">' + (idx + 1) + '#&nbsp;&nbsp;' + title + '</p>' + '<div class="jz-scontent">' + content + '</div>';
        });
        return htmlStr;
    }
})(jQuery);