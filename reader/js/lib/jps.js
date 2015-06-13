/**
 * author: @huntbao
 * description: tiny pub-sub for Zepto
 */
(function ($) {
    'use strict'

    var jps = {

        __topics: {},

        subscribe: function (topic, callback) {
            var self = this
            if (!self.__topics[topic]) {
                self.__topics[topic] = callback
            }
        },

        publish: function (topic) {
            var self = this
            if (self.__topics[topic]) {
                var data = [].slice.call(arguments, 1)
                self.__topics[topic].apply(self, data)
            }
        }
    }

    $.jps = jps

})(Zepto)
