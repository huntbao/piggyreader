﻿//Piggy Reader
//author @huntbao
(function ($) {
  'use strict'

  var selectionPhrase = {

    __mousemoveTimer: null,

    __getSelectedPhraseTimer: null,

    __prevPointedContainer: null,

    __prevPointedAnchorOffset: null,

    __prevPointedFocusOffset: null,

    __options: null,

    init: function (options) {
      var self = this
      self.__options = options
      var container = options.container || $(document)
      container.keydown(function () {
        $.jps.publish('hide-dict-layer')
      })
      if (self.__options.dictLookup === 'selection') {
        $(container).mouseup(function (e) {
          if ($(e.target).is('input, textarea')) return
          setTimeout(function () {
            self.getSelectedPhrase()
          }, 0)
        })
      }
      if (self.__options.dictLookup === 'hover') {
        container.mousemove(function (e) {
          e.stopPropagation()
          clearTimeout(self.__mousemoveTimer)
          self.__mousemoveTimer = setTimeout(function () {
            self.getPointedPhrase(e)
          }, 300)
        })
        $(container).mouseleave(function (e) {
          self.__hideDictLayer()
        })
      }
    },

    __hideDictLayer: function () {
      var self = this
      clearTimeout(self.__mousemoveTimer)
      $.jps.publish('hide-dict-layer')
      var sel = window.getSelection()
      sel.removeAllRanges()
    },

    getSelectedPhrase: function (isSamePhraseWithPrevious) {
      var self = this
      clearTimeout(self.__getSelectedPhraseTimer)
      self.__getSelectedPhraseTimer = setTimeout(function () {
        var sel = document.getSelection()
        var selectedPhrase = sel.toString().trim()
        if (selectedPhrase) {
          var testPhrase = selectedPhrase.toLowerCase().replace(/\s|-|’/g, '')
          if (/^[a-z]+$/g.test(testPhrase)) {
            $.jps.publish('lookup-phrase', {
              phrase: selectedPhrase,
              position: self.getSeletionPosition(sel),
              isSamePhraseWithPrevious: isSamePhraseWithPrevious,
              from: self.__options.from
            })
          }
        } else {
          $.jps.publish('hide-dict-layer')
        }
      }, 230)
    },

    getSeletionPosition: function (sel) {
      var boundingClientRect = {left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0}
      var r = sel.getRangeAt(0)
      if (!r.collapsed) {
        boundingClientRect = r.getBoundingClientRect()
      }
      return boundingClientRect
    },

    getPointedPhrase: function (evt) {
      var self = this
      var isAlpha = function (str) {
        str = str.toLowerCase().replace(/-|’/g, '')
        return /^[a-z]*$/g.test(str)
      }
      var range = document.caretRangeFromPoint(evt.clientX, evt.clientY)
      if (!range) return true
      var so = range.startOffset
      var eo = range.endOffset
      var cRange = range.cloneRange()
      var phrase = ''
      if (range.startContainer.data) {
        while (so >= 1) {
          cRange.setStart(range.startContainer, --so)
          phrase = cRange.toString()
          if (!isAlpha(phrase.charAt(0))) {
            cRange.setStart(range.startContainer, so + 1)
            break
          }
        }
      }
      if (range.endContainer.data) {
        while (eo < range.endContainer.data.length) {
          cRange.setEnd(range.endContainer, ++eo)
          phrase = cRange.toString()
          if (!isAlpha(phrase.charAt(phrase.length - 1))) {
            cRange.setEnd(range.endContainer, eo - 1)
            break
          }
        }
      }
      var sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(cRange)
      if (!self.__prevPointedContainer) {
        self.__prevPointedContainer = range.startContainer
      }
      var isSamePhraseWithPrevious = self.__prevPointedContainer === range.startContainer
        && self.__prevPointedFocusOffset === sel.focusOffset
        && self.__prevPointedAnchorOffset === sel.anchorOffset
      self.__prevPointedContainer = range.startContainer
      self.__prevPointedFocusOffset = sel.focusOffset
      self.__prevPointedAnchorOffset = sel.anchorOffset
      self.getSelectedPhrase(isSamePhraseWithPrevious)
    },

    getSelectedTextBounding: function (input, start, end) {
      var taBoundRect = input.getBoundingClientRect()
      var div = $('<div>').html(input.value.replace(/\n/g, '<br />')).appendTo(document.body)
      div[0].style.cssText = document.defaultView.getComputedStyle(input, null).cssText
      div.css({
        position: 'absolute',
        left: taBoundRect.left,
        top: taBoundRect.top,
        margin: 0,
        overflow: 'hidden'
      })
      div[0].scrollLeft = input.scrollLeft
      div[0].scrollTop = input.scrollTop
      var range = setSelectionRange(div[0], start, end)
      var textBounding = range.getBoundingClientRect()
      div.remove()
      return textBounding

      function getTextNodesIn(node) {
        var textNodes = []
        if (node.nodeType == 3) {
          textNodes.push(node)
        } else {
          var children = node.childNodes
          for (var i = 0, len = children.length; i < len; ++i) {
            textNodes.push.apply(textNodes, getTextNodesIn(children[i]))
          }
        }
        return textNodes
      }

      function setSelectionRange(el, start, end) {
        var range = document.createRange()
        range.selectNodeContents(el)
        var textNodes = getTextNodesIn(el)
        var foundStart = false
        var charCount = 0, endCharCount

        for (var i = 0, textNode; textNode = textNodes[i++];) {
          endCharCount = charCount + textNode.length
          if (!foundStart && start >= charCount && (start < endCharCount || (start == endCharCount && i < textNodes.length))) {
            range.setStart(textNode, start - charCount)
            foundStart = true
          }
          if (foundStart && end <= endCharCount) {
            range.setEnd(textNode, end - charCount)
            break
          }
          charCount = endCharCount
        }

        var sel = window.getSelection()
        sel.removeAllRanges()
        sel.addRange(range)
        return range
      }
    }
  }

  App.modules.selectionPhrase = selectionPhrase

})(Zepto)