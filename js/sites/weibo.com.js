//@huntbao 
//All right reserved
(function($){
    'use strict';
    $.get('http://weibo.com/aj/mblog/fsearch?page=1&count=100', function(data){
        var msgs = $(data.data).children();
        msgs.each(function(idx, el){
            console.log($(el).text().trim())
        });
    });
})(jQuery);