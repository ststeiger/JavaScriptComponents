let th = 1000000000;
let h = 1000000;
let ph = h / 100;
let n = Math.ceil(th / ph);
let vp = 400;
let rh = 50;
let cj = (th - h) / (n - 1);
let page = 0;
let offset = 0;
let prevScrollTop = 0;
let rows = {};
let viewport, content;
function autoRun() {
    viewport = document.getElementById("viewport");
    content = document.getElementById("content");
    viewport.style.height = vp + "px";
    content.style.height = h + "px";
    viewport.addEventListener("scroll", onScroll);
    onScroll();
}
function onScroll() {
    let scrollTop = viewport.scrollTop;
    if (Math.abs(scrollTop - prevScrollTop) > vp)
        onJump();
    else
        onNearScroll();
    renderViewport();
    logDebugInfo();
}
function onNearScroll() {
    let scrollTop = viewport.scrollTop;
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
    let scrollTop = viewport.scrollTop;
    page = Math.floor(scrollTop * ((th - vp) / (h - vp)) * (1 / ph));
    offset = Math.round(page * cj);
    prevScrollTop = scrollTop;
    removeAllRows();
}
function removeAllRows() {
    for (let i in rows) {
        rows[i].remove();
        delete rows[i];
    }
}
function renderViewport() {
    let y = viewport.scrollTop + offset, buffer = vp, top = Math.floor((y - buffer) / rh), bottom = Math.ceil((y + vp + buffer) / rh);
    top = Math.max(0, top);
    bottom = Math.min(th / rh, bottom);
    for (let i in rows) {
        if (i < top || i > bottom) {
            rows[i].remove();
            delete rows[i];
        }
    }
    for (let i = top; i <= bottom; i++) {
        if (!rows[i])
            rows[i] = renderRow(i);
    }
}
function renderRow(row) {
    let div = document.createElement("div");
    div.setAttribute("class", "row");
    div.style.top = (row * rh - offset) + "px";
    div.style.height = rh + "px";
    let text = document.createTextNode("row " + (row + 1));
    div.appendChild(text);
    content.appendChild(div);
    return div;
}
function logDebugInfo() {
    let dbg = document.getElementById("debug");
    dbg.innerHTML = "";
    let df = document.createDocumentFragment();
    df.append = function (txt) {
        let tn = document.createTextNode(txt);
        df.appendChild(tn);
        let br = document.createElement("br");
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
    console.log("n", n);
    console.log("ph", ph);
    console.log("cj", cj);
    console.log("virtual y = ", (prevScrollTop + offset));
    console.log("real y = " + prevScrollTop);
    console.log("rows in the DOM = ", Array.prototype.slice.call(document.querySelectorAll(".row")).length);
}
