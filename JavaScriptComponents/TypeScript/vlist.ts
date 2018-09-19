/**
 * The MIT License (MIT)
 *
 * Copyright (C) 2013 Sergi Mansilla
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

'use strict';


interface IConfigBase
{
    w: number; // 300 - List width 
    h: number; // 300 - List height 
    itemHeight: number; // 31 - item height in pixel 
}

interface IConfig extends IConfigBase 
{
    items?: string[] | Node[]; // list of listitems (nodes/strings) 
}

interface IConfigDebug extends IConfigBase 
{
    totalRows?: number; // 10000 - doesn't need to be specified if items is supplied 

    // if generatorFn != null ==> items computed from generatorFn 
    // then totalRows must be specified
    generatorFn: (rowNumber: number) => Element;
}


/*
let example: IConfigDebug =
    {
        w: 300,
        h: 300,
        itemHeight: 31,
        totalRows: 10000,
        generatorFn: function (row)
        {
            let el = document.createElement("div");
            el.innerHTML = "ITEM " + row;
            el.style.borderBottom = "1px solid red";
            el.style.position = "absolute";
            return el;
        }
    };
*/


// https://github.com/sergi/virtual-list
// export
class VirtualList
{

    protected itemHeight;
    protected items;
    protected generatorFn;
    protected container:HTMLElement;
    protected totalRows;
    protected cachedItemsLen;

    // protected rmNodeInterval;// setInterval



    
    protected m_lastScrolled;
    protected m_lastRepaintY;
    protected m_maxBuffer;
    protected m_screenItemsLen;

    /**
     * Creates a virtually-rendered scrollable list.
     * @param {object} config
     * @constructor
     */
    constructor(config: IConfig | IConfigDebug) 
    {
        this.createRow = this.createRow.bind(this);
        this.renderChunk = this.renderChunk.bind(this);
        // this.removeUnusedNodes = this.removeUnusedNodes.bind(this)
        this.onScroll = this.onScroll.bind(this);
        
        
        let width = (config && config.w + 'px') || '100%';
        let height = (config && config.h + 'px') || '100%';
        let itemHeight = this.itemHeight = config.itemHeight;

        this.items = (<IConfig>config).items;
        this.generatorFn = (<IConfigDebug>config).generatorFn;
        this.totalRows = (<IConfigDebug>config).totalRows || ((<IConfig>config).items && (<IConfig>config).items.length);

        this.m_lastScrolled = 0;
        this.m_screenItemsLen = Math.ceil(config.h / itemHeight);
        this.m_maxBuffer = this.m_screenItemsLen * this.itemHeight;


        let scroller = VirtualList.createScroller(itemHeight * this.totalRows);
        this.container = VirtualList.createContainer(width, height);
        this.container.appendChild(scroller);

        // Cache 4 times the number of items that fit in the container viewport
        // this.cachedItemsLen = screenItemsLen * 3;
        this.cachedItemsLen = this.m_screenItemsLen * 3;
        this.renderChunk(this.container, 0);


        // As soon as scrolling has stopped, this interval asynchronouslyremoves all
        // the nodes that are not used anymore
        // this.rmNodeInterval = setInterval(this.removeUnusedNodes, 300);
        
        this.container.addEventListener('scroll', this.onScroll);
    } // End Constructor 


    public static Trace(...args: any[])
    {
        // console.log("c1", VirtualList.Trace.caller);
        
        let stackTrace = (new Error()).stack; // Only tested in latest FF and Chrome
        if (stackTrace)
        {
            let callerName = stackTrace.replace(/^Error\s+/, ''); // Sanitize Chrome
            callerName = callerName.split("\n")[1]; // 1st item is this, 2nd item is caller
            callerName = callerName.replace(/^\s+at Object./, ''); // Sanitize Chrome
            callerName = callerName.replace(/ \(.+\)$/, ''); // Sanitize Chrome
            callerName = callerName.replace(/\@.+/, ''); // Sanitize Firefox

            // console.log(stackTrace);
            console.log(callerName);
        }

        for (let i = 0; i < args.length; ++i)
        {
            // console.log(args[i]);
        }

    }


    public static createContainer(w, h)
    {
        VirtualList.Trace(w, h);

        let c: HTMLElement = document.createElement('div');
        c.style.width = w;
        c.style.height = h;
        c.style.overflow = 'auto';
        c.style.position = 'relative';
        c.style.padding = "0";
        c.style.border = '1px solid black';

        return c;
    } // End Function createContainer 


