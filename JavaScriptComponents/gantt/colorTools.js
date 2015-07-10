
var colorTool = 
{
	  a: "h"
	 ,toArr: function(e) 
	 {
		var t = [];
		return e && "object" != typeof e ? -1 !== e.indexOf(",") ? t = e.split(",") : t.push(e) : t = e, t;
	 }
	 
	,hex2rgb:function(x)
	{
		var ph = function(h){ return parseInt(h, 16); }
		x = x.substr(0,1) === "#" ? x.substr(1): x;
		return (x.length === 3) ? [ph(x[0]+x[0]),ph(x[1]+x[1]),ph(x[2]+x[2])] 
		: [ph(x.substr(0,2)),ph(x.substr(2,2)),ph(x.substr(4,2))];
	}
	
	,rgb2hex:function(x)
	{
		str = "#";
		for(var i=0; i < 3; ++i)
			str += (x[i]<16?"0": "") + x[i].toString(16);
		
		return str;
	}
	
	,rgb2hsv: function(t) 
	{
		if(typeof(t) === "string")
			t = this.hex2rgb(t);
		
		t = this.toArr(t);
		var r, n, a = t[0],
			o = t[1],
			i = t[2],
			u = Math.min(a, o, i),
			s = Math.max(a, o, i),
			l = s - u,
			h = s;
		return h = Math.floor(s / 255 * 100), 0 === s ? [0, 0, 0] : (n = Math.floor(l / s * 100), r = 0 === l ? 0 : a === s ? (o - i) / l : o === s ? 2 + (i - a) / l : 4 + (a - o) / l, r = Math.floor(60 * r), 0 > r && (r += 360), [r, n, h])
	} // End Function rgb2hsv
	
	,hex2hsv: function(t) 
	{
		return this.rgb2hsv( this.hex2rgb(t) ) ;
	}
	
	
	,hsv2rgb: function(t) 
	{
		t = this.toArr(t);
		var r, n, a, o, i, u, s, l, h = t[0], c = t[1],f = t[2];
		if (h = Math.max(0, Math.min(360, h)), c = Math.max(0, Math.min(100, c)), f = Math.max(0, Math.min(100, f)), c /= 100, f /= 100, h = 360 === h ? 0 : h, 0 === c) 
			return r = n = a = f, [Math.round(255 * r), Math.round(255 * n), Math.round(255 * a)];
			
		switch (h /= 60, o = Math.floor(h), i = h - o, u = f * (1 - c), s = f * (1 - c * i), l = f * (1 - c * (1 - i)), o) 
		{
			case 0:
				r = f, n = l, a = u;
				break;
			case 1:
				r = s, n = f, a = u;
				break;
			case 2:
				r = u, n = f, a = l;
				break;
			case 3:
				r = u, n = s, a = f;
				break;
			case 4:
				r = l, n = u, a = f;
				break;
			case 5:
				r = f, n = u, a = s
		} // End Switch 
		return r = Math.round(255 * r), n = Math.round(255 * n), a = Math.round(255 * a), [r, n, a];
	} // End Function hsv2rgb
	
	,hsv2hex:function(t)
	{
		return this.rgb2hex(this.hsv2rgb(t));
	}
	
	,rgb2hsl: function(t) 
	{
		if(typeof(t) === "string")
			t = this.hex2rgb(t);
		
		t = this.toArr(t);
		var r = t[0],
			n = t[1],
			a = t[2];
			
		r /= 255, n /= 255, a /= 255;
		
		var o, i, 
			u = Math.max(r, n, a),
			s = Math.min(r, n, a),
			l = (u + s) / 2;
		
		if (u === s) 
			o = i = 0;
		else 
		{
			var h = u - s;
			switch (i = l > .5 ? h / (2 - u - s) : h / (u + s), u) 
			{
				case r:
					o = (n - a) / h + (a > n ? 6 : 0);
					break;
				case n:
					o = (a - r) / h + 2;
					break;
				case a:
					o = (r - n) / h + 4;
			}
			o /= 6;
		} // End Else
		
		return [o, i, l];
	} // End Function rgb2hsl
	
	,hsl2rgb: function(t) 
	{
		function r(e, t, r) 
		{
			return 0 > r && (r += 1), r > 1 && (r -= 1), 1 / 6 > r ? e + 6 * (t - e) * r : .5 > r ? t : 2 / 3 > r ? e + (t - e) * (2 / 3 - r) * 6 : e;
		}
		t = this.toArr(t);
		var n, a, o, i = t[0],
			u = t[1],
			s = t[2];
		if (0 === u) 
			n = a = o = s;
		else 
		{
			var l = .5 > s ? s * (1 + u) : s + u - s * u,
				h = 2 * s - l;
			n = r(h, l, i + 1 / 3), a = r(h, l, i), o = r(h, l, i - 1 / 3);
		}
		
		return [255 * n, 255 * a, 255 * o];
	}
	
	
	,hsl2hex:function(t)
	{
		return this.rgb2hex(this.hsl2rgb(t));
	}
	
	
};

