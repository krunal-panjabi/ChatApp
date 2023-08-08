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
        public void storechat(MessageVM model)
        {
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("SendMessage", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@fromname", model.From);
                cmd.Parameters.AddWithValue("@toname", model.To);
                cmd.Parameters.AddWithValue("@message", model.Content);
                con.Open();
                int i = cmd.ExecuteNonQuery();
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
        public List<AllGroupsVm> GetAllGroupsName(string username)
        {
            List<AllGroupsVm> model = new List<AllGroupsVm>();
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("FetchGrpNamesByUser", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@name", username);
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    AllGroupsVm names = new AllGroupsVm
                    {
                        groupname = rdr["GrpName"].ToString()
                    };

                    model.Add(names);
                }
                con.Close();
            }
            return model;
        }
        public List<MessageVM> loadprivatechat(string from ,string to)
        {
            List<MessageVM> model = new List<MessageVM>();
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("loadprivatechat", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@fromname", from);
                cmd.Parameters.AddWithValue("@toname", to);
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    MessageVM names = new MessageVM
                    {
                        From= rdr["fromusername"].ToString(),
                        To= rdr["tousername"].ToString(),
                        Content = rdr["message"].ToString()
                    };

                    model.Add(names);
                }
                con.Close();
            }
            return model;
        }

        public int creategroup(string grpname , string members)
        {
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("InsertUsersIntoGroup", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@names", members);
                cmd.Parameters.AddWithValue("@grpname", grpname);
                con.Open();

                int i = cmd.ExecuteNonQuery();

                return i;
            }
        }


    }
}
