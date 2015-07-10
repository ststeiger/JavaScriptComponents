
var SVG = 
{
		 svgNS : "http://www.w3.org/2000/svg" 
		 
		,"test" : function()
		{
				alert(this.svgNS);
		}
		
		,"create": function(id, width, height, style)
		{
			if(!style)
				style = "border: 1px solid black";
			
			var svg = document.createElementNS(this.svgNS, "svg");
			svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
			
			svg.setAttribute("id", id);
			svg.setAttribute("width", width);
			svg.setAttribute("height", height);
			svg.setAttribute("viewBox", "0 0 " + width + " " + height);
			svg.setAttribute("style", style);
			
			return svg;
		}
		
		,"createGroup": function(id)
		{
			var g = document.createElementNS(this.svgNS, "g");
			g.setAttribute("id", id);
			g.setAttribute("shape-rendering", 'inherit');
			g.setAttribute("pointer-events", 'all');
			
			return g;
		}
		
		,"createText": function(x, y, text, textStyle)
		{
			var myText = document.createElementNS(this.svgNS, "text");
			// myText.setAttributeNS(null,"id", "mycircle");
			myText.setAttributeNS(null,"x", x);
			myText.setAttributeNS(null,"y", y);
			
			if(!textStyle.fill)
				myText.setAttributeNS(null,"fill", "hotpink");
				
			// myText.setAttributeNS(null,"stroke", "none");
			// myText.setAttributeNS(null,"stroke-width", "2px");
			
			// myText.setAttribute("font-family", "Verdana");
			// myText.setAttribute("font-size", "12px");
			// // myText.setAttribute("text-anchor", "middle");
			// myText.setAttribute("text-anchor", "end");
			// myText.setAttribute("dy", "-0.4em");
			
			if(textStyle)
			{
				for (var style in textStyle) 
				{
					if (textStyle.hasOwnProperty(style)) 
					{
						// console.log(name);
						// console.log(textStyle[name]);
						if(textStyle[style] != null)
							myText.setAttribute(style, textStyle[style]);
					} // End if (textStyle.hasOwnProperty(style)) 
					
				} // Next style 
				
			} // End if(textStyle)
			
			
			// text ="allo monde\nhello world\nhallo welt\nprivet mir";
			// text = "allo monde hello world privet mir";
			// text = text.replace(/(?:\r\n|\r|\n)/g, '<br />');
			
			// myText.textContent = text;
			
			if(text)
			{
				text = text.replace(/(?:\r\n|\r|\n)/g, '\n');
				var texts = text.split("\n");
				for(var i = 0; i < texts.length; ++i)
				{
					this.appendSpan(myText, texts[i], i==0 ? null: "15px");
				} // Next i
					
			} // End if(text)
			
			// myText.insertAdjacentHTML("beforeend", "hhh");					
			return myText;
		}
		
		,"appendSpan": function(ele, text, dy)
		{
			// SVG.appendSpan(elementToAppendTo, "another line");
			var span1 = document.createElementNS(this.svgNS, "tspan");
			
			span1.setAttribute("x", ele.getAttribute("x"));
			if(dy)
				span1.setAttribute("dy", dy);
			
			span1.textContent = text;			
			ele.appendChild(span1);
		}
		
		,clone: function(obj)
		{
			if(obj === null || typeof(obj) !== 'object' || 'isActiveClone' in obj)
				return obj;

			var temp = obj.constructor(); // changed

			for(var key in obj) 
			{
				if(Object.prototype.hasOwnProperty.call(obj, key)) 
				{
					obj['isActiveClone'] = null;
					temp[key] = clone(obj[key]);
					delete obj['isActiveClone'];
				}
			}    

			return temp;	
		}
		
		
		,"measureText": function(doc, strText, refTextStyle)
		{
			var width;
			var textStyle = this.clone(refTextStyle);
			
            if(textStyle)
				textStyle.visibility = "hidden"; //textStyle.display = "none";
			else
				textStyle = { "visibility": "hidden" };
			
            var text = this.createText(100, 100, strText, textStyle);
            // console.log(" Width before appendChild: "+  text.getComputedTextLength());      
            var el = doc.appendChild(text);
            width = el.getComputedTextLength();
            doc.removeChild(el);
            
            // console.log(" Width after appendChild: "+  width);
            return width;
		} // End Function
		
		,"createCircle": function(cx, cy, r)
		{
			var myCircle = document.createElementNS(this.svgNS, "circle");
			// myCircle.setAttributeNS(null,"id", "mycircle");
			myCircle.setAttributeNS(null,"cx", cx);
			myCircle.setAttributeNS(null,"cy", cy);
			myCircle.setAttributeNS(null,"r", r);
			myCircle.setAttributeNS(null,"fill", "black");
			myCircle.setAttributeNS(null,"stroke", "none");
			
			return myCircle;
		}
		
		,"createRectangle": function(x, y, width, height, color)
		{
			var rect = document.createElementNS(this.svgNS, "rect");
			rect.setAttribute("x", x);
			rect.setAttribute("y", y);
			rect.setAttribute("width", width);
			rect.setAttribute("height", height);
			
			if(color)
				rect.setAttribute("fill", color);
			else
				rect.setAttribute("fill", "#95B3D7");
			
			return rect;
		}
		
		,"createLine": function(x1, y1, x2, y2, color)
		{
			var line = document.createElementNS(this.svgNS, "line");
			line.setAttribute("x1", x1);
			line.setAttribute("y1", y1);
			line.setAttribute("x2", x2);
			line.setAttribute("y2", y2);
			
			if(color)
				line.setAttribute("stroke", color);
			else
				line.setAttribute("stroke", "#FF00FF");
				
			line.setAttribute("stroke-width", "1px");
			line.setAttribute("shape-rendering", "crispEdges");
			
			return line;
		}
		
		,"serialize": function(svg)
		{	
			var markup = null;
			
			if(svg.contentDocument)
				markup = (new XMLSerializer()).serializeToString(svg.contentDocument.rootElement);
			else
				markup = (new XMLSerializer()).serializeToString(svg);
				
			console.log(markup);
			return markup;
		}
};
