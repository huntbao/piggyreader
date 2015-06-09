/**
 * author: @huntbao
 * description: tiny pub-sub for jQuery
 */
(function ($) {
    var jps = {
        __topics: {},

        subscribe: function (topic, callback) {
            var self = this;
            if (!self.__topics[topic]) {
                self.__topics[topic] = $.Callbacks();
            }
            self.__topics[topic].add(callback);
        },

        unsubscribe: function (topic, callback) {
            var self = this;
            if (self.__topics[topic]) {
                if (!callback) {
                    self.__topics[topic].empty();
                } else {
                    self.__topics[topic].remove(callback);
                }
            }
        },

        publish: function (topic) {
            var self = this;
            if (self.__topics[topic]) {
                var data = [].slice.call(arguments, 1);
                self.__topics[topic].fire.apply(self, data);
            }

        }
    }

    $.jps = jps;

})(jQuery);
