//Piggy Reader
//author @huntbao
(function (undefined) {
    'use strict'
    var jiZhuReaderOptions = {}
    var getOption = function (key, defaultValue) {
        var options = JSON.parse(window.localStorage[jiZhuReaderOptions.localstoragekey] || '{}')
        if (options[key] === undefined) {
            return defaultValue
        } else {
            return options[key]
        }
    }
    var setOption = function (key, value) {
        var options = JSON.parse(window.localStorage[jiZhuReaderOptions.localstoragekey] || '{}')
        options[key] = value
        window.localStorage[jiZhuReaderOptions.localstoragekey] = JSON.stringify(options)
    }
    Object.defineProperty(jiZhuReaderOptions, 'localstoragekey', {
        value: '__JiZhuReaderOptions__',
        writable: false
    })
    Object.defineProperties(jiZhuReaderOptions, {
        dictHostpage: {
            get: function () {
                return getOption('dictHostpage', '')
            },
            set: function (value) {
                setOption('dictHostpage', value)
            }
        },
        dictJzpage: {
            get: function () {
                return getOption('dictJzpage', '')
            },
            set: function (value) {
                setOption('dictJzpage', value)
            }
        }
    })
    window.jiZhuReaderOptions = jiZhuReaderOptions
})()