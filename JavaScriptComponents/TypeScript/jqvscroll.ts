
// [=] - real scrollable height (h)
// [-] - "pages";  total height of all (n) pages is (th) = (ph) * (n)

// The overlap between pages is (cj) and is the distance the scrollbar
// will jump when we adjust the scroll position during page switch.

// To keep things smooth, we need to minimize both (n) and (cj).
// Setting (ph) at 1/100 of (h) is a good start.


let th = 1000000000;            // virtual height
let h = 1000000;                // real scrollable height
let ph = h / 100;               // page height
let n = Math.ceil(th / ph);     // number of pages
let vp = 400;                   // viewport height
let rh = 50;                    // row height
let cj = (th - h) / (n - 1);    // "jumpiness" coefficient

let page = 0;                   // current page
let offset = 0;                 // current page offset
let prevScrollTop = 0;

let rows = {};                  // cached row nodes
let viewport, content;


function autoRun() 
{
    // Polyfill
    if (!('remove' in Element.prototype))
    {
        Element.prototype.remove = function ()
        {
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


function onScroll() 
{
    let scrollTop = viewport.scrollTop;

    if (Math.abs(scrollTop - prevScrollTop) > vp)
        onJump();
    else
        onNearScroll();

    renderViewport();
    logDebugInfo();
}

function onNearScroll()
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


function onJump()
{
    let scrollTop = viewport.scrollTop;
    page = Math.floor(scrollTop * ((th - vp) / (h - vp)) * (1 / ph));
    offset = Math.round(page * cj);
    prevScrollTop = scrollTop;

    removeAllRows();
}


function removeAllRows()
{
    for (let i in rows) 
    {
        rows[i].remove();
        delete rows[i];
    }
}


function renderViewport()
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
            console.log(rows[i].__proto__)

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


function renderRow(row) 
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


interface IDebugInterface
{
    append?: (txt: string) => DocumentFragment & IDebugInterface;
}

function logDebugInfo() 
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


// https://stackoverflow.com/questions/39248795/virtual-scrolling-on-javascript
// https://jsfiddle.net/SDa2B/4/?utm_source=website&utm_medium=embed&utm_campaign=SDa2B
// https://jsfiddle.net/jpeter06/ao464o8g/
