//Piggy Reader
//author @huntbao
(function ($) {
    'use strict';
    var modal = {

        __container: null,

        __backdrop: null,

        __options: null,

        show: function (options) {
            var self = this;
            self.__options = options;
            self.__backdrop = $('<div>', {
                class: 'jz-modal-backdrop'
            }).appendTo(document.body);
            self.__container = $(modalTpl);
            self.__container.find('h3').append(self.__options.title || chrome.i18n.getMessage('ExtensionName'));
            self.__container.appendTo(document.body);
            $(document.body).on('click.closemodal', function (e) {
                if (self.__container.has(e.target).length === 0) {
                    self.close();
                    return false;
                }
                return true;
            });
            self.__container.find('.close').click(function (e) {
                self.close();
                return false;
            });
            if (self.__options.modalClass) {
                self.__container.addClass(self.__options.modalClass);
            }
            var okBtn = self.__container.find('.jz-okbtn');
            var cancelBtn = self.__container.find('.jz-cancelbtn');
            if (self.__options.button === null) {
                self.__container.find('.jz-modal-ft').hide();
            } else if ($.isPlainObject(self.__options.button)) {
                if (self.__options.button.ok) {
                    okBtn.text(self.__options.button.ok);
                } else {
                    okBtn.hide();
                }
                if (self.__options.button.cancel) {
                    cancelBtn.text(self.__options.button.cancel);
                    cancelBtn.click(function () {
                        self.close();
                    });
                } else {
                    cancelBtn.hide();
                }
            }
            options.done(okBtn, self.__container.find('.jz-modal-bd'), self.__container);
        },

        close: function () {
            var self = this;
            $(document.body).off('click.closemodal');
            self.__container.fadeOut(function () {
                self.__container.remove();
                self.__backdrop.remove();
                self.__container = null;
            });
        }
    };

    var modalTpl = '' +
        '<div class="jz-modal">' +
        '   <div class="jz-modal-hd">' +
        '       <button type="button" class="close">×</button>' +
        '       <h3></h3>' +
        '   </div>' +
        '   <div class="jz-modal-bd"></div>' +
        '   <div class="jz-modal-ft">' +
        '       <button class="jz-okbtn"></button>' +
        '       <button class="jz-cancelbtn"></button>' +
        '   </div>' +
        '</div>';

    App.modules.modal = modal;

})(jQuery);