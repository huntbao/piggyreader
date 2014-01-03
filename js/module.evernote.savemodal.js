//Piggy Reader
//author @huntbao
(function ($) {
    'use strict';
    var evernoteSaveModal = {

        __noteData: null,

        init: function (noteData) {
            var self = this;
            self.__noteData = noteData;
            var port = chrome.extension.connect({name: 'get-evernoteoauth'});
            port.postMessage();
        },

        save: function (data) {
            var self = this;
            App.modules.modal.show({
                title: chrome.i18n.getMessage('Savenote'),
                button: {
                    ok: chrome.i18n.getMessage('Save'),
                    cancel: chrome.i18n.getMessage('Cancel')
                },
                modalClass: 'jz-save-evernote-modal',
                done: function (okBtn, modalBd, modal) {
                    var content = Mustache.to_html(saveModalTpl, data);
                    modalBd.append(content);
                    App.modules.util.initI18n(modalBd);
                    okBtn.click(function () {
                        var port = chrome.extension.connect({name: 'save-evernote'});
                        port.postMessage({
                            title: self.__noteData.title,
                            content: self.__noteData.content,
                            url: self.__noteData.url,
                            guid: modalBd.find('.jz-notebook-sel').val()
                        });
                    });
                }
            });
        }

    };

    var saveModalTpl = '' +
        '<div class="jz-mod-save-evernote">' +
        '   <div class="clr jz-line">' +
        '       <div class="jz-line-l i18n" data-i18n="ChooseNotebook">ChooseNotebook</div>' +
        '       <select class="jz-line-r jz-notebook-sel">' +
        '           {{#notebooks}}' +
        '           <option value="{{guid}}">{{name}}</option>' +
        '           {{/notebooks}}' +
        '       </select>' +
        '   </div>' +
        '</div>';

    App.modules.evernoteSaveModal = evernoteSaveModal;
    
})(jQuery);