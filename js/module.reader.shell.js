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

    $(function () {
        $.jps.publish('init-reader')
        $.jps.publish('init-search')
    })

}(jQuery))