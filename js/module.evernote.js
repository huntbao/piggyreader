//Piggy Reader
//author @huntbao
(function ($) {
    'use strict';
    var evernote = {

        __hostName: 'https://sandbox.evernote.com',

        getOAuth: function () {
            var self = this;
            if (localStorage['authTokenEvernote']) {
                //self.getNotebook();
                //self.getUser();
                self.createNote({
                    title: 'aaa',
                    content: 'bbb',
                    sourceURL: 'http://www.baidu.com'
                });
                return;
            }
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
                                if (!tabLoaded && tabId === _tab.id) {
                                    if (info.status === 'complete') {
                                        if (tab.url.indexOf(hostName + '/Home.action?gotOAuth.html?') >= 0) {
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
                                                    url: hostName + '/oauth',
                                                    success: app.success,
                                                    failure: app.failure
                                                });
                                            }
                                        }
                                    }
                                }
                            });
                        });
                    } else {
                        // Step 4 : Get the final token
                        var querystring = App.modules.util.getQueryParams(data.text);
                        localStorage['authTokenEvernote'] = JSON.stringify(querystring);
                        self.getNotebook();
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

        getUser: function () {
            var self = this;
            var querystring = JSON.parse(localStorage['authTokenEvernote']);
            var authTokenEvernote = decodeURIComponent(querystring.oauth_token);
            var userStoreTransport = new Thrift.BinaryHttpTransport(self.__hostName + '/edam/user');
            var userStoreProtocol = new Thrift.BinaryProtocol(userStoreTransport);
            var userStore = new UserStoreClient(userStoreProtocol);
            userStore.getUser(authTokenEvernote, function (user) {
                console.log(user);
            });
        },

        getNotebook: function () {
            var self = this;
            var querystring = JSON.parse(localStorage['authTokenEvernote']);
            var authTokenEvernote = decodeURIComponent(querystring.oauth_token);
            var noteStoreURL = decodeURIComponent(querystring.edam_noteStoreUrl);
            var noteStoreTransport = new Thrift.BinaryHttpTransport(noteStoreURL);
            var noteStoreProtocol = new Thrift.BinaryProtocol(noteStoreTransport);
            var noteStore = new NoteStoreClient(noteStoreProtocol);
            noteStore.listNotebooks(authTokenEvernote, function (data) {
                if (data.errorCode === 9 && data.parameter === 'authenticationToken') {
                    // oauth failed
                    localStorage.removeItem('authTokenEvernote');
                    self.getOAuth();
                }
                console.log(data);
            });
        },

        createNote: function (noteData) {
            var self = this;
            var querystring = JSON.parse(localStorage['authTokenEvernote']);
            var authTokenEvernote = decodeURIComponent(querystring.oauth_token);
            var noteStoreURL = decodeURIComponent(querystring.edam_noteStoreUrl);
            var noteStoreTransport = new Thrift.BinaryHttpTransport(noteStoreURL);
            var noteStoreProtocol = new Thrift.BinaryProtocol(noteStoreTransport);
            var noteStore = new NoteStoreClient(noteStoreProtocol);
            var nBody = '<?xml version="1.0" encoding="UTF-8"?>';
            nBody += '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">';
            nBody += '<en-note>' + noteData.content + '</en-note>';
            var attributes = new NoteAttributes();
            attributes.sourceURL = noteData.sourceURL;
            var note = new Note();
            note.title = noteData.title;
            note.content = nBody;
            note.attributes = attributes;
            noteStore.createNote(authTokenEvernote, note, function (data) {
                console.log(data);
            });
        }
    }
    App.modules.evernote = evernote;
})(jQuery);