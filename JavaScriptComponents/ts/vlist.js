'use strict';
var VirtualList = (function () {
    function VirtualList(config) {
        this.createRow = this.createRow.bind(this);
        this.renderChunk = this.renderChunk.bind(this);
        this.removeUnusedNodes = this.removeUnusedNodes.bind(this);
        this.onScroll = this.onScroll.bind(this);
        var width = (config && config.w + 'px') || '100%';
        var height = (config && config.h + 'px') || '100%';
        var itemHeight = this.itemHeight = config.itemHeight;
        this.items = config.items;
        this.generatorFn = config.generatorFn;
        this.totalRows = config.totalRows || (config.items && config.items.length);
        this.m_lastScrolled = 0;
        this.m_screenItemsLen = Math.ceil(config.h / itemHeight);
        this.m_maxBuffer = this.m_screenItemsLen * this.itemHeight;
        var scroller = VirtualList.createScroller(itemHeight * this.totalRows);
        this.container = VirtualList.createContainer(width, height);
        this.container.appendChild(scroller);
        this.cachedItemsLen = this.m_screenItemsLen * 3;
        this.renderChunk(this.container, 0);
        this.rmNodeInterval = setInterval(this.removeUnusedNodes, 300);
        this.container.addEventListener('scroll', this.onScroll);
    }
    VirtualList.createContainer = function (w, h) {
        var c = document.createElement('div');
        c.style.width = w;
        c.style.height = h;
        c.style.overflow = 'auto';
        c.style.position = 'relative';
        c.style.padding = "0";
        c.style.border = '1px solid black';
        return c;
    };
    VirtualList.createScroller = function (h) {
        var scroller = document.createElement('div');
        scroller.style.opacity = "0";
        scroller.style.position = 'absolute';
        scroller.style.top = "0";
        scroller.style.left = "0";
        scroller.style.width = '1px';
        scroller.style.height = h + 'px';
        return scroller;
    };
    VirtualList.prototype.createRow = function (i) {
        var item;
        if (this.generatorFn)
            item = this.generatorFn(i);
        else if (this.items) {
            if (typeof this.items[i] === 'string') {
                var itemText = document.createTextNode(this.items[i]);
                item = document.createElement('div');
                item.style.height = this.itemHeight + 'px';
                item.appendChild(itemText);
            }
            else {
                item = this.items[i];
            }
        }
        item.classList.add('vrow');
        item.style.position = 'absolute';
        item.style.top = (i * this.itemHeight) + 'px';
        return item;
    };
    VirtualList.prototype.onScroll = function (e) {
        var scrollTop = e.target.scrollTop;
        if (!this.m_lastRepaintY || Math.abs(scrollTop - this.m_lastRepaintY) > this.m_maxBuffer) {
            var first = parseInt((scrollTop / this.itemHeight)) - this.m_screenItemsLen;
            this.renderChunk(this.container, first < 0 ? 0 : first);
            this.m_lastRepaintY = scrollTop;
        }
        this.m_lastScrolled = Date.now();
        e.preventDefault && e.preventDefault();
    };
    VirtualList.prototype.removeUnusedNodes = function () {
        if (Date.now() - this.m_lastScrolled > 100) {
            var badNodes = this.container.querySelectorAll('[data-rm="1"]');
            for (var i = 0, l = badNodes.length; i < l; i++) {
                this.container.removeChild(badNodes[i]);
            }
        }
    };
    VirtualList.prototype.renderChunk = function (node, from) {
        var finalItem = from + this.cachedItemsLen;
        if (finalItem > this.totalRows)
            finalItem = this.totalRows;
        var fragment = document.createDocumentFragment();
        for (var i = from; i < finalItem; i++) {
            fragment.appendChild(this.createRow(i));
        }
        for (var j = 1, l = node.childNodes.length; j < l; j++) {
            node.childNodes[j].style.display = 'none';
            node.childNodes[j].setAttribute('data-rm', '1');
        }
        node.appendChild(fragment);
    };
    return VirtualList;
}());
