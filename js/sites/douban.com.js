//@huntbao 
//All right reserved
(function($){
    'use strict';
    jiZhuReader.__getPageContent = jiZhuReader.getPageContent;
    jiZhuReader.getPageContent = function(){
        //override
        jiZhuReader.__getPageContent();
        /*jiZhuReader.__removeIframe = jiZhuReader.removeIframe;
        jiZhuReader.removeIframe = function(){
            //override
            jiZhuReader.__removeIframe();
            clearTimeout(jiZhuReader.getSuperAddTimer);
        }*/
        var pageNav = $('#comments .paginator');
        if(pageNav.length === 0){
            getCommentsByContainer($('#comments'), 0);
        }else{
            getComments(0);
        }
    }
    function getComments(startNum){
        $.get(document.location.origin + document.location.pathname + '?start=' + startNum, function(data){
            var div = $('<div>');
            div[0].innerHTML = data;
            var commentDiv = div.find('#comments');
            if(commentDiv.length === 1){
                getCommentsByContainer(commentDiv, startNum);
                console.log('get comments from ' + startNum);
                var nextA = commentDiv.find('.paginator .next').find('a');
                if(nextA.length === 1){
                    jiZhuReader.getSuperAddTimer = setTimeout(function(){
                        getComments(parseInt(commentDiv.find('.paginator .thispage').text())* 100);
                    }, 2000);
                }
            }
        });
    }
    function getCommentsByContainer(container, startNum){
        var commentItems = $('.comment-item', container),
        item,
        title,
        content,
        htmlStr = '';
        commentItems.each(function(idx, el){
            item = $(el).clone();
            title = item.find('.pl').html();
            item.find('.content').remove();
            item.find('.align-right').remove();
            content = item.html();
            htmlStr += '<p class="jz-stitle">' + (startNum + idx + 1) + '#&nbsp;&nbsp;' + title + '</p>' + '<div class="jz-scontent">' + content + '</div>';
        });
        var port = chrome.extension.connect({name : 'appendcontent'});
        port.postMessage({
            content: htmlStr
        });
    }
})(jQuery);