'use strict';
class VirtualList {
    constructor(config) {
        this.createRow = this.createRow.bind(this);
        this.renderChunk = this.renderChunk.bind(this);
        this.onScroll = this.onScroll.bind(this);
        let width = (config && config.w + 'px') || '100%';
        let height = (config && config.h + 'px') || '100%';
        let itemHeight = this.itemHeight = config.itemHeight;
        this.items = config.items;
        this.generatorFn = config.generatorFn;
        this.totalRows = config.totalRows || (config.items && config.items.length);
        this.m_lastScrolled = 0;
        this.m_screenItemsLen = Math.ceil(config.h / itemHeight);
        this.m_maxBuffer = this.m_screenItemsLen * this.itemHeight;
        let scroller = VirtualList.createScroller(itemHeight * this.totalRows);
        this.container = VirtualList.createContainer(width, height);
        this.container.appendChild(scroller);
        this.cachedItemsLen = this.m_screenItemsLen * 3;
        this.renderChunk(this.container, 0);
        this.container.addEventListener('scroll', this.onScroll);
    }
    static Trace(...args) {
        let stackTrace = (new Error()).stack;
        if (stackTrace) {
            let callerName = stackTrace.replace(/^Error\s+/, '');
            callerName = callerName.split("\n")[1];
            callerName = callerName.replace(/^\s+at Object./, '');
            callerName = callerName.replace(/ \(.+\)$/, '');
            callerName = callerName.replace(/\@.+/, '');
            console.log(callerName);
        }
        for (let i = 0; i < args.length; ++i) {
        }
    }
    static createContainer(w, h) {
        VirtualList.Trace(w, h);
        let c = document.createElement('div');
        c.style.width = w;
        c.style.height = h;
        c.style.overflow = 'auto';
        c.style.position = 'relative';
        c.style.padding = "0";
        c.style.border = '1px solid black';
        return c;
    }
    static createScroller(h) {
        VirtualList.Trace(h);
        let scroller = document.createElement('div');
        scroller.style.opacity = "0";
        scroller.style.position = 'absolute';
        scroller.style.top = "0";
        scroller.style.left = "0";
        scroller.style.width = '1px';
        scroller.style.height = h + 'px';
        return scroller;
    }
    createRow(i) {
        let item;
        if (this.generatorFn)
            item = this.generatorFn(i);
        else if (this.items) {
            if (typeof this.items[i] === 'string') {
                item = document.createElement('div');
                item.style.height = this.itemHeight + 'px';
                let itemText = document.createTextNode(this.items[i]);
                item.appendChild(itemText);
            }
            else {
                item = this.items[i];
            }
        }
        item.setAttribute("data-rowNr", i.toString());
        item.classList.add('vrow');
        item.style.position = 'absolute';
        item.style.top = (i * this.itemHeight) + 'px';
        return item;
    }
    onScroll(e) {
        VirtualList.Trace(e);
        let scrollTop = e.target.scrollTop;
        if (!this.m_lastRepaintY || Math.abs(scrollTop - this.m_lastRepaintY) > this.m_maxBuffer) {
            let first = parseInt((scrollTop / this.itemHeight)) - this.m_screenItemsLen;
            this.renderChunk(this.container, first < 0 ? 0 : first);
            this.m_lastRepaintY = scrollTop;
        }
        this.m_lastScrolled = Date.now();
        e.preventDefault && e.preventDefault();
    }
    renderChunk(node, from) {
        VirtualList.Trace(node, from);
        let finalItem = from + this.cachedItemsLen;
        if (finalItem > this.totalRows)
            finalItem = this.totalRows;
        console.log("node:", node);
        console.log("from", from);
        console.log("finalItem", finalItem);
        for (let j = node.children.length - 1; j > 0; --j) {
            let ri = new Number(node.children[j].getAttribute("data-rowNr"));
            if (ri < from || ri > finalItem) {
                node.removeChild(node.children[j]);
            }
        }
        let fragment = document.createDocumentFragment();
        for (let i = from; i < finalItem; i++) {
            fragment.appendChild(this.createRow(i));
        }
        node.appendChild(fragment);
    }
}
