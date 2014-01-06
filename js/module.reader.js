//Piggy Reader
//author @huntbao
(function ($) {
    'use strict';
    var reader = {

        __settings: {},

        __pageInfo: null,

        init: function () {
            var self = this;
            self.currentPageNum = 1;
            self.jzContentWrap = $('#jz-contentwrap');
            self.jzArticle = $('#jz-article');
            self.jzTitle = $('#jz-title');
            self.jzSubtitle = $('#jz-subtitle');
            self.notifyParent();
            self.getPageContent();
            self.initActionBtn();
        },

        getPageContent: function () {
            var self = this;
            parent.postMessage({name: 'getpagecontent'}, '*');
        },

        notifyParent: function () {
            parent.postMessage({name: 'afterinitreader'}, '*');
        },

        sendarticletoreaderHandler: function (data, settings) {
            var self = this;
            if (data.content !== '') {
                var section = $('<div>', {'class': 'jz-addcontent', html: data.content});
                self.jzArticle.find('.jz-loading-tip').remove();
                self.jzArticle.append(section).find('pre, code, xmp').addClass('prettyprint');
                prettyPrint();
            }
            if (data.title !== '') {
                self.jzTitle.html(data.title);
                document.title = data.title;
            }
            if (data.subtitle !== '') {
                self.jzSubtitle.html(data.subtitle);
            }
            $(document.body).css('font-size', settings.fontSize);
            $.jps.publish('init-selectionphrase', {
                container: $('#jz-contentwrap'),
                dictLookup: settings.dictJzpage || 'selection',
                from: 'reader'
            });
            self.__pageInfo = data;
            self.__settings = settings;
        },

        superaddtoreaderHandler: function (data) {
            var self = this;
            if (data.content !== '') {
                self.currentPageNum++;
                var section = $('<div>', {class: 'jz-addcontent'});
                var pageContent = $('<div>', {class: 'jz-pagecontent', html: data.content});
                var pageNum = $('<h6>', {text: chrome.i18n.getMessage('Pagination', [self.currentPageNum]), class: 'jz-pagenum'});
                section.append(pageNum).append(pageContent);
                self.jzArticle.append(section).find('pre, code, xmp').addClass('prettyprint');
                prettyPrint(section[0]);
            }
        },

        initActionBtn: function () {
            var self = this;
            $('#jz-closebtn').click(function () {
                parent.postMessage({name: 'removeiframe'}, '*');
            }).attr('title', chrome.i18n.getMessage("Goback"));
            $('#jz-editbtn').click(function () {
                self.editContent();
            }).attr('title', chrome.i18n.getMessage("Edit"));
            $('#jz-printbtn').click(function () {
                $('#jz-sider').removeClass('hover');
                window.print();
            }).attr('title', chrome.i18n.getMessage("Print"));
            $('#jz-helpbtn').click(function () {
                self.showHelpTip();
                return false;
            }).attr('title', chrome.i18n.getMessage("Help"));
            $('#jz-sider').hover(function () {
                $(this).addClass('hover');
            }, function () {
                if (self.jzContentWrap.attr('contenteditable') === 'true') return;
                $(this).removeClass('hover');
            });
            $('#jz-evernote').click(function () {
                var jzArticle = self.jzArticle.clone();
                jzArticle.find('*[class]').removeAttr('class');
                $.jps.publish('init-evernote-savemodal', {
                    url: self.__pageInfo.url,
                    title: self.__pageInfo.title,
                    content: jzArticle.html()
                });
                return false;
            }).attr('title', chrome.i18n.getMessage("SaveEvernote"));
            $(document).keydown(function (e) {
                if (e.which === 27) {
                    parent.postMessage({name: 'removeiframe'}, '*');
                }
            });
        },

        editContent: function () {
            var self = this;
            if (self.jzContentWrap.attr('contenteditable') === 'true') {
                self.jzContentWrap.attr('contenteditable', 'false').blur();
                $('#jz-editbtn').attr('title', chrome.i18n.getMessage("Edit"));
            } else {
                self.jzContentWrap.attr('contenteditable', 'true').focus();
                $('#jz-editbtn').attr('title', chrome.i18n.getMessage("Save"));
                $('#jz-sider').addClass('hover');
            }
        },

        showHelpTip: function () {
            App.modules.modal.show({
                button: null,
                done: function (okBtn, modalBd, modal) {
                    modalBd.append(chrome.i18n.getMessage('HelpModalTip'));
                }
            });
        },

        lookupPhraseResultHandler: function (data) {
            var self = this;
            $.jps.publish('init-dict-layer', {
                dictData: data.dictData,
                position: data.position,
                hover: self.__settings.dictJzpage === 'hover'
            });
        }
    };

    App.modules.reader = reader;

})(jQuery);