//Piggy Reader
//author @huntbao
(function ($) {
    'use strict';
    var evernoteOAuth = {

        __hostName: 'https://sandbox.evernote.com',

        getOAuthHandler: function (port) {
            var self = this;
            port.onMessage.addListener(function (data) {
                self.getUser(function (user) {
                    self.getNotebook(function (books) {
                        chrome.tabs.sendRequest(port.sender.tab.id, {
                            name: 'got-evernote-oauth',
                            data: {
                                user: user,
                                notebooks: books
                            }
                        });
                    });
                });
            });
        },

        clearOAuthHandler: function (port) {
            var self = this;
            port.onMessage.addListener(function (data) {
                self.__clearOAuth();
                chrome.tabs.sendRequest(port.sender.tab.id, {
                    name: 'cleared-evernote-oauth'
                });
            });
        },

        getOAuth: function (callback) {
            var self = this;
            var options, oauth;
            options = {
                consumerKey: 'huntbao-7034',
                consumerSecret: '797a1474b0a48e20',
                callbackUrl: 'gotOAuth.html',
                signatureMethod: 'HMAC-SHA1'
            };
            oauth = OAuth(options);
            var app = {
                success: function (data) {
                    var getQueryParams = App.modules.util.getQueryParams(data.text);
                    var isCallBackConfirmed = getQueryParams['oauth_callback_confirmed'];
                    var token = getQueryParams['oauth_token'];
                    var oauth_token_secret = getQueryParams['oauth_token_secret'];
                    if (isCallBackConfirmed === 'true') {
                        // step 2
                        var tabLoaded = false;
                        chrome.tabs.create({'url': self.__hostName + '/OAuth.action?oauth_token=' + token}, function (_tab) {
                            chrome.tabs.onUpdated.addListener(function (tabId, info, tab) {
                                if (!tabLoaded && tabId === _tab.id
                                    && info.status === 'complete'
                                    && tab.url.indexOf(self.__hostName + '/Home.action?gotOAuth.html?') >= 0) {
                                    tabLoaded = true;
                                    var str = tab.url.split('?')[2];
                                    var querys = App.modules.util.getQueryParams(str);
                                    var verifier = querys['oauth_verifier'];
                                    // step 3
                                    if (verifier) {
                                        oauth.setVerifier(verifier);
                                        oauth.setAccessToken([token, oauth_token_secret]);
                                        oauth.request({
                                            method: 'GET',
                                            url: self.__hostName + '/oauth',
                                            success: app.success,
                                            failure: app.failure
                                        });
                                    }
                                }
                            });
                        });
                    } else {
                        // Step 4 : Get the final token
                        var querystring = App.modules.util.getQueryParams(data.text);
                        localStorage['authTokenEvernote'] = JSON.stringify(querystring);
                        callback && callback(querystring);
                    }
                },
                failure: function (error) {
                    console.log('error ' + error.text);
                }
            };
            oauth.request({
                method: 'GET',
                url: self.__hostName + '/oauth',
                success: app.success,
                failure: app.failure
            });
        },

        getUser: function (callback) {
            var self = this;
            self.__checkOAuthFunc(function (savedOAuth) {
                var authTokenEvernote = decodeURIComponent(savedOAuth.oauth_token);
                var userStoreTransport = new Thrift.BinaryHttpTransport(self.__hostName + '/edam/user');
                var userStoreProtocol = new Thrift.BinaryProtocol(userStoreTransport);
                var userStore = new UserStoreClient(userStoreProtocol);
                userStore.getUser(authTokenEvernote, function (data) {
                    data.homeUrl = self.__hostName;
                    self.successHandler(data, callback);
                });
            });
        },

        __checkOAuthFunc: function (callback) {
            var self = this;
            var savedOAuth = localStorage['authTokenEvernote'];
            if (savedOAuth) {
                callback(JSON.parse(savedOAuth));
            } else {
                self.getOAuth(callback);
            }
        },

        getNotebook: function (callback) {
            var self = this;
            var noteStore = self.getNoteStore();
            noteStore.listNotebooks(function (data) {
                callback(data);
            });
        },

        saveNoteHandler: function (port) {
            var self = this;
            port.onMessage.addListener(function (data) {
                self.saveNote(data, function (note) {
                    chrome.tabs.sendRequest(port.sender.tab.id, {
                        name: 'saved-evernote',
                        data: note
                    });
                }, function () {
                    chrome.tabs.sendRequest(port.sender.tab.id, {
                        name: 'saved-evernote-failed',
                        data: 'page-is-too-complex'
                    });
                });
            });
        },

        saveNote: function (noteData, callback, failedCallback) {
            var self = this;
            var enml = self.getENML(noteData.content);
            if (!enml) {
                failedCallback();
                return;
            }
            var nBody = '<?xml version="1.0" encoding="UTF-8"?>';
            nBody += '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">';
            nBody += '<en-note>' + self.getENML(noteData.content) + '</en-note>';
            var attributes = new NoteAttributes();
            attributes.sourceURL = noteData.url;
            var note = new Note();
            note.title = noteData.title.trim();
            note.content = nBody.trim();
            note.attributes = attributes;
            note.notebookGuid = noteData.guid;
            var noteStore = self.getNoteStore();
            noteStore.createNote(note, function (data) {
                data.homeUrl = self.__hostName;
                callback(data);
            });
        },

        getNoteStore: function () {
            var self = this;
            var savedOAuth = JSON.parse(localStorage['authTokenEvernote']);
            var authTokenEvernote = decodeURIComponent(savedOAuth.oauth_token);
            var noteStoreURL = decodeURIComponent(savedOAuth.edam_noteStoreUrl);
            var noteStoreTransport = new Thrift.BinaryHttpTransport(noteStoreURL);
            var noteStoreProtocol = new Thrift.BinaryProtocol(noteStoreTransport);
            var noteStore = new NoteStoreClient(noteStoreProtocol);
            return {
                listNotebooks: function (callback) {
                    noteStore.listNotebooks(authTokenEvernote, function (data) {
                        self.successHandler(data, callback);
                    });
                },
                createNote: function (note, callback) {
                    noteStore.createNote(authTokenEvernote, note, function (data) {
                        self.successHandler(data, callback);
                    });
                }
            }
        },

        successHandler: function (data, callback) {
            var self = this;
            if (data.errorCode === 9 && data.parameter === 'authenticationToken') {
                // oauth failed
                localStorage.removeItem('authTokenEvernote');
                self.getOAuth(callback);
            } else {
                callback(data);
            }
        },

        getENML: function (html) {
            var self = this;
            var results = '';
            try {
                HTMLParser(html, {
                    start: function (tag, attrs, unary) {
                        tag = self.getValidTag(tag);
                        if (tag) {
                            results += "<" + tag;
                            if (/^(a|img)$/.test(tag)) {
                                for (var i = 0; i < attrs.length; i++) {
                                    if (/^(href|src)$/.test(attrs[i].name) && self.isENMLProtocol(attrs[i].escaped)) {
                                        results += " " + attrs[i].name + '="' + attrs[i].escaped + '"';
                                    }
                                }
                            }
                            results += (unary ? "/" : "") + ">";
                        }
                    },
                    end: function (tag) {
                        tag = self.getValidTag(tag);
                        if (tag) {
                            results += "</" + tag + ">";
                        }
                    },
                    chars: function (text) {
                        results += text;
                    },
                    comment: function (text) {
                        // results += "<!--" + text + "-->";
                    }
                });
            } catch (e) {
                results = '';
            }
            return results;
        },

        __validTags: /^(a|abbr|acronym|address|area|b|bdo|big|blockquote|br|caption|center|cite|code|col|colgroup|dd|del|dfn|div|dl|dt|em|font|h1|h2|h3|h4|h5|h6|hr|i|img|ins|kbd|li|map|ol|p|pre|q|s|samp|small|span|strike|strong|sub|sup|table|tbody|td|tfoot|th|thead|title|tr|tt|u|ul|var|xmp)$/,

        __blockHtml5Tags: /^(article|aside|details|dialog|summary|figure|footer|header|nav|section)$/,

        __inlineHtml5Tags: /^(bdi|command|mark|meter|progress|ruby|rt|rp|time|wbr)$/,

        getValidTag: function (tag) {
            var self = this;
            if (self.__blockHtml5Tags.test(tag)) {
                tag = 'div';
            } else if (self.__inlineHtml5Tags.test(tag)) {
                tag = 'span';
            }
            if (self.__validTags.test(tag)) {
                return tag;
            }
        },

        isENMLProtocol: function (url) {
            return !url.indexOf('http://') || !url.indexOf('https://') || !url.indexOf('file://');
        },

        __clearOAuth: function (callback) {
            localStorage.removeItem('authTokenEvernote');
            callback && callback();
        }
    }

    App.modules.evernoteOAuth = evernoteOAuth;

})(jQuery);