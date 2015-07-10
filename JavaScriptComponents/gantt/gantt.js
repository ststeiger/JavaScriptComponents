
function cGantt(parent, id, cfg, dta)
{
	var i,j,psvg,maxLabelLen;
	
	cfg.axis.x.domain.start = Date.parse(cfg.axis.x.domain.start);
	cfg.axis.x.domain.end = Date.parse(cfg.axis.x.domain.end);
	
	psvg = SVG.create(id, cfg.width, cfg.height);
	parent.appendChild( psvg );
	
	
	function overlaps(a)
	{	
		return (a.TSK_To >= cfg.axis.x.domain.start) && (a.TSK_From <= cfg.axis.x.domain.end);
	}
	
	
	maxLabelLen = 0;
	
	for(i = dta.length -1; i > -1; --i)
	{
		for(j= dta[i].tasks.length-1; j > -1; --j)
		{
			dta[i].tasks[j].TSK_From = Date.parse( dta[i].tasks[j].TSK_From );
			dta[i].tasks[j].TSK_To = Date.parse ( dta[i].tasks[j].TSK_To )
			
			if(!overlaps(dta[i].tasks[j]))
				dta[i].tasks.splice(j, 1);
			else
			{
				dta[i].tasks[j].TSK_From = Math.max(dta[i].tasks[j].TSK_From, cfg.axis.x.domain.start);
				dta[i].tasks[j].TSK_To = Math.min(dta[i].tasks[j].TSK_To, cfg.axis.x.domain.end);
			}
		} // Next j
		
		if(dta[i].tasks.length == 0)
		{
			dta[i].splice(i, 1);
			continue;
		}
		
		maxLabelLen = Math.max(maxLabelLen, SVG.measureText(psvg, dta[i].user.username, cfg.axis.y.ticks.text));
		
		
		dta[i].tasks.sort(
			function(dir, a, b) 
			{
				if(dir === "DESC")
					return b.TSK_From - a.TSK_From; // DESC
				
				return a.TSK_From - b.TSK_From; // ASC
			}.bind(null, "ASC") 
		);
		
	} // Next i
	
	// Dynamic label length:
	// console.log(maxLabelLen);
	var padding = 5;
	var labelPos = maxLabelLen + cfg.axis.y.ticks.size + 5 + padding;
	if( cfg.axis.x.start.x < labelPos)
	{
		cfg.axis.x.start.x = labelPos;
		cfg.axis.y.start.x = labelPos;
		cfg.axis.y.end.x = labelPos;
	}
	
	
	dta.sort(function(a, b) {
			// console.log("a: " + JSON.stringify(a) );
			// console.log("b: " + JSON.stringify(b) );
			return a.user.username > b.user.username; // ASC
		}
	);
	
	
	
	
	
	// console.log(JSON.stringify(dta, null, 2));
	
	
	var objGantt = {
		 config: cfg
		,data: dta
		,svg: psvg
		 
		,axis:
		{
			 x:
			 {
				len: function()
				{
					return (objGantt.config.axis.x.end.x - objGantt.config.axis.x.start.x);
				} 
			 }
			
			,y:
			{
				len: function()
				{
					return (objGantt.config.axis.y.end.y - objGantt.config.axis.y.start.y);
				} 
				
				,tickDistance: function()
				{
					//return this.len()/objGantt.config.axis.y.ticks.count;
					return this.len()/objGantt.data.length;
				}
				
				,barSize: function()
				{
					var td = this.tickDistance();
					td *=  0.61803398875; //0.38196601125; // (GoldenRatio⁻²)
					// td *=  0.38196601125; // (GoldenRatio⁻²)
					
					return td;
				}
				
			}
			
		} // End axis
		
		,domain:
		{
			len: function()
			{
				return objGantt.config.axis.x.domain.end - objGantt.config.axis.x.domain.start;
			}
			
			,project: function(dateValue)
			{
				if(typeof(dateValue) === 'string')
					dateValue = Date.parse(dateValue);
				// console.log("date: " + dateValue);
				
				var deltaT = dateValue - objGantt.config.axis.x.domain.start; 
				
				// console.log(this);						
				var deltaTpc = (deltaT / this.len());
				// console.log("start: " + objGantt.config.axis.x.domain.start);
				// console.log("deltaT: " + deltaT);
				// console.log("domLen: " + this.domain.len());
				
				// console.log("Percent: " + deltaTpc*100);
				
				// var ov = new Date( objGantt.config.axis.x.domain.start.getTime() + deltaT);
				// console.log("origValue: " + ov);
				// console.log("xLen: " + this.len() );
				
				var ret = objGantt.config.axis.x.start.x + objGantt.axis.x.len() * deltaTpc;
				// console.log("ret: " + ret);
				return ret;
			}
			
		} // End obj domain
		
		,"createChart": function(id)
		{
			// var svg = SVG.create(id, this.config.width, this.config.height);
			// document.body.appendChild( svg );
			// this.svg = svg;
			
			var svg = this.svg;
	
			
			// console.log(svg.getSVGDocument());
			// console.log(svg.contentDocument.rootElement);
			// console.log(svg.rootElement);
			
			var xAxis = SVG.createGroup("xAxis");
			var yAxis = SVG.createGroup("yAxis");
			var chart = SVG.createGroup("chart");
			
			svg.appendChild( chart );
			svg.appendChild( xAxis );
			svg.appendChild( yAxis );
			
			// xAxis.appendChild( SVG.createLine(10, 200, 550, 200, "red") );
			xAxis.appendChild( SVG.createLine( this.config.axis.x.start.x, this.config.axis.x.start.y, this.config.axis.x.end.x, this.config.axis.x.end.y, this.config.axis.x.color) );
			
			// yAxis.appendChild( SVG.createLine(10, 10, 10, 200, "green") );
			yAxis.appendChild( SVG.createLine( this.config.axis.y.start.x, this.config.axis.y.start.y, this.config.axis.y.end.x, this.config.axis.y.end.y, this.config.axis.y.color) );
			
			
			var i, j;
			
			for(i = 0; i < 12; ++i)
			{
				this.config.axis.x.labels.push( new Date(2015, i, 01) );
			}
			this.config.axis.x.labels.push(this.config.axis.x.domain.end);
			
			
			for(i = 0; i < this.config.axis.x.labels.length; ++i)
			{
				j = this.domain.project(this.config.axis.x.labels[i]);
				xAxis.appendChild( SVG.createLine(j, this.config.axis.x.start.y, j, this.config.axis.x.start.y + this.config.axis.x.ticks.size, this.config.axis.x.color) );
				
				if(i > 0)
				{
					j = (this.domain.project(this.config.axis.x.labels[i - 1]) + this.domain.project(this.config.axis.x.labels[i]))/2.0;
					// console.log(this.config.axis.x.labels[i - 1]);
					
					xAxis.appendChild( SVG.createText(j, this.config.axis.x.start.y + this.config.axis.x.ticks.size*3, this.config.i18n.months[i] + ".\n" + this.config.axis.x.labels[i - 1].getFullYear(), this.config.axis.x.ticks.text) );
				}
				
			} // Next i
			
			
			for(i = 0; i < this.data.length+1; ++i)
			{
				j = this.config.axis.y.start.y + i* this.axis.y.tickDistance();
				yAxis.appendChild( SVG.createLine( this.config.axis.y.start.x - this.config.axis.y.ticks.size, j, this.config.axis.y.start.x, j, this.config.axis.y.color) );
				
				if(i)
				{
					var label = (this.data.length >= i ? this.data[i-1].user.username : "P["+i+"]");
					j -= this.axis.y.tickDistance()/2.0;
					// yAxis.appendChild( SVG.createLine( this.config.axis.y.start.x - this.config.axis.y.ticks.size, j, this.config.axis.y.start.x, j, "hotpink") );
					
					yAxis.appendChild( SVG.createText( this.config.axis.y.start.x - this.config.axis.y.ticks.size - 5, j, label, this.config.axis.y.ticks.text) );
				}
				
			} // Next i 
			
			
			////////////////////
			
			// console.log( JSON.stringify(this.data) );
			
			for(i=0; i < this.data.length; ++i)
			{
				// console.log( JSON.stringify( this.data[i].tasks ) );
				
				this.data[i].tasks.map(function(tsk)
					{
						// console.log(tsk);
						// console.log(tsk.TSK_UID);
						// console.log(tsk.TSK_Desk);
						// console.log(tsk.TSK_From);
						// console.log(tsk.TSK_To);
						// console.log("map " + i);
						// console.log("user: " + this.data[i].user.userid);
						// console.log("username " + this.data[i].user.username);
						
						var na1 = this.domain.project( tsk.TSK_From );
						var na2 = this.domain.project( tsk.TSK_To );
						
						j = this.config.axis.y.start.y + i* this.axis.y.tickDistance();
						j += this.axis.y.tickDistance()/2.0 - this.axis.y.barSize()/2.0;
						
						// console.log("j: " + j);
						chart.appendChild( SVG.createRectangle(na1, j, na2 - na1, this.axis.y.barSize(), tsk.color ) );
					}.bind(this)
				); // End map
				
			} // Next i
			
		} // End Function createChart
		
		,"serialize": function()
		{
			return SVG.serialize(this.svg);
		}
		
		
		,Methods: 
		{
			 createAnalogColor: function(i, n)
			{
				return colorTool.hsv2hex([i*360/n, 100, 95]);
			}
			
			,createMonochromaticColor: function(i, n, baseColor)
			{
				var color = colorTool.hex2hsv(baseColor);
				color[2] = 100;
				var increase = color[2] < 50 ? (100 - color[2])/n : -color[2]/n;
				
				// console.log(increase);
				if(increase < 0)
					increase = increase < -15 ? -15 : increase;
				else
					increase = increase > 15 ? 15 : increase;
				
				color[2] = color[2] + i * increase;
				return	colorTool.hsv2hex(color);
			} // End Function createMonochromaticColor
			
			,generateColors: function()
			{
				var cols = [];
				
				for(j = 0; j < objGantt.data.length; ++j)
				{
					cols[j] = [];
					
					var bc = objGantt.Methods.createAnalogColor(j, objGantt.data.length);
					for(i=0; i < objGantt.data[j].tasks.length; ++i)
					{
						objGantt.data[j].tasks[i].color = objGantt.Methods.createMonochromaticColor(i, objGantt.data[j].tasks.length, bc);
						cols[j].push( objGantt.Methods.createMonochromaticColor(i, objGantt.data[j].tasks.length, bc) );
					} // Next i
					
				} // Next j
				
				// console.log( JSON.stringify( objGantt.data ) );
				return cols;
			} // End Function generateColors
			
			,showData: function() 
			{
				// console.log("sd");
				// console.log(this); // c'Gantt, not var
				console.log(JSON.stringify( objGantt.config ) );
				console.log(JSON.stringify( objGantt.data ) );
			}.bind(this)
			
		} // End obj Methods
		
	} // End obj objGantt 
	
	objGantt.Methods.generateColors();
	objGantt.createChart(id);
	
	return objGantt;
}
