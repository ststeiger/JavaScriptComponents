
using System.Collections.Generic;


namespace Tools
{


    /// <summary>
    ///   A helper class for generating object graphs in 
    ///   JavaScript notation. Supports pretty printing.
    /// </summary>
    public class JsonHelper
    {
        public static string Serialize(object target)
        {
#if DEBUG
            return Serialize(target, true);
#else
		return Serialize(target, false);
#endif
        }


        public static T Deserialize<T>(string strValue)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<T>(strValue);
        }


        public static List<Dictionary<string, string>> Deserialize(string strValue)
        {
            Newtonsoft.Json.Linq.JArray tV = (Newtonsoft.Json.Linq.JArray)Deserialize<object>(strValue);
            List<Dictionary<string, string>> tR = new List<Dictionary<string, string>>();

            for (int tC = 0; tC <= tV.Count - 1; tC++)
            {
                try
                {
                    string tS = tV[tC].ToString();
                    tS = tS.Replace("[]", "null");

                    tR.Add(Deserialize<Dictionary<string, string>>(tS));
                }
                catch (System.Exception) // tE)
                {
                    // tR.Add(Deserialize<Dictionary<string, string>>(tV[tC].ToString()));
                }
            }

            return tR;
        }


        //Cynosura.Base.JsonHelper.SerializeUnpretty(target)
        public static string SerializeUnpretty(object target)
        {
            return SerializeUnpretty(target, null);
        }


        public static string SerializeUnpretty(object target, string strCallback)
        {
            return Serialize(target, false, null);
        }


        //Cynosura.Base.JsonHelper.SerializePretty(target)
        public static string SerializePretty(object target)
        {
            return SerializePretty(target, null);
        }


        public static string SerializePretty(object target, string strCallback)
        {
            return Serialize(target, true, strCallback);
        }


        public static string Serialize(object target, bool prettyPrint)
        {
            return Serialize(target, prettyPrint, null);
        }


        public static string Serialize(object target, bool prettyPrint, string strCallback)
        {
            string strResult = null;

            // http://james.newtonking.com/archive/2009/10/23/efficient-json-with-json-net-reducing-serialized-json-size.aspx
            Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings { NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore };
            if (!prettyPrint)
            {
                settings.Formatting = Newtonsoft.Json.Formatting.None;
            }
            else
            {
                settings.Formatting = Newtonsoft.Json.Formatting.Indented;
            }


            settings.DateFormatHandling = Newtonsoft.Json.DateFormatHandling.MicrosoftDateFormat;

            //context.Response.Write(strCallback + " && " + strCallback + "(")

            if (string.IsNullOrEmpty(strCallback))
            {
                strResult = Newtonsoft.Json.JsonConvert.SerializeObject(target, settings);
                // JSONP
            }
            else
            {
                // https://github.com/visionmedia/express/pull/1374
                //strResult = strCallback + " && " + strCallback + "(" + Newtonsoft.Json.JsonConvert.SerializeObject(target, settings) + "); " + Environment.NewLine
                //typeof bla1 != "undefined" ? alert(bla1(3)) : alert("foo undefined");
                strResult = "typeof " + strCallback + " != 'undefined' ? " + strCallback + "(" + Newtonsoft.Json.JsonConvert.SerializeObject(target, settings) + ") : alert('Callback-Funktion \"" + strCallback + "\" undefiniert...'); " + System.Environment.NewLine;
            }

            settings = null;
            return strResult;



            //Dim sbSerialized As New StringBuilder()
            //Dim js As New JavaScriptSerializer()

            //js.Serialize(target, sbSerialized)

            //If prettyPrint Then
            //    Dim prettyPrintedResult As New StringBuilder()
            //    prettyPrintedResult.EnsureCapacity(sbSerialized.Length)

            //    Dim pp As New JsonPrettyPrinter()
            //    pp.PrettyPrint(sbSerialized, prettyPrintedResult)

            //    Return prettyPrintedResult.ToString()
            //Else
            //    Return sbSerialized.ToString()
            //End If
        }


        public static Dictionary<string, object> NvcToDictionary(System.Collections.Specialized.NameValueCollection nvc, bool handleMultipleValuesPerKey = true)
        {
            Dictionary<string, object> result = new Dictionary<string, object>();
            foreach (string key in nvc.Keys)
            {
                if (handleMultipleValuesPerKey)
                {
                    string[] values = nvc.GetValues(key);
                    if ((values.Length == 1))
                    {
                        result.Add(key, values[0]);
                    }
                    else
                    {
                        result.Add(key, values);
                    }
                }
                else
                {
                    result.Add(key, nvc[key]);
                }
            }
            return result;
        }


        public static Dictionary<string, object> sessionToDictionary(System.Web.SessionState.HttpSessionState nvc)
        {
            Dictionary<string, object> result = new Dictionary<string, object>();
            foreach (string key in nvc.Keys)
            {
                result.Add(key, nvc[key]);
            }
            return result;
        }


    }


} 
