//Piggy Reader
//author @huntbao
(function ($) {
    'use strict';

    var selectionPhrase = {

        __mousemoveTimer: null,

        __prevPointedContainer: null,

        __prevPointedAnchorOffset: null,

        __prevPointedFocusOffset: null,

        init: function (container) {
            var self = this;
            container = container || $(document);
            $(container).mouseup(function (e) {
                setTimeout(function () {
                    self.getSelectedPhrase({
                        left: e.pageX,
                        top: e.pageY,
                        clientX: e.clientX,
                        clientY: e.clientY
                    });
                }, 0);
            });
            container.mousemove(function (e) {
                e.stopPropagation();
                clearTimeout(self.__mousemoveTimer);
                self.__mousemoveTimer = setTimeout(function () {
                    self.getPointedPhrase({
                        left: e.pageX,
                        top: e.pageY,
                        clientX: e.clientX,
                        clientY: e.clientY
                    });
                }, 300);
            });
            $(container).mouseleave(function (e) {
                clearTimeout(self.__mousemoveTimer);
                $.jps.publish('hide-dict-layer');
                var sel = window.getSelection();
                sel.removeAllRanges();
            });
        },

        getSelectedPhrase: function (position, isSamePhraseWithPrevious) {
            var self = this;
            var sel = document.getSelection();
            var selectedPhrase = sel.toString();
            selectedPhrase = $.trim(selectedPhrase);
            if (selectedPhrase) {
                var testPhrase = selectedPhrase.toLowerCase().replace(/\s|-|’/g, '');
                if (/^[a-z]*$/g.test(testPhrase)) {
                    $.jps.publish('lookup-phrase', {
                        phrase: selectedPhrase,
                        position: self.getSeletionPosition(sel, position),
                        isSamePhraseWithPrevious: isSamePhraseWithPrevious
                    });
                }
            }
        },

        getSeletionPosition: function (sel, position) {
            if (sel.rangeCount) {
                var range = sel.getRangeAt(0).cloneRange();
                if (range.getBoundingClientRect) {
                    var rect = range.getBoundingClientRect();
                    position.left = (rect.right + rect.left) / 2;
                    position.top = position.top + rect.height - 12;
                }
            }
            return position;
        },

        getPointedPhrase: function (position) {
            var self = this;
            var isAlpha = function (str) {
                str = str.toLowerCase().replace(/-|’/g, '');
                return /^[a-z]*$/g.test(str)
            };
            var range = document.caretRangeFromPoint(position.clientX, position.clientY);
            if (!range) return true;
            var so = range.startOffset;
            var eo = range.endOffset;
            var cRange = range.cloneRange();
            var phrase = '';
            if (range.startContainer.data) {
                while (so >= 1) {
                    cRange.setStart(range.startContainer, --so);
                    phrase = cRange.toString();
                    if (!isAlpha(phrase.charAt(0))) {
                        cRange.setStart(range.startContainer, so + 1);
                        break;
                    }
                }
            }
            if (range.endContainer.data) {
                while (eo < range.endContainer.data.length) {
                    cRange.setEnd(range.endContainer, ++eo);
                    phrase = cRange.toString();
                    if (!isAlpha(phrase.charAt(phrase.length - 1))) {
                        cRange.setEnd(range.endContainer, eo - 1);
                        break;
                    }
                }
            }
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(cRange);
            if (!self.__prevPointedContainer) {
                self.__prevPointedContainer = range.startContainer;
            }
            var isSamePhraseWithPrevious = self.__prevPointedContainer === range.startContainer
                && self.__prevPointedFocusOffset === sel.focusOffset
                && self.__prevPointedAnchorOffset === sel.anchorOffset;
            self.__prevPointedContainer = range.startContainer;
            self.__prevPointedFocusOffset = sel.focusOffset;
            self.__prevPointedAnchorOffset = sel.anchorOffset;
            self.getSelectedPhrase(position, isSamePhraseWithPrevious);
        }

    };

    App.modules.selectionPhrase = selectionPhrase;

})(jQuery);