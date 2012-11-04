//@huntbao 
//All right reserved

window.onload = function(){
    /* var d = document.createElement('div');
    d.innerHTML = '<div style="height:expression(alert(\'XSS\'),1)" />';
    document.body.appendChild(d); */
    var b = document.getElementById('bbb');
    var c = b.getElementsByTagName('div');
    console.log(c)
    prettyPrint();
}