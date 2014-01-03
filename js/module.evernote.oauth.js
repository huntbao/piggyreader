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
                                        if (tab.url.indexOf(self.__hostName + '/Home.action?gotOAuth.html?') >= 0) {
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
                                    }
                                }
                            });
                        });
                    } else {
                        // Step 4 : Get the final token
                        var querystring = App.modules.util.getQueryParams(data.text);
                        localStorage['authTokenEvernote'] = JSON.stringify(querystring);
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
            var querystring = JSON.parse(localStorage['authTokenEvernote']);
            var authTokenEvernote = decodeURIComponent(querystring.oauth_token);
            var userStoreTransport = new Thrift.BinaryHttpTransport(self.__hostName + '/edam/user');
            var userStoreProtocol = new Thrift.BinaryProtocol(userStoreTransport);
            var userStore = new UserStoreClient(userStoreProtocol);
            userStore.getUser(authTokenEvernote, function (data) {
                self.checkOAuthFunc(data, callback);
            });
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
                });
            });
        },

        saveNote: function (noteData, callback) {
            var self = this;
            var nBody = '<?xml version="1.0" encoding="UTF-8"?>';
            nBody += '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">';
            nBody += '<en-note>' + self.getENML(noteData.content) + '</en-note>';
            var attributes = new NoteAttributes();
            attributes.sourceURL = noteData.sourceURL;
            var note = new Note();
            note.title = noteData.title.trim();
            note.content = nBody.trim();
            note.attributes = attributes;
            note.notebookGuid = noteData.guid;
            var noteStore = self.getNoteStore();
            noteStore.createNote(note, function (data) {
                callback(data);
            });
        },

        getNoteStore: function () {
            var self = this;
            var querystring = JSON.parse(localStorage['authTokenEvernote']);
            var authTokenEvernote = decodeURIComponent(querystring.oauth_token);
            var noteStoreURL = decodeURIComponent(querystring.edam_noteStoreUrl);
            var noteStoreTransport = new Thrift.BinaryHttpTransport(noteStoreURL);
            var noteStoreProtocol = new Thrift.BinaryProtocol(noteStoreTransport);
            var noteStore = new NoteStoreClient(noteStoreProtocol);
            return {
                listNotebooks: function (callback) {
                    noteStore.listNotebooks(authTokenEvernote, function (data) {
                        self.checkOAuthFunc(data, callback);
                    });
                },
                createNote: function (note, callback) {
                    noteStore.createNote(authTokenEvernote, note, function (data) {
                        self.checkOAuthFunc(data, callback);
                    });
                }
            }
        },

        checkOAuthFunc: function (data, callback) {
            var self = this;
            if (data.errorCode === 9 && data.parameter === 'authenticationToken') {
                // oauth failed
                localStorage.removeItem('authTokenEvernote');
                self.getOAuth();
            } else {
                callback(data);
            }
        },

        getENML: function (html) {
            var self = this;
            html = html.replace(/(<([^>]+)>)/g, function($0, $1, $2){
                // html5 tags
                if (/^(article|aside|bdi|command|details|dialog|summary|figure|figcaption|footer|header|mark|meter|nav|progress|ruby|rt|rp|section|time|wbr)$/.test($2)) {
                    return '<div>';
                }
                return $0.toLowerCase();
            });
            var node = $('<div>').html(html);
            node.find('applet,base,basefont,bgsound,blink,body,button,dir,embed,fieldset,form,frame,frameset,head,html,iframe,ilayer,input,isindex,label,layer,egend,link,marquee,menu,meta,noframes,noscript,object,optgroup,option,param,plaintext,script,select,style,textarea,xml').remove();
            var els = node.find('*');
            var tagName;
            var attributes;
            var attr;
            var validTags = /^(a|abbr|acronym|address|area|b|bdo|big|blockquote|br|caption|center|cite|code|col|colgroup|dd|del|dfn|div|dl|dt|em|font|h1|h2|h3|h4|h5|h6|hr|i|img|ins|kbd|li|map|ol|p|pre|q|s|samp|small|span|strike|strong|sub|sup|table|tbody|td|tfoot|th|thead|title|tr|tt|u|ul|var|xmp)$/;
            $.each(els, function (idx, el) {
                tagName = el.tagName.toLowerCase();
                if (!validTags.test(tagName)) {
                    $(el).remove();
                } else {
                    attributes = $.map(el.attributes, function(item) {
                        return item.name;
                    });
                    for (var i = attributes.length - 1; i >= 0; i--) {
                        attr = attributes[i];
                        if (attr === 'href' && tagName === 'a') {
                            if (!/^(http:|https:|file:)$/.test(el.protocol)) {
                                el.removeAttribute(attr);
                            }
                        } else if(attr === 'src' && tagName === 'img') {
                            if (!self.isENMLProtocol(el.getAttribute(attr))) {
                                el.removeAttribute(attr);
                            }
                        } else if (attr !== 'style') {
                            el.removeAttribute(attr);
                        }
                    }
                }
            });
            return node.html().replace(/<br.*\/?>/g,'<br />').replace(/<hr.*\/?>/g,'<hr />');
        },

        isENMLProtocol: function (url) {
            var a = $('<a>', {
                href: url
            });
            return /^(http:|https:|file:)$/.test(a[0].protocol);
        }
    }

    App.modules.evernoteOAuth = evernoteOAuth;

})(jQuery);