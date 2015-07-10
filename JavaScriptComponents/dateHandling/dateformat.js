

// https://github.com/datejs/Datejs/blob/master/src/globalization/en-US.js
var $i18n =
{
	// dayNames
    dN: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    // abbreviatedDayNames
    aD: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    // shortestDayNames: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    // firstLetterDayNames: ["S", "M", "T", "W", "T", "F", "S"],
	
	// MonthNames
    mN: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    
    // Abbreviated MonthNames
    aM: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
	
	// AM/PM designators
    am: "AM",
    pm: "PM",
}




var stringFormater =
{
    // Pad number with "0"
    p: function (val, len)
    {
        val = String(val);
        len = len || 2;
        while (val.length < len) val = "0" + val;
        return val;
    }
    
    // Pad Milliseconds with nx"0"
    , mp: function (d, n)
    {
        var i = 3, res = this.p(d.getMilliseconds(), 3).substr(0, n);

        for (; i < n; ++i)
            res += "0";

        return res;
    }
    
    , tzo: function (d)
    {
        var o = d.getTimezoneOffset();
        return (o > 0 ? "-" : "+") + this.p(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4)
    }
    
    , tz: function (date)
    {
        var timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        timezoneClip = /[^-+\dA-Z]/g;
        return (String(date).match(timezone) || [""]).pop().replace(timezoneClip, "");
    }

    , ord: function (num)
    {
        if (num <= 0)
            return num.toString();

        switch (num % 100)
        {
            case 11:
            case 12:
            case 13:
                return num + "th";
        }

        switch (num % 10)
        {
            case 1:
                return num + "st";
            case 2:
                return num + "nd";
            case 3:
                return num + "rd";
            default:
                return num + "th";
        }
        
    } // End Function ord
    
    ,"format": function(str, o) 
    {
        if (!str || !o)
            return str;
            
        str = str.toString();
        
        for (var k in o) 
			str = str.replace(new RegExp("\\{" + k + "\\}", "gi"), o[k]);
			
        return str
    } // End Function Format
    
    , "formatDate": function (x, formatString)
    {
        // "S dd'd'.MM (MMMM).yyyy ".replace(/(\\)?(dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|S)/g, 
        return formatString.replace(/d{1,4}|M{1,4}|f{1,7}|yy(?:yy)?|([HhmsTt])\1?|[oSZ]|"[^"]*"|'[^']*'/g,
            function (m)
            {
                var  p = this.p 
                    ,mp = this.mp.bind(this) 
                    ,tzo = this.tzo.bind(this) 
                    ,tz = this.tz.bind(this) 
                    ,ord = this.ord.bind(this);
                    
                x.s = x.getSeconds;
                x.m = x.getMinutes;
                x.h = x.getHours;
                x.d = x.getDay;
                x.D = x.getDate;
                x.M = x.getMonth;
                x.y = x.getFullYear;

                if (m.charAt(0) === "\\")
                {
                    return m.replace("\\", "");
                }

                switch (m)
                {
                    case "hh":
                        return p(x.h() < 13 ? (x.h() === 0 ? 12 : x.h()) : (x.h() - 12));
                    case "h":
                        return x.h() < 13 ? (x.h() === 0 ? 12 : x.h()) : (x.h() - 12);
                    case "HH":
                        return p(x.h());
                    case "H":
                        return x.h();
                    case "mm":
                        return p(x.m());
                    case "m":
                        return x.m();
                    case "ss":
                        return p(x.s());
                    case "s":
                        return x.s();
                    case "yyyy":
                        return p(x.y(), 4);
                    case "yy":
                        return p(x.y());
                    case "dddd":
                        return $i18n.dN[x.d()];
                    case "ddd":
                        return $i18n.aD[x.d()];
                    case "dd":
                        return p(x.D());
                    case "d":
                        return x.D();
                    case "MMMM":
                        return $i18n.mN[x.M()];
                    case "MMM":
                        return $i18n.aM[x.M()];
                    case "MM":
                        return p((x.M() + 1));
                    case "M":
                        return x.M() + 1;
                    case "t":
                        return (x.h() < 12 ? $i18n.am.substring(0, 1) : $i18n.pm.substring(0, 1)).toLowerCase();
                    case "tt":
                        return (x.h() < 12 ? $i18n.am : $i18n.pm).toLowerCase();;
                    case "T":
                        return x.h() < 12 ? $i18n.am.substring(0, 1) : $i18n.pm.substring(0, 1);
                    case "TT":
                        return x.h() < 12 ? $i18n.am : $i18n.pm;
                    case "S":
                        return ord(x.D());
                    case "fffffff":
                        return mp(x, 7);
                    case "ffffff":
                        return mp(x, 6);
                    case "fffff":
                        return mp(x, 5);
                    case "ffff":
                        return mp(x, 4);
                    case "fff":
                        return mp(x, 3);
                    case "ff":
                        return mp(x, 2);
                    case "f":
                        return mp(x, 1);
                    case "o":
                        return tzo(x);
                    case "Z":
                        return tz(x);
                    default:
                        return m;
                } // End Switch
            } // End Fn
            .bind(this)
            //.apply(this, arguments)
        );
    }

};





var x = new Date();
stringFormater.formatDate(x, "dddd (ddd)   S dd'd'.MM (MMM MMMM).yyyy HH:mm:ss.fff t tt T TT (o) {Z}")



stringFormater.format("hello {foo} name", { foo: "bar" })
