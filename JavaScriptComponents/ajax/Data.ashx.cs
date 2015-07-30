
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


        public static string StreamToString(System.IO.Stream stream)
        {
            stream.Position = 0;
            using (System.IO.StreamReader reader = new System.IO.StreamReader(stream, System.Text.Encoding.UTF8))
            {
                return reader.ReadToEnd();
            }
        }


        public class Municipality
        {
            public int id;
            public string name;
        }


        public static void SaveData(Municipality[] municipalitites)
        {
            System.Data.DataRow dr = null;
            string strSQL = string.Format("SELECT * FROM {0} WHERE (1=2) ", "__Gemeinden");

            using (System.Data.DataTable dt = SQL.GetDataTable(strSQL))
            {
                foreach (Municipality municipalitiy in municipalitites)
                {
                    dr = dt.NewRow();

                    dr["MUN_Id"] = municipalitiy.id;
                    dr["MUN_Name"] = municipalitiy.name;
                    
                    dt.Rows.Add(dr);
                } // Next file

                SQL.UpdateDataTable(dt, strSQL);
                System.Console.WriteLine(dt.Rows.Count); // 34'409
            } // End Using dt
        }
        

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            // http://transparency.org.nz/images/2014/CPI2014-map-and-country-results.jpg
            // http://says.com/my/fun/malaysia-maps-and-statistics
            // https://www.nuget.org/packages/BingGeocodingHelper/
            // http://acconuts.codeplex.com/
            // http://www.codeproject.com/Articles/262179/SVG-World-Map

            if (StringComparer.InvariantCultureIgnoreCase.Equals(System.Web.HttpContext.Current.Request.HttpMethod, "POST"))
            {
                string strJSON = StreamToString(System.Web.HttpContext.Current.Request.InputStream);
                System.Console.WriteLine(strJSON);
                Municipality[] municipalitites = Tools.JsonHelper.Deserialize<Municipality[]>(strJSON);
                SaveData(municipalitites);
                System.Console.WriteLine(municipalitites);
            }

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
