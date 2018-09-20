
"use strict";


// [=] - real scrollable height (h)
// [-] - "pages";  total height of all (n) pages is (th) = (ph) * (n)

// The overlap between pages is (cj) and is the distance the scrollbar
// will jump when we adjust the scroll position during page switch.

// To keep things smooth, we need to minimize both (n) and (cj).
// Setting (ph) at 1/100 of (h) is a good start.



interface Element
{
    remove:() => void;
}


interface IDebugInterface
{
    append?: (txt: string) => DocumentFragment & IDebugInterface;
}


class VirtualRenderer 
{
    protected rows; // cached row nodes
    protected viewport;
    protected content;
    
    protected page;    // current page
    protected offset; // current page offset
    protected prevScrollTop;
    
    
    protected th;       // virtual height
    protected h;       // real scrollable height
    protected ph;     // page height
    protected n;     // number of pages
    protected vp;   // viewport height
    protected rh;  // row height
    protected cj; // "jumpiness" coefficient


    constructor()
    {
        // Polyfill
        if (!('remove' in Element.prototype))
        {
            (<Element>(Element.prototype)).remove = function ()
            {
                this.parentNode.removeChild(this);
            };
        }
        // End Polyfill
        

        // https://medium.com/@manju_reddys/rendering-array-of-billion-of-records-at-60-f-s-in-angular-or-vanilla-js-2613e5983a10
        // https://jsfiddle.net/SDa2B/293


        this.rows = {}; // cached rows stored for removal 
        this.page = 0;    // current page
        this.offset = 0; // current page offset
        this.prevScrollTop = 0;
        
        this.th = 1000000000; // virtual height = numItems * rowHeight

        // (virtual height/ width is = all dom elements would have fit if browser have no limits)
        // <= browser pixel scroll limit
        // Height limitations for browser vertical scroll bar
        // FF: 17895697px, IE: 10737418px, Chrome: 33554400px
        // this will give you a height of the scrollbar.
        // The scrollHeight is a read only property that contain the total height of element content in pixels.
        this.h = 1000000; // real scrollable height = document.getElementById("viewport").scrollHeight

        // n = 100 = number of pages
        this.ph = this.h / 100; // page height 
        this.n = Math.ceil(this.th / this.ph); // number of pages

        this.vp = 400; // viewport height = document.getElementById("viewport").offsetHeight - border 
        this.rh = 50; // row height
        


        // The overlap between pages is (cj) and is the distance the scrollbar
        // will jump when we adjust the scroll position during page switch.
        // To keep things smooth, we need to minimize both (n) and (cj).
        // Setting(ph) at 1/ 100 of (h) is a good start.
        this.cj = (this.th - this.h) / (this.n - 1); // "jumpiness" coefficient
        
        this.onScroll = this.onScroll.bind(this);
        this.onNearScroll = this.onNearScroll.bind(this);
        this.onJump = this.onJump.bind(this);
        this.removeAllRows = this.removeAllRows.bind(this);
        this.renderViewport = this.renderViewport.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.logDebugInfo = this.logDebugInfo.bind(this);
        
        this.viewport = document.getElementById("viewport");
        this.content = document.getElementById("content");
        
        this.viewport.style.height = this.vp + "px";
        this.content.style.height = this.h + "px";
        
        this.viewport.addEventListener("scroll", this.onScroll);
        this.onScroll();
    }
    
    
    private onScroll()
    {
        if (Math.abs(this.viewport.scrollTop - this.prevScrollTop) > this.vp)
            this.onJump();
        else
            this.onNearScroll();
    
        this.renderViewport();
        this.logDebugInfo();
    }
    
    
    private onNearScroll()
    {
        let scrollTop = this.viewport.scrollTop;
    
        // next page
        if (scrollTop + this.offset > (this.page + 1) * this.ph)
        {
            this.page++;
            this.offset = Math.round(this.page * this.cj);
    
            this.viewport.scrollTop = this.prevScrollTop = scrollTop - this.cj;
    
            this.removeAllRows();
        }
        // prev page
        else if (scrollTop + this.offset < this.page * this.ph)
        {
            this.page--;
            this.offset = Math.round(this.page * this.cj);
            this.viewport.scrollTop = this.prevScrollTop = scrollTop + this.cj;
            this.removeAllRows();
        }
        else
            this.prevScrollTop = scrollTop;
    }
    
    
    private onJump()
    {
        let scrollTop = this.viewport.scrollTop;
        this.page = Math.floor(scrollTop * ((this.th - this.vp) / (this.h - this.vp)) * (1 / this.ph));
        this.offset = Math.round(this.page * this.cj);
        this.prevScrollTop = scrollTop;
    
        this.removeAllRows();
    }
    
    
    private removeAllRows()
    {
        for (let i in this.rows)
        {
            this.rows[i].remove();
            delete this.rows[i];
        }
    }
    
    
    private renderViewport()
    {
        // calculate the viewport + buffer
        let y = this.viewport.scrollTop + this.offset,
            buffer = this.vp,
            top = Math.floor((y - buffer) / this.rh),
            bottom = Math.ceil((y + this.vp + buffer) / this.rh);
    
        top = Math.max(0, top);
        bottom = Math.min(this.th / this.rh, bottom);
    
        // remove rows no longer in the viewport
        for (let i in this.rows)
        {
            if (<number><any>i < top || <number><any>i > bottom)
            {
                console.log(this.rows[i].__proto__);
    
                this.rows[i].remove();
                delete this.rows[i];
            }
        }
    
        // add new rows
        for (let i = top; i <= bottom; i++)
        {
            if (!this.rows[i])
                this.rows[i] = this.renderRow(i);
        }
    }
    
    
    private renderRow(row)
    {
        let div = document.createElement("div");
        div.setAttribute("class", "row");
        div.style.top = (row * this.rh - this.offset) + "px";
        div.style.height = this.rh + "px";
        let text = document.createTextNode("row " + (row + 1));
        div.appendChild(text);
    
        this.content.appendChild(div);
    
        return div;
    }
    
    
    private logDebugInfo()
    {
        let dbg = <HTMLDivElement>document.getElementById("debug");
        dbg.innerHTML = "";
    
        let df: DocumentFragment & IDebugInterface = document.createDocumentFragment();
    
        df.append = function (txt)
        {
            let tn = document.createTextNode(txt);
            df.appendChild(tn);
            let br = document.createElement("br");
            df.appendChild(br);
    
            return df;
        };
    
    
        df.append("n = " + this.n)
            .append("ph = " + this.ph)
            .append("cj = " + this.cj)
        ;
    
        df.appendChild(document.createElement("hr"));
    
        df.append("page = " + this.page)
            .append("offset = " + this.offset)
            .append("virtual y = " + (this.prevScrollTop + this.offset))
            .append("real y = " + this.prevScrollTop)
            .append("rows in the DOM = " + [].slice.call(document.querySelectorAll(".row")).length);
        dbg.appendChild(df);

        // console.log("n", this.n);
        // console.log("ph", this.ph);
        // console.log("cj", this.cj);
        // console.log("virtual y = ", (this.prevScrollTop + this.offset));
        // console.log("real y = " + this.prevScrollTop);

        // console.log("rows in the DOM = ", Array.prototype.slice.call(document.querySelectorAll(".row")).length);
    }
    
    
} // End Class


// https://stackoverflow.com/questions/39248795/virtual-scrolling-on-javascript
// https://jsfiddle.net/SDa2B/4/?utm_source=website&utm_medium=embed&utm_campaign=SDa2B
// https://jsfiddle.net/jpeter06/ao464o8g/
