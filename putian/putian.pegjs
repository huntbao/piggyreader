Start
    = items:(Line*) {
        let result = {
            names: [],
            urls: []
        }
        items.forEach((item) => {
            if (item === null) return;
            if (item.name) {
            	result.names.push(item.name)
            } else if (item.url) {
            	result.urls.push(item.url)
            }
        })
        return result
    }

Line
    = "-" __ s:(AnyWithoutLB) LB+ {
    	return {
        	name: s.join('').split('(')[0].split('（')[0].split(' ')[0]
        }
    }
    / _ "- 网址" __ s:(AnyWithoutLB) LB+ {
    	return {
        	url: s.join('')
        }
    }
    / a:(AnyWithoutLB) LB+ {
        return null
    }

Word
    = l:Character+ {
        return l.join('');
    }

Character
    = [a-zA-Z0-9]

WS "Whitespace"
    = [ \t]

_ "Zero or more whitespaces"
    = WS*

__ "One or more whitespaces"
    = WS+

LB
    = [\r\n]

AnyWithoutLB
    = [^\r\n]*
Any
    = .*