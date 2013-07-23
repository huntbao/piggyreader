//Piggy Reader
//author @huntbao
(function($){
    'use strict';
    window.jiZhuReader = {
        init: function(){
            var self = this;
            self.currentPageNum = 1;
            self.jzContentWrap = $('#jz-contentwrap');
            self.jzArticle = $('#jz-article');
            self.jzTitle = $('#jz-title');
            self.jzSubtitle = $('#jz-subtitle');
            self.notifyParent();
            self.getPageContent();
            self.initExtensionRequest();
            self.initActionBtn();
        },
        getPageContent: function(){
            var self = this;
            parent.postMessage({name: 'getpagecontent'}, '*');
        },
        notifyParent: function(){
            parent.postMessage({name: 'afterinitreader'}, '*');
        },
        initExtensionRequest: function(){
            var self = this;
            chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
                if(!sender || sender.id !== chrome.i18n.getMessage("@@extension_id")) return;
                switch(request.name){
                    case 'sendarticletoreader':
                        self.sendarticletoreaderHandler(request.data, request.settings);
                        break;
                    case 'superaddtoreader':
                        self.superaddtoreaderHandler(request.data);
                    default:
                        break;
                }
            });
        },
        sendarticletoreaderHandler: function(data, settings){
            var self = this;
            if(data.content !== ''){
                var section = $('<section>', {'class': 'jz-addcontent', html: data.content});
                self.jzArticle.append(section).find('pre, code, xmp').addClass('prettyprint');
                prettyPrint();
            }
            if(data.title !== ''){
                self.jzTitle.html(data.title);
                document.title = data.title;
            }
            if(data.subtitle !== ''){
                self.jzSubtitle.html(data.subtitle);
            }
            $(document.body).css('font-size', settings.fontSize);
        },
        superaddtoreaderHandler: function(data){
            var self = this;
            if(data.content !== ''){
                self.currentPageNum++;
                var section = $('<section>', {class: 'jz-addcontent'}),
                pageContent = $('<div>', {class: 'jz-pagecontent', html: data.content}),
                pageNum = $('<h6>', {text: chrome.i18n.getMessage('Pagination', [self.currentPageNum]), class: 'jz-pagenum'});
                section.append(pageNum).append(pageContent);
                self.jzArticle.append(section).find('pre, code, xmp').addClass('prettyprint');
                prettyPrint(section[0]);
            }
        },
        initActionBtn: function(){
            var self = this;
            $('#jz-closebtn').click(function(){
                parent.postMessage({name: 'removeiframe'}, '*');
            }).attr('title', chrome.i18n.getMessage("Goback"));
            $('#jz-editbtn').click(function(){
                self.editContent();
            }).attr('title', chrome.i18n.getMessage("Edit"));
            $('#jz-printbtn').click(function(){
                window.print();
            }).attr('title', chrome.i18n.getMessage("Print"));
            $('#jz-helpbtn').click(function(){
                self.showHelpTip();
                return false;
            }).attr('title', chrome.i18n.getMessage("Help"));
            $(document).keydown(function(e){
                if(e.which === 27){
                    parent.postMessage({name: 'removeiframe'}, '*');
                }
            });
        },
        editContent: function(){
            var self = this;
            if(self.jzContentWrap.attr('contenteditable') === 'true'){
                self.jzContentWrap.attr('contenteditable', 'false').blur();
                $('#jz-editbtn').attr('title', chrome.i18n.getMessage("Edit"));
            }else{
                self.jzContentWrap.attr('contenteditable', 'true').focus();
                $('#jz-editbtn').attr('title', chrome.i18n.getMessage("Save"));
            }
        },
        showHelpTip: function(){
            var self = this;
            var modalBackdrop = $('<div>', {
                class: 'jz-modal-backdrop'
            }).appendTo(document.body);
            var modalTpl =
                '<div class="jz-modal jz-help-modal">' +
                '   <div class="jz-modal-hd">' +
                '       <button type="button" class="close">×</button>' +
                '       <h3></h3>' +
                '   </div>' +
                '   <div class="jz-modal-bd"></div>' +
                '</div>';
            var modal = $(modalTpl);
            modal.find('h3').text(chrome.i18n.getMessage('HelpModalTitle'));
            modal.find('.jz-modal-bd').html(chrome.i18n.getMessage('HelpModalTip'));
            modal.appendTo(document.body);
            var closeModal = function(){
                $(document.body).off('click.closemodal');
                modal.fadeOut(function(){
                    modal.remove();
                    modalBackdrop.remove();
                });
            }
            $(document.body).on('click.closemodal', function(e){
                if(modal.has(e.target).length === 0){
                    closeModal();
                    return false;
                }
                return true;
            });
            modal.find('.close').click(function(e){
                closeModal();
                return false;
            });
        }
    }
    $(function(){
        window.jiZhuReader.init();
    });
})(jQuery);