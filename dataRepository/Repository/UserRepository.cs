using dataRepository.Interface;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ViewModels.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace dataRepository.Repository
{
    public class UserRepository : IUserRepository
    {
        public string connections = "server=192.168.2.59\\SQL2019;Database=AKchat;User Id=sa;Password=Tatva@123;Encrypt=False";


        public int registerrepo(UserVM model)
        {
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("spInsertUser", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@name", model.username);
                cmd.Parameters.AddWithValue("@password", model.password);
                con.Open();

                int i = cmd.ExecuteNonQuery();

                return i;
            }
        }
        public int checkforname(string name)
        {
            int valid = 10;
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("spCheckUsername", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@name", name);
                cmd.Parameters.Add("@valid", SqlDbType.Int).Direction = ParameterDirection.Output;
                con.Open();

                cmd.ExecuteNonQuery();
                if (cmd.Parameters["@valid"].Value != DBNull.Value)
                {
                    valid = (int)cmd.Parameters["@valid"].Value;
                }
                return valid;
            }
        }
        public int loginrepo(UserVM model)
        {
            int valid = 10;
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("LoginUser", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@name", model.username);
                cmd.Parameters.AddWithValue("@password", model.password);
                cmd.Parameters.Add("@valid", SqlDbType.Int).Direction = ParameterDirection.Output;
                con.Open();

                cmd.ExecuteNonQuery();
                if (cmd.Parameters["@valid"].Value != DBNull.Value)
                {
                    valid = (int)cmd.Parameters["@valid"].Value;
                }
                return valid;
            }
        }
        public List<AllUsersVm> GetAllUsers()
        {
            List<AllUsersVm> model = new List<AllUsersVm>();
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("GetAllUsers", con);
                cmd.CommandType = CommandType.StoredProcedure;
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    AllUsersVm names = new AllUsersVm
                    {
                       username= rdr["name"].ToString()
                    };

                    model.Add(names);
                }
                con.Close();
            }
            return model;
        }
    }
}
