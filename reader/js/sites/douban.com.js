//Piggy Reader
//author @huntbao
(function ($) {
  'use strict'
  jiZhuReader.getPageContent = function () {
    //override
    var title = document.querySelector('*[property="v:summary"]'),
      content = document.querySelector('*[property="v:description"]'),
      viewer = document.querySelector('*[property="v:reviewer"]'),
      port = chrome.extension.connect({name: 'articlefrompage'})
    port.postMessage({
      content: content && content.innerHTML,
      title: title && title.innerHTML || document.title,
      subtitle: getSubtitle(viewer)
    })
    var pageNav = $('#comments .paginator')
    if (pageNav.length === 0) {
      getCommentsByContainer(document.body, 0)
    } else {
      getComments(0)
    }
  }
  function getComments(startNum) {
    $.get(document.location.origin + document.location.pathname + '?start=' + startNum, function (data) {
      var div = $('<div>')
      div[0].innerHTML = data
      var commentDiv = div.find('#comments')
      if (commentDiv.length === 1) {
        getCommentsByContainer(commentDiv, startNum)
        var nextA = commentDiv.find('.paginator .next').find('a')
        if (nextA.length === 1) {
          var currentPage = parseInt(commentDiv.find('.paginator .thispage').text())
          if (currentPage) {
            jiZhuReader.getSuperAddTimer = setTimeout(function () {
              getComments(currentPage * 100)
            }, currentPage * 2000)
          }
        }
      }
    })
  }

  function getCommentsByContainer(container, startNum) {
    var commentItems = $('.comment-item', container),
      title,
      content,
      htmlStr = ''
    commentItems.each(function (idx, el) {
      title = $(el).find('.author, .hd').html()
      content = $(el).find('p').html()
      htmlStr += '<p class="jz-stitle">' + (startNum + idx + 1) + '#&nbsp&nbsp' + title + '</p>' + '<div class="jz-scontent">' + content + '</div>'
    })
    var port = chrome.extension.connect({name: 'appendcontent'})
    port.postMessage({
      content: htmlStr
    })
  }

  function getSubtitle(viewer) {
    viewer = $(viewer)
    viewer.parent().addClass('author').removeAttr('onclick')
    var viewDate = document.querySelector('span[property="v:dtreviewed"]')
    return viewDate.outerHTML + viewer.parent()[0].outerHTML
  }
})(Zepto)