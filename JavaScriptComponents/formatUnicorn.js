
// http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format


String.prototype.formatUnicorn = function() 
{
        var str = this.toString();
        if (!arguments.length) 
                return str;

        var t = typeof arguments[0],
            args = "string" == t || "number" == t ? Array.prototype.slice.call(arguments) : arguments[0];
        
        for (var arg in args) 
             str = str.replace(new RegExp("\\{" + arg + "\\}", "gi"), args[arg]);

        return str
}

"hello {foo} name".formatUnicorn({foo: "bar"});



12.345.toFixed(2); // returns "12.35" (rounding!)
12.3.toFixed(2); // returns "12.30" (zero padding)

The equivalent of sprintf("%.2e", num) is num.toExponential(2).

33333 .toExponential(2); // "3.33e+4"

// Hex: 
3735928559 .toString(16); // to base 16: "deadbeef"
parseInt("deadbeef", 16); // from base 16: 3735928559


// toFixed(n) provides n length after the decimal point; toPrecision(x) provides x total length.
// toPrecisison
var num = 13.3714;
var n = num.toPrecision(2);
The result of n will be 13



-----


String.form = function(str, arr) {
    var i = -1;
    function callback(exp, p0, p1, p2, p3, p4) {
        if (exp=='%%') return '%';
        if (arr[++i]===undefined) return undefined;
        var exp  = p2 ? parseInt(p2.substr(1)) : undefined;
        var base = p3 ? parseInt(p3.substr(1)) : undefined;
        var val;
        switch (p4) {
            case 's': val = arr[i]; break;
            case 'c': val = arr[i][0]; break;
            case 'f': val = parseFloat(arr[i]).toFixed(exp); break;
            case 'p': val = parseFloat(arr[i]).toPrecision(exp); break;
            case 'e': val = parseFloat(arr[i]).toExponential(exp); break;
            case 'x': val = parseInt(arr[i]).toString(base?base:16); break;
            case 'd': val = parseFloat(parseInt(arr[i], base?base:10).toPrecision(exp)).toFixed(0); break;
        }
        val = typeof(val)=='object' ? JSON.stringify(val) : val.toString(base);
        var sz = parseInt(p1); /* padding size */
        var ch = p1 && p1[0]=='0' ? '0' : ' '; /* isnull? */
        while (val.length<sz) val = p0 !== undefined ? val+ch : ch+val; /* isminus? */
       return val;
    }
    var regex = /%(-)?(0?[0-9]+)?([.][0-9]+)?([#][0-9]+)?([scfpexd])/g;
    return str.replace(regex, callback);
}

String.prototype.$ = function() {
    return String.form(this, Array.prototype.slice.call(arguments));
}
Here are a few examples:

String.format("%s %s", [ "This is a string", 11 ]))
console.out("%s %s".$("This is a string", 11))
var arr = [ "12.3", 13.6 ]; console.out("Array: %s".$(arr));
var obj = { test:"test", id:12 }; console.out("Object: %s".$(obj));
console.out("%c", "Test");
console.out("%5d".$(12)); // '   12'
console.out("%05d".$(12)); // '00012'
console.out("%-5d".$(12)); // '12   '
console.out("%5.2d".$(123)); // '  120'
console.out("%5.2f".$(1.1)); // ' 1.10'
console.out("%10.2e".$(1.1)); // '   1.10e+0'
console.out("%5.3p".$(1.12345)); // ' 1.12'
console.out("%5x".$(45054)); // ' affe'
console.out("%20#2x".$("45054")); // '    1010111111111110'
console.out("%6#2d".$("111")); // '     7'
console.out("%6#16d".$("affe")); // ' 45054'



// -------------------------



function formatUnicorn(in) 
{
	var str = in.toString();
	if (!arguments.length) 
		return str;
	
	var t = typeof arguments[0],
	    args = "string" == t || "number" == t ? Array.prototype.slice.call(arguments) : arguments[0];
	
	for (var arg in args) 
	     str = str.replace(new RegExp("\\{" + arg + "\\}", "gi"), args[arg]);
	
	return str
}
