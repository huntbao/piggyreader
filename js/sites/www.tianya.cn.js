//@huntbao 
//All right reserved
(function($){
    'use strict';
    var totalPosts = 0,
    postAuthorName;
    jiZhuReader.getPageContent = function(){
        var port = chrome.extension.connect({name:'articlefrompage'});
        port.postMessage({
            content: '',
            title: $('#hTitle').text().trim()
        });
        var pageDivTop = $('#pageDivTop');
        if(pageDivTop.length  === 1){
            var currentPageNum = pageDivTop.find('.current');
            if(currentPageNum.text() === '1'){
                postAuthorName = $('#firstAuthor').find('.lnkChanged').text().trim();
                getPostsByPage($(document));
            }else{
                var firstPageUrl = pageDivTop.find('a').eq(0).attr('href');
                getPageByUrl(firstPageUrl, function(page){
                    postAuthorName = page.find('#firstAuthor').find('.lnkChanged').text().trim();
                    getPostsByPage(page);
                });
            }
        }else{
            postAuthorName = $('#firstAuthor').find('.lnkChanged').text().trim();
            getPostsByPage($(document));
        }
    }
    function getPostsByPage(page){
        var posts = page.find('.post'),
        cloneEl,
        titltInfo,
        htmlStr = '';
        posts.each(function(idx, el){
            el = $(el);
            //get title
            totalPosts++;
            if(el.prev().is('table')){
                titltInfo = getTitleInfo(el.prev());
            }else{
                //get firstAuthor
                titltInfo = getTitleInfo(page.find('#firstAuthor'));
            }
            htmlStr += '<div class="jz-swrap';
            if(titltInfo.isPostAuthor){
                htmlStr += ' jz-author">';
            }else{
                htmlStr += '">';
            }
            htmlStr += '<p class="jz-stitle">' + totalPosts + '#&nbsp;&nbsp;' + titltInfo.content + '</p>';
            //get content
            cloneEl = $(el).clone();
            cloneEl.find('a[href="http://m.tianya.cn/web/"]').remove();
            cloneEl.find('.post-jb, .fromwap').remove();
            htmlStr += '<div class="jz-scontent">' + cloneEl.html() + '</div></div>'
        });
        var port = chrome.extension.connect({name : 'appendcontent'});
        port.postMessage({
            content: htmlStr
        });
    }
    function getTitleInfo(table){
        var author = table.find('a').eq(0),
        isPostAuthor = false;
        if(author.text().trim() === postAuthorName){
            //is post author
            isPostAuthor = true;
        }
        var cloneAuthor = author.parent().clone();
        cloneAuthor.find('span').remove();
        return{
            isPostAuthor: isPostAuthor,
            content: cloneAuthor.html()
        }
    }
    function getPageByUrl(url, callback){
        $.get(url, function(pageHtml){
            var div = $('<div>');
            div[0].innerHTML = pageHtml;
            callback(div);
        });
    }
    function getNextPageUrl(pageNav){
        var nextA = pageNav.find('.current').next();
        if(nextA.length === 1){
            return nextA.attr('href');
        }
        return false;
    }
})(jQuery);