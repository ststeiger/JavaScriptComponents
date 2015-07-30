
namespace JavaScriptComponents
{


    public class SQL
    {

        public static string GetConnectionString()
        {
            System.Data.SqlClient.SqlConnectionStringBuilder csb = new System.Data.SqlClient.SqlConnectionStringBuilder();
            csb.DataSource = System.Environment.MachineName;
            // csb.DataSource = "CORDB2008R2";
            // csb.DataSource = "CORDB2014";
            
            if (System.StringComparer.InvariantCultureIgnoreCase.Equals("RZ", System.Environment.UserDomainName))
                csb.DataSource = "SQL02";

            csb.InitialCatalog = "TestDb";

            csb.IntegratedSecurity = true;
            if (!csb.IntegratedSecurity)
            {
                csb.UserID = "TestWebServices";
                csb.Password = "";
            } // End if (!csb.IntegratedSecurity)

            csb.PacketSize = 4096;
            csb.Pooling = false;
            csb.ApplicationName = "JavaScriptComponents";
            csb.ConnectTimeout = 5;
            csb.Encrypt = false;
            csb.MultipleActiveResultSets = false;
            csb.PersistSecurityInfo = false;
            csb.Replication = false;
            csb.WorkstationID = System.Environment.MachineName;

            return csb.ConnectionString;
        } // End Function GetDataAdapter


        public static System.Data.Common.DbConnection GetConnection()
        {
            return new System.Data.SqlClient.SqlConnection(GetConnectionString());
        } // End Function GetConnection 


        public static bool Log(System.Exception ex)
        {
            return Log(null, ex, null);
        } // End Function Log 


        public static bool Log(System.Exception ex, System.Data.IDbCommand cmd)
        {
            return Log(null, ex, cmd);
        } // End Function Log


        public static bool Log(string str, System.Exception ex, System.Data.IDbCommand cmd)
        {
            System.Console.WriteLine(str);
            System.Console.WriteLine(ex.Message);

            if(cmd != null)
                System.Console.WriteLine(cmd.CommandText);

            return true;
        } // End Function Log


        protected static System.Data.Common.DbDataAdapter GetDataAdapter(string strSQL)
        {
            return new System.Data.SqlClient.SqlDataAdapter(strSQL, GetConnectionString());
        } // End Function GetDataAdapter


        public static System.Data.DataSet GetDataSet(string strSQL)
        {
            System.Data.DataSet ds = new System.Data.DataSet();

            using (System.Data.Common.DbDataAdapter da = GetDataAdapter(strSQL))
            {
                da.Fill(ds);
            } // End Using da

            return ds;
        } // End Function GetDataSet


        public static System.Data.DataTable GetDataTable(System.Data.IDbCommand cmd)
        {
            System.Data.DataTable dt = new System.Data.DataTable();

            using (System.Data.SqlClient.SqlDataAdapter da = new System.Data.SqlClient.SqlDataAdapter((System.Data.SqlClient.SqlCommand)cmd))
            {
                cmd.Connection = GetConnection();

                da.Fill(dt);
            } // End Using da 

            return dt;
        } //End Function GetDataTable


        public static System.Data.DataTable GetDataTable(string strSQL)
        {
            System.Data.DataTable dt = null;

            using (System.Data.IDbCommand cmd = CreateCommand(strSQL))
            {
                dt = GetDataTable(cmd);
            } // End Using cmd 

            return dt;
        } //End Function GetDataTable


        public static System.Data.DataTable GetDataTable(string strSQL, int timeout)
        {
            System.Data.DataTable dt = null;

            using (System.Data.IDbCommand cmd = CreateCommand(strSQL, timeout))
            {
                dt = GetDataTable(cmd);
            } // End Using cmd 

            return dt;
        } //End Function GetDataTable


        public static System.Data.IDbCommand CreateCommand(string strSQL)
        {
            return CreateCommand(strSQL, 30);
        } // End Function CreateCommand


        public static System.Data.IDbCommand CreateCommand(string strSQL, int timeout)
        {
            System.Data.IDbCommand cmd = new System.Data.SqlClient.SqlCommand(strSQL);
            cmd.CommandTimeout = timeout;

            return cmd;
        } // End Function CreateCommand


        public static int ExecuteNonQuery(string strSQL)
        {
            int retVal = 0;

            using (System.Data.IDbCommand cmd = CreateCommand(strSQL))
            {
                retVal = ExecuteNonQuery(cmd);
            } // End Using cmd 

            return retVal;
        } // End Function ExecuteNonQuery


