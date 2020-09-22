using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace malDB
{
    class DBHelper
    {
        static string connectionParameters = "server=localhost;Uid=root;password=Nicholas.1;database=mass";

        MySqlConnection connection = new MySqlConnection(connectionParameters);
        
        public DBHelper()
        {
            connection = new MySqlConnection(connectionParameters);
        }

        public void TestConnection()
        {
            MySqlCommand command = new MySqlCommand("select * from users", connection);
            connection.Open();
            MySqlDataReader mysqlread = command.ExecuteReader(CommandBehavior.CloseConnection);
            while (mysqlread.Read())
            {
                Debug.WriteLine(mysqlread.GetString(0) + ":" + mysqlread.GetString(1));
            }
            connection.Close();
        }

    }
}
