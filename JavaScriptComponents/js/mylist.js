'use strict';
var MyList = (function () {
    function MyList(data) {
        this.createElements = this.createElements.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.m_data = data;
        this.m_numElements = data.length;
        this.m_elementHeight = 100;
        this.m_maxHeight = this.m_elementHeight * this.m_numElements;
        var vp = 1000;
        this.viewport = document.getElementById("viewport");
        this.content = document.getElementById("content");
        this.viewport.style.height = vp + "px";
        this.content.style.height = this.m_maxHeight + "px";
        this.createElements();
        this.viewport.addEventListener("scroll", this.onScroll);
    }
    MyList.prototype.createExampleData = function () {
        var data = [];
        for (var i = 0; i < 100; ++i) {
            data.push("OMG " + i);
        }
        console.log(JSON.stringify(data));
    };
    MyList.prototype.createElements = function () {
        for (var i = 0; i < this.m_data.length; ++i) {
            var div = document.createElement("div");
            div.appendChild(document.createTextNode(this.m_data[i]));
            var color = i % 2 == 0 ? "whitesmoke" : "white";
            div.setAttribute("style", "height: " + this.m_elementHeight + "px; background-color: " + color + "; border: 1px solid black; box-sizing: border-box;");
            this.content.appendChild(div);
        }
    };
    MyList.prototype.onScroll = function () {
        var scrollTop = viewport.scrollTop;
    };
    return MyList;
}());