        public static int ExecuteNonQuery(System.Data.IDbCommand cmd)
        {
            int iAffected = -1;
            using (System.Data.IDbConnection idbConn = GetConnection())
            {

                lock (idbConn)
                {

                    lock (cmd)
                    {
                        cmd.Connection = idbConn;

                        if (cmd.Connection.State != System.Data.ConnectionState.Open)
                            cmd.Connection.Open();

                        using (System.Data.IDbTransaction idbtTrans = idbConn.BeginTransaction())
                        {

                            try
                            {
                                cmd.Transaction = idbtTrans;

                                iAffected = cmd.ExecuteNonQuery();
                                idbtTrans.Commit();
                            } // End Try
                            catch (System.Data.Common.DbException ex)
                            {
                                if (idbtTrans != null)
                                    idbtTrans.Rollback();

                                iAffected = -2;

                                if (Log(ex))
                                    throw;
                            } // End catch
                            finally
                            {
                                if (cmd.Connection.State != System.Data.ConnectionState.Closed)
                                    cmd.Connection.Close();
                            } // End Finally

                        } // End Using idbtTrans

                    } // End lock cmd

                } // End lock idbConn

            } // End Using idbConn

            return iAffected;
        } // End Function ExecuteNonQuery


        public static System.Data.IDbDataParameter AddParameter(System.Data.IDbCommand command, string strParameterName, object objValue)
        {
            return AddParameter(command, strParameterName, objValue, System.Data.ParameterDirection.Input);
        } // End Function AddParameter


        public static System.Data.IDbDataParameter AddParameter(System.Data.IDbCommand command, string strParameterName, object objValue, System.Data.ParameterDirection pad)
        {
            if (objValue == null)
            {
                //throw new ArgumentNullException("objValue");
                objValue = System.DBNull.Value;
            } // End if (objValue == null)

            System.Type tDataType = objValue.GetType();
            System.Data.DbType dbType = GetDbType(tDataType);

            return AddParameter(command, strParameterName, objValue, pad, dbType);
        } // End Function AddParameter


        public static System.Data.IDbDataParameter AddParameter(System.Data.IDbCommand command, string strParameterName, object objValue, System.Data.ParameterDirection pad, System.Data.DbType dbType)
        {
            System.Data.IDbDataParameter parameter = command.CreateParameter();

            if (!strParameterName.StartsWith("@"))
            {
                strParameterName = "@" + strParameterName;
            } // End if (!strParameterName.StartsWith("@"))

            parameter.ParameterName = strParameterName;
            parameter.DbType = dbType;
            parameter.Direction = pad;

            // Es ist keine Zuordnung von DbType UInt64 zu einem bekannten SqlDbType vorhanden.
            // No association  DbType UInt64 to a known SqlDbType

            if (objValue == null)
                parameter.Value = System.DBNull.Value;
            else
                parameter.Value = objValue;

            command.Parameters.Add(parameter);
            return parameter;
        } // End Function AddParameter


        // From Type to DBType
        public static System.Data.DbType GetDbType(System.Type type)
        {
            // http://social.msdn.microsoft.com/Forums/en/winforms/thread/c6f3ab91-2198-402a-9a18-66ce442333a6
            string strTypeName = type.Name;
            System.Data.DbType DBtype = System.Data.DbType.String; // default value

            try
            {
                if (object.ReferenceEquals(type, typeof(System.DBNull)))
                {
                    return DBtype;
                }

                if (object.ReferenceEquals(type, typeof(System.Byte[])))
                {
                    return System.Data.DbType.Binary;
                }

                DBtype = (System.Data.DbType)System.Enum.Parse(typeof(System.Data.DbType), strTypeName, true);

                // Es ist keine Zuordnung von DbType UInt64 zu einem bekannten SqlDbType vorhanden.
                // http://msdn.microsoft.com/en-us/library/bbw6zyha(v=vs.71).aspx
                if (DBtype == System.Data.DbType.UInt64)
                    DBtype = System.Data.DbType.Int64;
            }
            catch (System.Exception)
            {
                // Add error handling to suit your taste
            }

            return DBtype;
        } // End Function GetDbType


        public static string GetEmbeddedSqlScript(string strScriptName, ref System.Reflection.Assembly ass)
        {
            string strReturnValue = null;

            bool bNotFound = true;
            foreach (string strThisRessourceName in ass.GetManifestResourceNames())
            {
                if (strThisRessourceName != null && strThisRessourceName.EndsWith(strScriptName, System.StringComparison.OrdinalIgnoreCase))
                {

                    using (System.IO.StreamReader sr = new System.IO.StreamReader(ass.GetManifestResourceStream(strThisRessourceName)))
                    {
                        bNotFound = false;
                        strReturnValue = sr.ReadToEnd();
                        break;
                    } // End Using sr

                } // End if (strThisRessourceName != null && strThisRessourceName.EndsWith(strScriptName, StringComparison.OrdinalIgnoreCase) )

            } // Next strThisRessourceName

            if (bNotFound)
            {
                throw new System.Exception("No script called \"" + strScriptName + "\" found in embedded ressources.");
            }

            return strReturnValue;
        } // End Function GetEmbeddedSqlScript


