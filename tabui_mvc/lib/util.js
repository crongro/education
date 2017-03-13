 var utils = {
    sendAjax : function(sAjaxURL, fnCallback) {
        var oReq = new XMLHttpRequest();
        oReq.addEventListener("load", function(e) {
            var htData = JSON.parse(oReq.responseText);
            fnCallback(htData);
        });
        oReq.open("GET", sAjaxURL);
        oReq.send();
    },
    getChildOrder : function(elChild) {
        var elParent = elChild.parentNode;
        var nIndex = Array.prototype.indexOf.call(elParent.children, elChild);
        return ++nIndex;
    }
};