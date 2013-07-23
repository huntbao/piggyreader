//Piggy Reader
//author @huntbao
(function($){
    'use strict';
    jiZhuReader.getPageContent = function(){
        //override
        var content = getContent();
        var port = chrome.extension.connect({name:'articlefrompage'});
        port.postMessage({
            content: content || chrome.i18n.getMessage("ClipFailedTip"),
            title: document.title
        });
        
        function getContent(){
            var txtLayer = document.querySelectorAll('.reader-txt-layer');
            var div = $('<div>');
            for(var i = 0, l = txtLayer.length; i < l; i++){
                var imgItem = $(txtLayer[i]).prev().find('.reader-pic-item').clone();
                if(imgItem.length > 0){
                    div.append(imgItem.removeAttr('style').find('img').removeAttr('style'));
                }
                var text = '<p>';
                var ps = $(txtLayer[i]).find('.reader-word-layer');
                var cssTop = ps.eq(0).css('top');
                for(var ii = 0, ll = ps.length; ii < ll; ii++){
                    if($(ps[ii]).css('top') !== cssTop){
                        cssTop = $(ps[ii]).css('top');
                        text += '</p><p>' + $(ps[ii]).text();
                    }else{
                        text += $(ps[ii]).text();
                    }
                }
                text += '</p>';
                div.append(text);
            }
            return div[0].innerHTML;
        }
    }
})(jQuery);