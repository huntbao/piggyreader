//author @huntbao

window.StorageArea = {

    get: function (keys, callback) {
        chrome.storage.local.get(keys, function (result) {
            callback(result)
        })
    },

    set: function (data, callback) {
        chrome.storage.local.set(data, function () {
            callback && callback()
        })
    },

    remove: function (keys, callback) {
        chrome.storage.local.remove(keys, function () {
            callback && callback()
        })
    },

    clear: function (callback) {
        chrome.storage.local.clear(function () {
            callback && callback()
        })
    }

}