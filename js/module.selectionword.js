//Piggy Reader
//author @huntbao
(function ($) {
    'use strict';
    var selectionWord = {

        init: function () {
            var self = this;
            $(document).mouseup(function (e) {
                self.getSelectedText();
            });
        },

        getSelectedText: function () {
            var self = this;
            var selectedText = document.getSelection().toString();
            selectedText = $.trim(selectedText);
            if (selectedText) {
                var testText = selectedText.toLowerCase().replace(/\s|-/g, '');
                if (/^[a-z]*$/g.test(testText)) {
                    $.jps.publish('lookup-word', selectedText);
                }
            }
        }

    }

    App.selectionWord = selectionWord;

})(jQuery);