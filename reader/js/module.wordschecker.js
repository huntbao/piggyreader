//Piggy Reader
//author @huntbao
(function ($) {
  'use strict'
  window.jzWordsChecker = {
    create: function () {
      function isExcluded(el) {
        return /^(style|script|noscript|iframe|object)$/.test(el.tagName.toLowerCase())
      }

      var words = []
      var wordsSet = new Set()

      function walk(el) {
        if (el.nodeType === Node.ELEMENT_NODE || el.nodeType === Node.DOCUMENT_NODE) {
          if (isExcluded(el)) {
            return
          }

          for (var i = 0; i < el.childNodes.length; i++) {
            walk(el.childNodes[i]);
          }
        }

        if (el.nodeType === Node.TEXT_NODE) {
          var englishWords = el.nodeValue.trim().match(/[a-zA-Z]{2,}/g)
          if (englishWords && englishWords.length) {
            // 至少要出现连续2个字母，并分割驼峰
            var tempWords = [];
            englishWords.forEach(function (word) {
              tempWords = tempWords.concat(word.split(/(?=[A-Z])/))
            })
            words = words.concat(tempWords)
          }
        }
      }

      walk(document.body)
      words.forEach(function (word) {
        word = word.trim()
        if (word.length > 1) {
          wordsSet.add(word.toLowerCase())
        }
      })
      var needCheckWords = Array.from(wordsSet).sort()
      if (needCheckWords.length) {
        // 先弹出浮层，告知用户正在查询单词中...
        $.jps.publish('init-dict-checkresult-layer', {
          words: needCheckWords,
          init: true
        })
        setTimeout(function () {
          $.jps.publish('check-words', {
            words: needCheckWords
          })
        }, 1000)
        console.log(needCheckWords)
      }
    }

  }

}(Zepto))