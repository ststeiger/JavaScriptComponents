
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace JavaScriptComponents.ajax
{


    /// <summary>
    /// Zusammenfassungsbeschreibung für Data
    /// </summary>
    public class Data : IHttpHandler
    {


        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            // http://transparency.org.nz/images/2014/CPI2014-map-and-country-results.jpg
            // http://says.com/my/fun/malaysia-maps-and-statistics
            // https://www.nuget.org/packages/BingGeocodingHelper/
            // http://acconuts.codeplex.com/
            // http://www.codeproject.com/Articles/262179/SVG-World-Map

            context.Response.Write("Hello World");
        }


        public bool IsReusable
        {
            get
            {
                return false;
            }
        }


    } // End Class Data 


}
