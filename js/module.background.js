//Piggy Reader
//author @huntbao
(function ($) {
    'use strict';
    window.jiZhuReaderBackground = {

        init: function () {
            var self = this;
            self.initConnect();
            self.browserAction();
            self.createContextMenu();
            self.testEvernote();
        },

        testEvernote: function () {
            var self = this;
            var hostName = "https://sandbox.evernote.com";
            var options, oauth;
            options = {
                consumerKey: 'huntbao-7034',
                consumerSecret: '797a1474b0a48e20',
                callbackUrl: 'gotAuth.html',
                signatureMethod: 'HMAC-SHA1'
            };
            oauth = OAuth(options);
            var app = {
                success: function (data) {
                    var isCallBackConfirmed = false;
                    var token = '';
                    var vars = data.text.split("&");
                    for (var i = 0; i < vars.length; i++) {
                        var y = vars[i].split('=');
                        if (y[0] === 'oauth_token') {
                            token = y[1];
                        } else if (y[0] === 'oauth_token_secret') {
                            self.oauth_token_secret = y[1];
                            localStorage.setItem("oauth_token_secret", y[1]);
                        } else if (y[0] === 'oauth_callback_confirmed') {
                            isCallBackConfirmed = true;
                        }
                    }
                    var ref;
                    if (isCallBackConfirmed) {
                        // step 2
                        ref = window.open(hostName + '/OAuth.action?oauth_token=' + token, '_blank');
                        ref.addEventListener('loadstart', function (event) {
                            var loc = event.url;
                            if (loc.indexOf(hostName + '/Home.action?gotOAuth.html?') >= 0) {
                                var index, verifier = '';
                                var got_oauth = '';
                                var params = loc.substr(loc.indexOf('?') + 1);
                                params = params.split('&');
                                for (var i = 0; i < params.length; i++) {
                                    var y = params[i].split('=');
                                    if (y[0] === 'oauth_verifier') {
                                        verifier = y[1];
                                    } else if (y[0] === 'gotOAuth.html?oauth_token') {
                                        got_oauth = y[1];
                                    }
                                }
                            }
                            // step 3
                            oauth.setVerifier(verifier);
                            oauth.setAccessToken([got_oauth, localStorage.getItem("oauth_token_secret")]);
                            var getData = {'oauth_verifier': verifier};
                            ref.close();
                            oauth.request({
                                'method': 'GET',
                                'url': hostName + '/oauth',
                                'success': app.success,
                                'failure': app.failure
                            });
                        });
                    } else {
                        // Step 4 : Get the final token
                        var querystring = app.getQueryParams(data.text);
                        var authTokenEvernote = querystring.oauth_token;
                        // authTokenEvernote can now be used to send request to the Evernote Cloud API

                        // Here, we connect to the Evernote Cloud API and get a list of all of the
                        // notebooks in the authenticated user's account:
                        var noteStoreURL = querystring.edam_noteStoreUrl;
                        var noteStoreTransport = new Thrift.BinaryHttpTransport(noteStoreURL);
                        var noteStoreProtocol = new Thrift.BinaryProtocol(noteStoreTransport);
                        var noteStore = new NoteStoreClient(noteStoreProtocol);
                        noteStore.listNotebooks(authTokenEvernote, function (notebooks) {
                            console.log(notebooks);
                        });
                    }
                },
                failure: function (error) {
                    console.log('error ' + error.text);
                }
            };
            oauth.request({
                method: 'GET',
                url: hostName + '/oauth',
                success: app.success,
                failure: app.failure
            });
        },

        initConnect: function () {
            var self = this;
            chrome.extension.onConnect.addListener(function (port) {
                switch (port.name) {
                    case 'articlefrompage':
                        self.articlefrompageHandler(port);
                        break;
                    case 'appendcontent':
                        self.appendContentHandler(port);
                        break;
                    case 'lookup-phrase':
                        self.lookupPhraseHandler(port);
                        break;
                    case 'getsettings':
                        self.getSettingsHandler(port);
                    default:
                        break;
                }
            });
        },

        articlefrompageHandler: function (port) {
            var self = this;
            port.onMessage.addListener(function (data) {
                chrome.tabs.sendRequest(port.sender.tab.id, {
                    name: 'sendarticletoreader',
                    data: data,
                    settings: self.getSettings()
                });
            });
        },

        appendContentHandler: function (port) {
            var self = this;
            port.onMessage.addListener(function (data) {
                chrome.tabs.sendRequest(port.sender.tab.id, {
                    name: 'superaddtoreader',
                    data: data
                });
            });
        },

        lookupPhraseHandler: function (port) {
            var self = this;
            port.onMessage.addListener(function (data) {
                $.ajax({
                    url: 'http://dict.youdao.com/fsearch?q=' + encodeURIComponent(data.phrase),
                    success: function (xmlDoc) {
                        chrome.tabs.sendRequest(port.sender.tab.id, {
                            name: 'lookupphrase-result',
                            data: {
                                dictData: self.getDictData($(xmlDoc)),
                                position: data.position,
                                from: data.from
                            }
                        });
                    }
                });
            });
        },

        getSettingsHandler: function (port) {
            var self = this;
            port.onMessage.addListener(function (data) {
                chrome.tabs.sendRequest(port.sender.tab.id, {
                    name: 'settings',
                    data: self.getSettings()
                });
            });
        },

        browserAction: function () {
            var self = this;
            chrome.browserAction.onClicked.addListener(function (tab) {
                self.createReader();
            });
        },

        createContextMenu: function () {
            var self = this;
            chrome.contextMenus.create({
                contexts: ['all'],
                title: chrome.i18n.getMessage('ExtensionName'),
                onclick: function (info, tab) {
                    self.createReader();
                }
            });
        },

        createReader: function () {
            chrome.tabs.executeScript(null, {code: 'jiZhuReader.create();'});
        },

        getSettings: function () {
            var options = window.jiZhuReaderOptions;
            return {
                fontSize: options.fontSize + 'px',
                dictHostpage: options.dictHostpage,
                dictJzpage: options.dictJzpage
            }
        },

        getDictData: function (xmlDoc) {
            var self = this;
            var trans = [];
            var translation = xmlDoc.find('custom-translation content');
            $.each(translation, function (idx, tr) {
                trans.push($(tr).text())
            });
            var moreTrans = [];
            var moreTranslatioin = xmlDoc.find('web-translation');
            $.each(moreTranslatioin, function (idx, tr) {
                moreTrans.push({
                    key: $(tr).find('key').text(),
                    value: (function () {
                        var _trans = [];
                        $.each($(tr).find('trans value'), function () {
                            _trans.push($(this).text())
                        });
                        return _trans.join(', ');
                    }())
                })
            });
            var o = {
                phrase: xmlDoc.find('return-phrase').text(),
                phoneticSymbol: xmlDoc.find('phonetic-symbol').text(),
                translation: trans,
                hasMore: moreTrans.length > 0,
                moreTranslatioin: moreTrans
            }
            return o;
        }

    };

    $(function () {
        jiZhuReaderBackground.init();
    });

})(jQuery);