//@huntbao
(function($){
    'use strict';
    window.jiZhuReader = {
        create: function(){
            var self = this;
            if(self.iframe){
                self.hidePage();
                self.iframe.animate({
                    left: '0%'
                }, function(){
                    self.afterInitReader();
                });
                return;
            }
            self.dealPage();
            self.insertIframe();
            self.addWindowEventListener();
        },
        dealPage: function(){
            var self = this,
            beforeReaderCls = 'jizhureader-beforereader',
            readerCls = 'jizhureader-reader',
            html = $('html').addClass(beforeReaderCls),
            body = $('body').addClass(beforeReaderCls);
            self.hidePage = function(){
                html.addClass(beforeReaderCls);
                body.addClass(beforeReaderCls);
            }
            self.removeIframe = function(){
                html.removeClass(beforeReaderCls).removeClass(readerCls);
                body.removeClass(beforeReaderCls).removeClass(readerCls);
                self.iframe.animate({
                    left: '-100%'
                });
            }
            self.afterInitReader = function(){
                $(window).scrollTop(0);
                html = $('html').addClass(readerCls),
                body = $('body').addClass(readerCls);
            }
        },
        insertIframe: function(){
            var self = this;
            self.iframe = $('<iframe>', {
                id: 'jizhureader-iframe',
                frameborder: 0,
                allowtransparency: true,
                scrolling: 'auto',
                src: chrome.extension.getURL('reader.html')
            }).appendTo(document.body).animate({
                left: '0%'
            });
        },
        getPageContent: function(){
            var self = this,
            extract = self.extractContent(document),
            content = '',
            title = document.title && document.title.split(/[-,_,|]/)[0];
            if(extract.isSuccess){
                self.extractedContent = extract.content.asNode();
                content = self.cleanNode($(self.extractedContent));
            }
            var port = chrome.extension.connect({name:'articlefrompage'});
            port.postMessage({
                content: content,
                title: title
            });
            if(extract.isSuccess){
                //find more related pages
                self.haveTestedUrls = {};
                self.findNextPage(document, document.location.href);
            }
        },
        extractContent: function(doc){
            var ex = new ExtractContentJS.LayeredExtractor();
            ex.addHandler(ex.factory.getHandler('Heuristics'));
            var res = ex.extract(doc);
            return res;
        },
        addWindowEventListener: function(){
            var self = this;
            window.addEventListener('message', function(e){
                switch(e.data.name){
                    case 'afterinitreader':
                        self.afterInitReader();
                        break;
                    case 'getpagecontent':
                        self.getPageContent();
                        break;
                    case 'removeiframe':
                        self.removeIframe();
                        break;
                    default:
                        break;
                }
            }, true);
        },
        cleanNode: function(node){
            var self = this,
            cloneNode = node.clone();
            cloneNode.find('style,script,link,iframe,frame,frameset,noscript,head,html,applet,base,basefont,bgsound,blink,ilayer,layer,meta,object,embed,input,textarea,button,select,canvas,map').remove();
            cloneNode.find('a, img').each(function(idx, el){
                //relative path to absolute path
                el.href ? el.href = el.href : el.src = el.src;
            });
            cloneNode.removeAttr('id').find('*[id]').removeAttr('id');
            return $('<div>').append(cloneNode).html();
        },
        findNextPage: function(currentDoc, currentLocationHref){
            var date = new Date().getTime();
            var self = this,
            locationParts = currentLocationHref.split('/');
            if(locationParts.length < 4) return false;
            var links = currentDoc.querySelectorAll('a'),
            linkParts,
            foundLink;
            for(var i = links.length -1, href; i >= 0; i--){
                href = links[i].href;
                if(href === '' || href.indexOf(currentLocationHref) !== -1){
                    continue;
                }
                linkParts = href.split('/');
                if(!/http|https/.test(linkParts[0])){
                    continue;
                }
                if(self.arrayMatch(locationParts, linkParts)){
                    foundLink = self.isLinkInPageNav($(links[i]), currentLocationHref);
                    if(foundLink !== false){
                        break;
                    }
                }
            }
            console.log(foundLink)
            console.log('Tested link number: ' + links.length + '|' + (links.length - i - 1));
            console.log(new Date().getTime() - date);
            if(foundLink){
                self.getNextPageContent(foundLink.nextNav);
            }
            return false;
        },
        getNextPageContent: function(nextNav){
            var self = this,
            url = nextNav.href;
            if(url.substr(0, 4) === 'http'){
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, true);
                xhr.responseType = 'document';
                xhr.onload = function(e){
                    if(e.target.status === 200){
                        var doc = xhr.response,
                        targetNode = null;
                        if(self.extractedContent.id){
                            var target = doc.getElementById(self.extractedContent.id);
                            if(target.textContent !== self.extractedContent.textContent){
                                targetNode = target;
                            }
                        }else{
                            var extract = self.extractContent(doc);
                            if(extract.isSuccess){
                                targetNode  = extract.content.asNode();
                            }
                        }
                        if(targetNode){
                            var content = self.cleanNode($(targetNode));
                            //console.log(content)
                            //send content to reader iframe
                            var port = chrome.extension.connect({name : 'appendcontent'});
                            port.postMessage({
                                content: content
                            });
                            setTimeout(function(){
                                self.findNextPage(doc, url);
                            } , 1000);
                        }
                    }
                }
                xhr.send(null);
            }
        },
        isLinkInPageNav: function(link, currentLocationHref){
            var self = this;
            if(self.haveTestedUrls[link[0].href]) return false;
            var pageNav = link.parent();
            pageNav.is('li') ? (pageNav = pageNav.parent()) : '';
            var allEls = pageNav[0].childNodes,
            isNumber = function(a){
                var n = a.textContent.trim().replace(/[^0-9]/ig, '');
                return n === '' ? false : /^[0-9]*$/.test(n);
            },
            isLink = function(a){
                return a.nodeType === 1 && a.tagName.toLowerCase() === 'a';
            },
            getNum = function(a){
                return parseInt(a.textContent.trim().replace(/[^0-9]/ig, ''));
            },
            nextPageNavNum = -1,
            allNavs = [];
            for(var i = 0, l = allEls.length, el; i < l; i++){
                el = allEls[i];
                if(isNumber(el)){
                    if(isLink(el)){
                        if(self.arrayMatch(el.href.split('/'), currentLocationHref.split('/')) === false){
                            nextPageNavNum = getNum(el) + 1;
                        }else{
                            allNavs.push(el);
                            self.haveTestedUrls[el.href, true];
                        }
                    }else{
                        nextPageNavNum = getNum(el) + 1;
                    }
                }
            }
            if(nextPageNavNum !== -1){
                var nextNav,
                prevNav,
                isSuccess = false;
                for(var i = 0, l = allNavs.length; i < l; i++){
                    if(getNum(allNavs[i]) === nextPageNavNum){
                        nextNav = allNavs[i];
                        prevNav = allNavs[i - 1];
                        isSuccess = true;
                        break;
                    }
                }
                if(isSuccess){
                    return {
                        isSuccess: true,
                        nextNav: nextNav,
                        prevNav: prevNav
                    }
                }
            }
            return false;
        },
        arrayMatch: function(arr1, arr2){
            if(arr1.length !== arr2.length) return false;
            for(var i = arr1.length - 2; i >= 0; i--){
                if(arr1[i] !== arr2[i]){
                    return false;
                }
            }
            return true;
        },
        createDocument: function(html){
            var doc = document.implementation.createDocument('http://www.w3.org/1999/xhtml', 'html', null);
            console.log(doc)
            return doc;
        }
    }
})(jQuery);