    public static createScroller(h)
    {
        VirtualList.Trace(h);

        let scroller: HTMLElement = document.createElement('div');
        scroller.style.opacity = "0";
        scroller.style.position = 'absolute';
        scroller.style.top = "0";
        scroller.style.left = "0";
        scroller.style.width = '1px';
        scroller.style.height = h + 'px';
        return scroller;
    } // End Function createScroller 


    public createRow(i:number) 
    {
        // VirtualList.Trace(i);

        let item:HTMLElement;

        if (this.generatorFn)
            item = this.generatorFn(i);
        else if (this.items)
        {
            if (typeof this.items[i] === 'string')
            {
                item = document.createElement('div');
                item.style.height = this.itemHeight + 'px';

                let itemText = document.createTextNode(this.items[i]);
                item.appendChild(itemText);
            }
            else
            {
                item = this.items[i];
            }
        }

        item.setAttribute("data-rowNr", i.toString());

        item.classList.add('vrow');
        item.style.position = 'absolute';
        item.style.top = (i * this.itemHeight) + 'px';
        return item;
    } // End Function createRow 


    protected onScroll(e)
    {
        VirtualList.Trace(e);

        let scrollTop = e.target.scrollTop; // Triggers reflow
        if (!this.m_lastRepaintY || Math.abs(scrollTop - this.m_lastRepaintY) > this.m_maxBuffer)
        {
            let first: number = parseInt(<string><any>(scrollTop / this.itemHeight)) - this.m_screenItemsLen;
            this.renderChunk(this.container, first < 0 ? 0 : first);
            this.m_lastRepaintY = scrollTop;
        }

        this.m_lastScrolled = Date.now();
        e.preventDefault && e.preventDefault();
    } // End Sub onScroll 


    /*
    protected removeUnusedNodes()
    {
        VirtualList.Trace();

        if (Date.now() - this.m_lastScrolled > 100)
        {
            let badNodes = this.container.querySelectorAll('[data-rm="1"]');
            for (let i = 0, l = badNodes.length; i < l; i++)
            {
                // https://stackoverflow.com/questions/12528049/if-a-dom-element-is-removed-are-its-listeners-also-removed-from-memory
                this.container.removeChild(badNodes[i]);
            } // Next i 
        }
        
    } // End Sub removeUnusedNodes 
    */

    /**
     * Renders a particular, consecutive chunk of the total rows in the list. To
     * keep acceleration while scrolling, we mark the nodes that are candidate for
     * deletion instead of deleting them right away, which would suddenly stop the
     * acceleration. We delete them once scrolling has finished.
     *
     * @param {Node} node Parent node where we want to append the children chunk.
     * @param {Number} from Starting position, i.e. first children index.
     * @return {void}
     */
    protected renderChunk(node:Element, from)
    {
        VirtualList.Trace(node, from);

        let finalItem = from + this.cachedItemsLen;
        if (finalItem > this.totalRows)
            finalItem = this.totalRows;

        console.log("node:", node);
        console.log("from", from);
        console.log("finalItem", finalItem);

        
        for (let j = node.children.length - 1; j > 0; --j)
        {
            let ri = new Number( node.children[j].getAttribute("data-rowNr") );
            if (ri < from || ri > finalItem)
            {
                node.removeChild(node.children[j]);
                // (<HTMLElement>node.children[j]).style.display = 'none';
                // node.children[j].setAttribute('data-rm', '1');
            }
            
        } // Next j 
        
        
        // Append all the new rows in a document fragment that we will later append to
        // the parent node
        let fragment = document.createDocumentFragment();
        for (let i = from; i < finalItem; i++)
        {
            fragment.appendChild(this.createRow(i));
        } // Next i 
        
        /*
        // Hide and mark obsolete nodes for deletion.
        for (let j = 1, l = node.childNodes.length; j < l; j++)
        {
            node.childNodes[j].style.display = 'none';
            node.childNodes[j].setAttribute('data-rm', '1');
        } // next j 
        */

        node.appendChild(fragment);
    } // End Function renderChunk 


} // End Class VirtualList 


// https://www.davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/
// https://auth0.com/blog/javascript-module-systems-showdown/

// https://stackoverflow.com/questions/14339313/what-is-the-smallest-amd-loader-to-date
// https://github.com/MaxMotovilov/eeMD
// https://github.com/TikiTDO/ultralight_amd

