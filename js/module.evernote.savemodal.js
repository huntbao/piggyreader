//Piggy Reader
//author @huntbao
(function ($) {
    'use strict';
    var evernoteSaveModal = {

        __noteData: null,

        init: function (noteData) {
            var self = this;
            self.__noteData = noteData;
            App.modules.modal.show({
                title: chrome.i18n.getMessage('SaveEvernote'),
                button: null,
                modalClass: 'jz-save-evernote-modal',
                done: function (okBtn, modalBd, modal) {
                    App.modules.util.initI18n(modalBd);
                    var port = chrome.extension.connect({name: 'get-evernoteoauth'});
                    port.postMessage();
                }
            });
        },

        save: function (data) {
            var self = this;
            App.modules.modal.show({
                title: chrome.i18n.getMessage('SaveEvernote'),
                button: {
                    ok: chrome.i18n.getMessage('Save'),
                    cancel: chrome.i18n.getMessage('Cancel')
                },
                modalClass: 'jz-save-evernote-modal',
                done: function (okBtn, modalBd, modal) {
                    var content = Mustache.to_html(saveModalTpl, data);
                    modalBd.empty().append(content);
                    App.modules.util.initI18n(modalBd);
                    var isSaving = false;
                    okBtn.click(function () {
                        if (isSaving) return false;
                        isSaving = true;
                        modalBd.find('.jz-evernote-saveloading').show();
                        var port = chrome.extension.connect({name: 'save-evernote'});
                        port.postMessage({
                            title: self.__noteData.title,
                            content: self.__noteData.content,
                            url: self.__noteData.url,
                            guid: modalBd.find('.jz-notebook-sel').val()
                        });
                    });
                    modalBd.find('.jz-evernote-clearoauth').click(function (e) {
                        var port = chrome.extension.connect({name: 'clear-evernoteoauth'});
                        port.postMessage();
                        return false;
                    });
                }
            });
        },

        afterClearOAuth: function () {
            var self = this;
            App.modules.modal.show({
                title: chrome.i18n.getMessage('SaveEvernote'),
                button: null,
                modalClass: 'jz-save-evernote-modal',
                done: function (okBtn, modalBd, modal) {
                    var content = Mustache.to_html(reOAuthModalTpl);
                    modalBd.empty().append(content);
                    App.modules.util.initI18n(modalBd);
                    modalBd.find('.jz-evernote-reoauthbtn').click(function () {
                        var port = chrome.extension.connect({name: 'get-evernoteoauth'});
                        port.postMessage();
                    });
                }
            });
        },

        afterSavedNote: function (note) {
            var self = this;
            App.modules.modal.show({
                title: chrome.i18n.getMessage('NoteSavedSuccess'),
                button: null,
                modalClass: 'jz-save-evernote-modal',
                done: function (okBtn, modalBd, modal) {
                    var content = Mustache.to_html(noteSavedSuccessTpl, note);
                    modalBd.empty().append(content);
                    App.modules.util.initI18n(modalBd);
                }
            });
        },

        saveNoteFailed: function () {
            var self = this;
            App.modules.modal.show({
                title: chrome.i18n.getMessage('SaveEvernote'),
                button: null,
                modalClass: 'jz-save-evernote-modal',
                done: function (okBtn, modalBd, modal) {
                    var content = Mustache.to_html(noteSavedFailedTpl);
                    modalBd.empty().append(content);
                    App.modules.util.initI18n(modalBd);
                }
            });
        }

    };

    var saveModalTpl = '' +
        '<div class="jz-mod-save-evernote">' +
        '   <div class="jz-evernote-user">' +
        '       <a href="{{user.homeUrl}}" target="_blank">{{user.username}}</a>' +
        '       (<span class="jz-evernote-clearoauth i18n" data-i18n="ClearSavedOAuth"></span>)' +
        '   </div>' +
        '   <div class="clr jz-line">' +
        '       <div class="jz-line-l i18n" data-i18n="ChooseNotebook">ChooseNotebook</div>' +
        '       <select class="jz-line-r jz-notebook-sel">' +
        '           {{#notebooks}}' +
        '           <option value="{{guid}}">{{name}}</option>' +
        '           {{/notebooks}}' +
        '       </select>' +
        '       <div class="jz-evernote-saveloading i18n" data-i18n="SavingTip"></div>' +
        '   </div>' +
        '</div>';

    var reOAuthModalTpl = '' +
        '<div class="jz-evernote-reoauth">' +
        '   <button class="jz-evernote-reoauthbtn i18n" data-i18n="ReOAuth"></button>' +
        '</div>';

    var noteSavedSuccessTpl = '' +
        '<div class="jz-evernote-savednote">' +
        '   <a class="jz-evernote-savednote-viewlink i18n" data-i18n="ViewNoteLink" href="{{homeUrl}}" target="_blank"></a>' +
        '</div>';

    var noteSavedFailedTpl = '' +
        '<div class="jz-evernote-savednote">' +
        '   <span class="jz-evernote-savednote-failed i18n" data-i18n="SaveNoteFailed"></span>' +
        '</div>';

    App.modules.evernoteSaveModal = evernoteSaveModal;
    
})(jQuery);