//Piggy Reader
//author @huntbao
(function ($) {
    'use strict';
    window.jiZhuReaderGetPageContent = {
        getCurrentContent: function (callback) {
            var self = this;
            var targetNode = null;
            var extract = self.extractContent(document);
            if (extract.isSuccess) {
                targetNode = extract.content.asNode();
            }
            if (targetNode) {
                var content = self.cleanNode(targetNode);
                callback && callback(content);
            } else {
                callback && callback(null);
            }
        },
        getContent: function (url, title, previousPageContent, callback) {
            var self = this;
            self.getDocByUrl(url, function (doc) {
                var titleLevenshtein = doc.title.levenshtein(title);
                //console.log('title levenshtein distance: ' + titleLevenshtein);
                if (titleLevenshtein > Math.max(title.length, doc.title.length) / 2) {
                    //TODO: we suppose it is another page
                    return;
                }
                var content = '';
                var targetNode = null;
                var extract = self.extractContent(doc);
                if (extract.isSuccess) {
                    targetNode = extract.content.asNode();
                }
                if (targetNode) {
                    var content = self.cleanNode(targetNode);
                    if (content !== previousPageContent) {
                        callback && callback(url, content, doc);
                    }
                }
            });
        },
        getDocByUrl: function (url, callback) {
            if (!url) {
                return;
            }
            if (url.substr(0, 4) === 'http') {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, true);
                xhr.responseType = 'document';
                xhr.onload = function (e) {
                    if (e.target.status === 200) {
                        callback && callback(xhr.response);
                    }
                }
                xhr.send(null);
            }
        },
        extractContent: function (doc) {
            var ex = new ExtractContentJS.LayeredExtractor();
            ex.addHandler(ex.factory.getHandler('Heuristics'));
            var res = ex.extract(doc);
            return res;
        },
        cleanNode: function (node) {
            var self = this,
                cloneNode = $(node).clone();
            cloneNode.find('style,script,link,iframe,frame,frameset,noscript,head,html,applet,base,basefont,bgsound,blink,ilayer,layer,meta,object,embed,input,textarea,button,select,canvas,map').remove();
            cloneNode.find('a, img').each(function (idx, el) {
                //relative path to absolute path
                if (el.tagName.toLowerCase() === 'a') {
                    el.href = el.href;
                    el.target = '_blank';
                } else {
                    el.src = el.getAttribute('original') || el.src;
                }
            });
            cloneNode.removeAttr('id').find('*[id], *[style]').removeAttr('id').removeAttr('style');
            return cloneNode[0].outerHTML;
        },
        findNextPageContent: function (doc, baseUrl, previousPageContent) {
            var self = this;
            var nextLinkHref = self.findNextLink(doc, baseUrl);
            if (nextLinkHref) {
                self.getContent(nextLinkHref, doc.title, previousPageContent, function (url, content, doc) {
                    if (!content) return;
                    var port = chrome.extension.connect({name: 'appendcontent'});
                    port.postMessage({
                        content: content,
                        title: doc.title,
                        url: url
                    });
                    self.getContentTimer = setTimeout(function () {
                        jiZhuReaderGetPageContent.findNextPageContent(doc, url, content);
                    }, 1000);
                });
            }
            return false;
        },
        findNextLink: function (doc, baseUrl) {
            var date = Date.now();
            var self = this;
            var matchUrl = self.getMatchUrl(baseUrl);
            self.convertRelativePathToAbsolutePathOfLinks(doc);
            //console.log('match link url prefix: ' + matchUrl);
            var links = doc.querySelectorAll('a[href ^= "' + matchUrl + '"]');
            var nextLinkUrl;
            var sameLengthLinks = [];
            var lengthyLinks = [];
            var linkUrl;
            var linkUrlOfNum;
            var baseUrlOfNum = baseUrl.replace(/[^0-9]/ig, '');
            for (var i = 0, l = links.length; i < l; i++) {
                if (!/^\d+$/.test(links[i].innerHTML.trim())) continue;
                linkUrl = links[i].origin + links[i].pathname + links[i].search;
                linkUrlOfNum = linkUrl.replace(/[^0-9]/ig, '');
                if (linkUrlOfNum.length === baseUrlOfNum.length) {
                    if (linkUrlOfNum > baseUrlOfNum) {
                        sameLengthLinks.push(linkUrl);
                    }
                } else if (linkUrlOfNum.length === baseUrlOfNum.length + 1) {
                    lengthyLinks.push(linkUrl);
                }
            }
            sameLengthLinks.sort();
            lengthyLinks.sort();
            nextLinkUrl = sameLengthLinks[0] || lengthyLinks[0];
            //console.log('next link found: ' + nextLinkUrl);
            //console.log('time cost: ' + (Date.now() - date));
            return nextLinkUrl;
        },
        getMatchUrl: function (url) {
            url = url.split('/');
            var fileName = url.pop();
            if (fileName.lastIndexOf('.') !== -1) {
                fileName = fileName.substr(0, fileName.lastIndexOf('.'));
            }
            if (fileName.length <= 2) {
                return url.join('/') + '/' + fileName;
            }
            return url.join('/') + '/' + fileName.substr(0, fileName.length - 2);
        },
        convertRelativePathToAbsolutePathOfLinks: function (node) {
            var self = this;
            var links = node.querySelectorAll('a');
            var hrefProp;
            for (var i = links.length - 1; i >= 0; i--) {
                hrefProp = links[i].getAttribute('href');
                if (!hrefProp || hrefProp === '#') continue;
                links[i].href = links[i].href;
            }
        }
    }
})(jQuery);