// 提取莆田数据
var fs = require('fs')
var PEG = require('pegjs')

var parseStr = fs.readFileSync('./putian/putian.pegjs', 'utf8')
var parser = PEG.buildParser(parseStr);
var fileStr = fs.readFileSync('./putian/putian.md', 'utf8')
var result = parser.parse(fileStr)
fs.writeFileSync('./reader/data/putian.data.js', `window.putianHospitalDataJiZhuReader=${JSON.stringify(result, null, '\t')}`, 'utf8')