var colorTool = 
{
	  a: "h"
	 ,toArr: function(e) 
	 {
		var t = [];
		return e && "object" != typeof e ? -1 !== e.indexOf(",") ? t = e.split(",") : t.push(e) : t = e, t;
	 }
	 
	,hex2rgb:function(x)
	{
		var ph = function(h){ return parseInt(h, 16); }
		x = x.substr(0,1) === "#" ? x.substr(1): x;
		return (x.length === 3) ? [ph(x[0]+x[0]),ph(x[1]+x[1]),ph(x[2]+x[2])] 
		: [ph(x.substr(0,2)),ph(x.substr(2,2)),ph(x.substr(4,2))];
	}
	
	,rgb2hex:function(x)
	{
		str = "#";
		for(var i=0; i < 3; ++i)
			str += (x[i]<16?"0": "") + x[i].toString(16);
		
		return str;
	}
	
	,rgb2hsv: function(t) 
	{
		if(typeof(t) === "string")
			t = this.hex2rgb(t);
		
		t = this.toArr(t);
		var r, n, a = t[0],
			o = t[1],
			i = t[2],
			u = Math.min(a, o, i),
			s = Math.max(a, o, i),
			l = s - u,
			h = s;
		return h = Math.floor(s / 255 * 100), 0 === s ? [0, 0, 0] : (n = Math.floor(l / s * 100), r = 0 === l ? 0 : a === s ? (o - i) / l : o === s ? 2 + (i - a) / l : 4 + (a - o) / l, r = Math.floor(60 * r), 0 > r && (r += 360), [r, n, h])
	} // End Function rgb2hsv
	
	,hex2hsv: function(t) 
	{
		return this.rgb2hsv( this.hex2rgb(t) ) ;
	}
	
	
	,hsv2rgb: function(t) 
	{
		t = this.toArr(t);
		var r, n, a, o, i, u, s, l, h = t[0], c = t[1],f = t[2];
		if (h = Math.max(0, Math.min(360, h)), c = Math.max(0, Math.min(100, c)), f = Math.max(0, Math.min(100, f)), c /= 100, f /= 100, h = 360 === h ? 0 : h, 0 === c) 
			return r = n = a = f, [Math.round(255 * r), Math.round(255 * n), Math.round(255 * a)];
			
		switch (h /= 60, o = Math.floor(h), i = h - o, u = f * (1 - c), s = f * (1 - c * i), l = f * (1 - c * (1 - i)), o) 
		{
			case 0:
				r = f, n = l, a = u;
				break;
			case 1:
				r = s, n = f, a = u;
				break;
			case 2:
				r = u, n = f, a = l;
				break;
			case 3:
				r = u, n = s, a = f;
				break;
			case 4:
				r = l, n = u, a = f;
				break;
			case 5:
				r = f, n = u, a = s
		} // End Switch 
		return r = Math.round(255 * r), n = Math.round(255 * n), a = Math.round(255 * a), [r, n, a];
	} // End Function hsv2rgb
	
	,hsv2hex:function(t)
	{
		return this.rgb2hex(this.hsv2rgb(t));
	}
	
	,rgb2hsl: function(t) 
	{
		if(typeof(t) === "string")
			t = this.hex2rgb(t);
		
		t = this.toArr(t);
		var r = t[0],
			n = t[1],
			a = t[2];
			
		r /= 255, n /= 255, a /= 255;
		
		var o, i, 
			u = Math.max(r, n, a),
			s = Math.min(r, n, a),
			l = (u + s) / 2;
		
		if (u === s) 
			o = i = 0;
		else 
		{
			var h = u - s;
			switch (i = l > .5 ? h / (2 - u - s) : h / (u + s), u) 
			{
				case r:
					o = (n - a) / h + (a > n ? 6 : 0);
					break;
				case n:
					o = (a - r) / h + 2;
					break;
				case a:
					o = (r - n) / h + 4;
			}
			o /= 6;
		} // End Else
		
		return [o, i, l];
	} // End Function rgb2hsl
	
	,hsl2rgb: function(t) 
	{
		function r(e, t, r) 
		{
			return 0 > r && (r += 1), r > 1 && (r -= 1), 1 / 6 > r ? e + 6 * (t - e) * r : .5 > r ? t : 2 / 3 > r ? e + (t - e) * (2 / 3 - r) * 6 : e;
		}
		t = this.toArr(t);
		var n, a, o, i = t[0],
			u = t[1],
			s = t[2];
		if (0 === u) 
			n = a = o = s;
		else 
		{
			var l = .5 > s ? s * (1 + u) : s + u - s * u,
				h = 2 * s - l;
			n = r(h, l, i + 1 / 3), a = r(h, l, i), o = r(h, l, i - 1 / 3);
		}
		
		return [255 * n, 255 * a, 255 * o];
	}
	
	
	,hsl2hex:function(t)
	{
		return this.rgb2hex(this.hsl2rgb(t));
	}
	
	
};
