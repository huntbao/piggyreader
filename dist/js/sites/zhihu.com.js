!function(t){"use strict";function n(){var n,e,i=t(".zm-item-answer"),a="";return i.each(function(i,o){o=t(o),n=o.find(".zm-item-answer-author-wrap").text()+"&nbsp;"+o.find(".zm-item-vote-info").data("votecount")+"&nbsp票&nbsp;"+o.find(".answer-date-link").html()+'&nbsp;<a href="#" data-aid="'+o.data("aid")+'">'+o.find(".toggle-comment").text()+"</a>";var r=o.find(".zm-item-rich-text");r.find("img").attr("src",function(){return window.location.protocol+t(this).data("actualsrc")}),e=r.html(),a+='<p class="jz-stitle jz-zhihu-title">'+(i+1)+"#&nbsp&nbsp"+n+'</p><div class="jz-scontent">'+e+"</div>"}),a}jiZhuReader.getPageContent=function(){var e=t("#zh-question-title").clone(),i=t("#zh-question-detail").clone();i.find("img").attr("src",function(){return window.location.protocol+t(this).data("original")}),e.find("a").remove(),i.find("a.zu-edit-button, .zm-editable-tip").remove();var a=e.text(),o=chrome.extension.connect({name:"articlefrompage"});o.postMessage({content:i.html()+n(),title:a,url:window.location.href})}}(Zepto);