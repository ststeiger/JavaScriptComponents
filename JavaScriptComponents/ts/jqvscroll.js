var th = 1000000000;
var h = 1000000;
var ph = h / 100;
var n = Math.ceil(th / ph);
var vp = 400;
var rh = 50;
var cj = (th - h) / (n - 1);
var page = 0;
var offset = 0;
var prevScrollTop = 0;
var rows = {};
var viewport, content;
function autoRun() {
    if (!('remove' in Element.prototype)) {
        Element.prototype.remove = function () {
            this.parentNode.removeChild(this);
        };
    }
    viewport = document.getElementById("viewport");
    content = document.getElementById("content");
    viewport.style.height = vp + "px";
    content.style.height = h + "px";
    viewport.addEventListener("scroll", onScroll);
    onScroll();
}
function onScroll() {
    var scrollTop = viewport.scrollTop;
    if (Math.abs(scrollTop - prevScrollTop) > vp)
        onJump();
    else
        onNearScroll();
    renderViewport();
    logDebugInfo();
}
function onNearScroll() {
    var scrollTop = viewport.scrollTop;
    if (scrollTop + offset > (page + 1) * ph) {
        page++;
        offset = Math.round(page * cj);
        viewport.scrollTop = prevScrollTop = scrollTop - cj;
        removeAllRows();
    }
    else if (scrollTop + offset < page * ph) {
        page--;
        offset = Math.round(page * cj);
        viewport.scrollTop = prevScrollTop = scrollTop + cj;
        removeAllRows();
    }
    else
        prevScrollTop = scrollTop;
}
function onJump() {
    var scrollTop = viewport.scrollTop;
    page = Math.floor(scrollTop * ((th - vp) / (h - vp)) * (1 / ph));
    offset = Math.round(page * cj);
    prevScrollTop = scrollTop;
    removeAllRows();
}
function removeAllRows() {
    for (var i in rows) {
        rows[i].remove();
        delete rows[i];
    }
}
function renderViewport() {
    var y = viewport.scrollTop + offset, buffer = vp, top = Math.floor((y - buffer) / rh), bottom = Math.ceil((y + vp + buffer) / rh);
    top = Math.max(0, top);
    bottom = Math.min(th / rh, bottom);
    for (var i in rows) {
        if (i < top || i > bottom) {
            console.log(rows[i].__proto__);
            rows[i].remove();
            delete rows[i];
        }
    }
    for (var i = top; i <= bottom; i++) {
        if (!rows[i])
            rows[i] = renderRow(i);
    }
}
function renderRow(row) {
    var div = document.createElement("div");
    div.setAttribute("class", "row");
    div.style.top = (row * rh - offset) + "px";
    div.style.height = rh + "px";
    var text = document.createTextNode("row " + (row + 1));
    div.appendChild(text);
    content.appendChild(div);
    return div;
}
function logDebugInfo() {
    var dbg = document.getElementById("debug");
    dbg.innerHTML = "";
    var df = document.createDocumentFragment();
    df.append = function (txt) {
        var tn = document.createTextNode(txt);
        df.appendChild(tn);
        var br = document.createElement("br");
        df.appendChild(br);
        return df;
    };
    df.append("n = " + n)
        .append("ph = " + ph)
        .append("cj = " + cj);
    df.appendChild(document.createElement("hr"));
    df.append("page = " + page)
        .append("offset = " + offset)
        .append("virtual y = " + (prevScrollTop + offset))
        .append("real y = " + prevScrollTop)
        .append("rows in the DOM = " + [].slice.call(document.querySelectorAll(".row")).length);
    dbg.appendChild(df);
}
