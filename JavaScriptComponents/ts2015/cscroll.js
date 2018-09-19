"use strict";
var VirtualRenderer = (function () {
    function VirtualRenderer() {
        if (!('remove' in Element.prototype)) {
            (Element.prototype).remove = function () {
                this.parentNode.removeChild(this);
            };
        }
        this.rows = {};
        this.page = 0;
        this.offset = 0;
        this.prevScrollTop = 0;
        this.th = 1000000000;
        this.h = 1000000;
        this.ph = this.h / 100;
        this.n = Math.ceil(this.th / this.ph);
        this.vp = 400;
        this.rh = 50;
        this.cj = (this.th - this.h) / (this.n - 1);
        this.onScroll.bind(this);
        this.onNearScroll.bind(this);
        this.onJump.bind(this);
        this.removeAllRows.bind(this);
        this.renderViewport.bind(this);
        this.renderRow.bind(this);
        this.logDebugInfo.bind(this);
        this.viewport = document.getElementById("viewport");
        this.content = document.getElementById("content");
        this.viewport.style.height = this.vp + "px";
        this.content.style.height = this.h + "px";
        this.viewport.addEventListener("scroll", this.onScroll);
        this.onScroll();
    }
    VirtualRenderer.prototype.onScroll = function () {
        if (Math.abs(this.viewport.scrollTop - this.prevScrollTop) > this.vp)
            this.onJump();
        else
            this.onNearScroll();
        this.renderViewport();
        this.logDebugInfo();
    };
    VirtualRenderer.prototype.onNearScroll = function () {
        var scrollTop = this.viewport.scrollTop;
        if (scrollTop + this.offset > (this.page + 1) * this.ph) {
            this.page++;
            this.offset = Math.round(this.page * this.cj);
            this.viewport.scrollTop = this.prevScrollTop = scrollTop - this.cj;
            this.removeAllRows();
        }
        else if (scrollTop + this.offset < this.page * this.ph) {
            this.page--;
            this.offset = Math.round(this.page * this.cj);
            this.viewport.scrollTop = this.prevScrollTop = scrollTop + this.cj;
            this.removeAllRows();
        }
        else
            this.prevScrollTop = scrollTop;
    };
    VirtualRenderer.prototype.onJump = function () {
        var scrollTop = this.viewport.scrollTop;
        this.page = Math.floor(scrollTop * ((this.th - this.vp) / (this.h - this.vp)) * (1 / this.ph));
        this.offset = Math.round(this.page * this.cj);
        this.prevScrollTop = scrollTop;
        this.removeAllRows();
    };
    VirtualRenderer.prototype.removeAllRows = function () {
        for (var i in this.rows) {
            this.rows[i].remove();
            delete this.rows[i];
        }
    };
    VirtualRenderer.prototype.renderViewport = function () {
        var y = this.viewport.scrollTop + this.offset, buffer = this.vp, top = Math.floor((y - buffer) / this.rh), bottom = Math.ceil((y + this.vp + buffer) / this.rh);
        top = Math.max(0, top);
        bottom = Math.min(this.th / this.rh, bottom);
        for (var i in this.rows) {
            if (i < top || i > bottom) {
                console.log(this.rows[i].__proto__);
                this.rows[i].remove();
                delete this.rows[i];
            }
        }
        for (var i = top; i <= bottom; i++) {
            if (!this.rows[i])
                this.rows[i] = this.renderRow(i);
        }
    };
    VirtualRenderer.prototype.renderRow = function (row) {
        var div = document.createElement("div");
        div.setAttribute("class", "row");
        div.style.top = (row * this.rh - this.offset) + "px";
        div.style.height = this.rh + "px";
        var text = document.createTextNode("row " + (row + 1));
        div.appendChild(text);
        this.content.appendChild(div);
        return div;
    };
    VirtualRenderer.prototype.logDebugInfo = function () {
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
        df.append("n = " + this.n)
            .append("ph = " + this.ph)
            .append("cj = " + this.cj);
        df.appendChild(document.createElement("hr"));
        df.append("page = " + this.page)
            .append("offset = " + this.offset)
            .append("virtual y = " + (this.prevScrollTop + this.offset))
            .append("real y = " + this.prevScrollTop)
            .append("rows in the DOM = " + [].slice.call(document.querySelectorAll(".row")).length);
        dbg.appendChild(df);
    };
    return VirtualRenderer;
}());