        public static string GetEmbeddedSqlScript(string strScriptName)
        {
            //Dim ass As System.Reflection.Assembly = System.Reflection.Assembly.GetExecutingAssembly()
            //Dim ass As System.Reflection.Assembly = System.Reflection.Assembly.GetCallingAssembly()
            System.Reflection.Assembly ass = typeof(SQL).Assembly;
            return GetEmbeddedSqlScript(strScriptName, ref ass);
        } // End Function GetEmbeddedSqlScript


        public static System.Data.IDbCommand CreateCommandFromFile(string strEmbeddedFileName)
        {
            //Start: Rico Test
            if (!string.IsNullOrEmpty(strEmbeddedFileName) && !strEmbeddedFileName.StartsWith(".")) strEmbeddedFileName = "." + strEmbeddedFileName;
            //End: Rico Test

            string strSQL = GetEmbeddedSqlScript(strEmbeddedFileName);
            return CreateCommand(strSQL);
        } // End Function CreateCommandFromFile


        public static System.Data.DataTable GetDataTableFromEmbeddedRessource(string strFileName)
        {

            using (System.Data.IDbCommand cmd = CreateCommandFromFile(strFileName))
            {
                return GetDataTable(cmd);
            } // cmd

        } // End Function GetDataTableFromEmbeddedRessource


        public static System.Data.IDataReader ExecuteReader(System.Data.IDbCommand cmd)
        {
            System.Data.IDataReader idr = null;

            lock (cmd)
            {
                System.Data.IDbConnection idbc = GetConnection();
                cmd.Connection = idbc;

                if (cmd.Connection.State != System.Data.ConnectionState.Open)
                    cmd.Connection.Open();

                try
                {
                    // http://www.mysqlab.net/knowledge/kb/detail/topic/c%23/id/4917
                    idr = cmd.ExecuteReader(System.Data.CommandBehavior.CloseConnection | System.Data.CommandBehavior.SequentialAccess);
                }
                catch (System.Data.Common.DbException ex)
                {
                    if (Log(ex, cmd))
                        throw;
                }

            } // End Lock cmd

            return idr;
        } // End Function ExecuteReader


        public virtual System.Data.IDataReader ExecuteReader(string strSQL)
        {
            System.Data.IDataReader idr = null;

            using (System.Data.IDbCommand cmd = CreateCommand(strSQL))
            {
                idr = ExecuteReader(cmd);
            } // End Using cmd

            return idr;
        } // End Function ExecuteReader


        public static void UpdateDataTable(System.Data.DataTable dt, string strSQL)
        {
            using (System.Data.Common.DbConnection connection = GetConnection())
            {

                using (System.Data.Common.DbDataAdapter daInsertUpdate = new System.Data.SqlClient.SqlDataAdapter())
                {

                    using (System.Data.Common.DbCommand cmdSelect = connection.CreateCommand())
                    {
                        cmdSelect.CommandText = strSQL;

                        System.Data.Common.DbCommandBuilder cb = new System.Data.SqlClient.SqlCommandBuilder();
                        cb.DataAdapter = daInsertUpdate;

                        daInsertUpdate.SelectCommand = cmdSelect;
                        daInsertUpdate.UpdateCommand = cb.GetUpdateCommand();
                        daInsertUpdate.DeleteCommand = cb.GetDeleteCommand();
                        daInsertUpdate.InsertCommand = cb.GetInsertCommand();

                        daInsertUpdate.Update(dt);
                    } // End Using cmdSelect

                } // End Using daInsertUpdate

            } // End Using con

        } // End Sub UpdateDataTable


        public static void InsertUpdateDataTable(string strTableName, System.Data.DataTable dt)
        {
            string connectionString = GetConnectionString();
            string strSQL = string.Format("SELECT * FROM [{0}] WHERE 1 = 2 ", strTableName.Replace("]", "]]"));

            using (System.Data.Common.DbConnection connection = GetConnection())
            {

                using (System.Data.Common.DbDataAdapter daInsertUpdate = new System.Data.SqlClient.SqlDataAdapter())
                {

                    using (System.Data.Common.DbCommand cmdSelect = connection.CreateCommand())
                    {
                        cmdSelect.CommandText = strSQL;

                        System.Data.Common.DbCommandBuilder cb = new System.Data.SqlClient.SqlCommandBuilder();
                        cb.DataAdapter = daInsertUpdate;

                        daInsertUpdate.SelectCommand = cmdSelect;
                        daInsertUpdate.InsertCommand = cb.GetInsertCommand();
                        daInsertUpdate.UpdateCommand = cb.GetUpdateCommand();
                        daInsertUpdate.DeleteCommand = cb.GetDeleteCommand();

                        daInsertUpdate.Update(dt);
                    } // End Using cmdSelect

                } // End Using daInsertUpdate

            } // End Using connection 

        } // End Sub InsertUpdateDataTable


    } // End Class SQL


} // End Namespace Pdf2Svg
