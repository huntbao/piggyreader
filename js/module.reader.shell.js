//Piggy Reader
//author @huntbao
(function ($) {
    'use strict'
    $.jps.subscribe('init-reader', function () {
        App.modules.reader.init()
    })

    $.jps.subscribe('init-search', function () {
        App.modules.search.init()
    })

    $.jps.subscribe('set-reader-content', function (content) {
        App.modules.reader.setContent(content)
    })

    $(function () {
        $.jps.publish('init-reader')
        $.jps.publish('init-search')
    })

}(jQuery))