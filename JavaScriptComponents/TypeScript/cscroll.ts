

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


class mofa
{

    private th = 1000000000;            // virtual height
    private h = 1000000;                // real scrollable height
    private ph = h / 100;               // page height
    private n = Math.ceil(th / ph);     // number of pages
    private vp = 400;                   // viewport height
    private rh = 50;                    // row height
    private cj = (th - h) / (n - 1);    // "jumpiness" coefficient

    private page = 0;                   // current page
    private offset = 0;                 // current page offset
    private prevScrollTop = 0;

    private rows = {};                  // cached row nodes
    private viewport;
    private content;




    private autoRun()
    {
        // Polyfill
        if (!('remove' in Element.prototype))
        {
            (<Element>(Element.prototype)).remove = function ()
            {
                this.parentNode.removeChild(this);
            };
        }
    
        this.viewport = document.getElementById("viewport");
        this.content = document.getElementById("content");

        this.viewport.style.height = vp + "px";
        this.content.style.height = h + "px";

        this.viewport.addEventListener("scroll", onScroll);
        this.onScroll();
    }
    
    
    private onScroll()
    {
        let scrollTop = viewport.scrollTop;
    
        if (Math.abs(scrollTop - prevScrollTop) > vp)
            onJump();
        else
            onNearScroll();
    
        renderViewport();
        logDebugInfo();
    }

    private onNearScroll()
    {
        let scrollTop = viewport.scrollTop;
    
        // next page
        if (scrollTop + offset > (page + 1) * ph)
        {
            page++;
            offset = Math.round(page * cj);
    
            viewport.scrollTop = prevScrollTop = scrollTop - cj;
    
            removeAllRows();
        }
        // prev page
        else if (scrollTop + offset < page * ph)
        {
            page--;
            offset = Math.round(page * cj);
            viewport.scrollTop = prevScrollTop = scrollTop + cj;
            removeAllRows();
        }
        else
            prevScrollTop = scrollTop;
    }


    private onJump()
    {
        let scrollTop = viewport.scrollTop;
        page = Math.floor(scrollTop * ((th - vp) / (h - vp)) * (1 / ph));
        offset = Math.round(page * cj);
        prevScrollTop = scrollTop;
    
        removeAllRows();
    }


    private removeAllRows()
    {
        for (let i in rows)
        {
            rows[i].remove();
            delete rows[i];
        }
    }


    private renderViewport()
    {
        // calculate the viewport + buffer
        let y = viewport.scrollTop + offset,
            buffer = vp,
            top = Math.floor((y - buffer) / rh),
            bottom = Math.ceil((y + vp + buffer) / rh);
    
        top = Math.max(0, top);
        bottom = Math.min(th / rh, bottom);
    
        // remove rows no longer in the viewport
        for (let i in rows)
        {
            if (<number><any>i < top || <number><any>i > bottom)
            {
                console.log(rows[i].__proto__);
    
                rows[i].remove();
                delete rows[i];
            }
        }
    
        // add new rows
        for (let i = top; i <= bottom; i++)
        {
            if (!rows[i])
                rows[i] = renderRow(i);
        }
    }


    private renderRow(row)
    {
        let div = document.createElement("div");
        div.setAttribute("class", "row");
        div.style.top = (row * rh - offset) + "px";
        div.style.height = rh + "px";
        let text = document.createTextNode("row " + (row + 1));
        div.appendChild(text);
    
        content.appendChild(div);
    
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
    
    
        df.append("n = " + n)
            .append("ph = " + ph)
            .append("cj = " + cj)
        ;
    
        df.appendChild(document.createElement("hr"));
    
        df.append("page = " + page)
            .append("offset = " + offset)
            .append("virtual y = " + (prevScrollTop + offset))
            .append("real y = " + prevScrollTop)
            .append("rows in the DOM = " + [].slice.call(document.querySelectorAll(".row")).length);
        dbg.appendChild(df);
    
    
        /*
        console.log("n", n);
        console.log("ph", ph);
        console.log("cj", cj);
        console.log("virtual y = ", (prevScrollTop + offset));
        console.log("real y = " + prevScrollTop);
    
        console.log("rows in the DOM = ", Array.prototype.slice.call(document.querySelectorAll(".row")).length);
        */
    }
    
    
} // End Class


// https://stackoverflow.com/questions/39248795/virtual-scrolling-on-javascript
// https://jsfiddle.net/SDa2B/4/?utm_source=website&utm_medium=embed&utm_campaign=SDa2B
// https://jsfiddle.net/jpeter06/ao464o8g/
