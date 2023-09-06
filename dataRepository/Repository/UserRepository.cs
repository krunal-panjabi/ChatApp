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
        public int DisLikeEntry(LikeVm model)
        {
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("DisLikeEntryByUser", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@msgid", model.msgid);
                cmd.Parameters.AddWithValue("@name", model.name);
                con.Open();
                int i = cmd.ExecuteNonQuery();
                return i;
            }
        }
        public int LikeEntry(LikeVm model)
        {
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("LikeEntryByUser", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@msgid", model.msgid);
                cmd.Parameters.AddWithValue("@name", model.name);
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
                cmd.Parameters.AddWithValue("@isread", model.isread);
                cmd.Parameters.AddWithValue("@isdeliever", model.isdelievered);
                con.Open();
                int i = cmd.ExecuteNonQuery();
            }
        }
        public void storegroupchat(GroupMsgVm model)
        {
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("storegrpchat", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@fromname", model.from);
                cmd.Parameters.AddWithValue("@grpname", model.grpname);
                cmd.Parameters.AddWithValue("@message", model.content);
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
        public List<AllUsersVm> GetLikeMembers(int msgid)
        {
            List<AllUsersVm> model = new List<AllUsersVm>();
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("GetAllLikeMembers", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@msgid", msgid);
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    AllUsersVm names = new AllUsersVm
                    {
                        username = rdr["name"].ToString()
                    };

                    model.Add(names);
                }
                con.Close();
            }
            return model;
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
                        username = rdr["name"].ToString(),
                        imgstr = rdr["image"].ToString()
                    };

                    model.Add(names);
                }
                con.Close();
            }
            return model;
        }
        /* public async Task<ProfileVm> getuserbyprofile(string name)
         {
             List<ProfileVm> model = new List<ProfileVm>();
             using (SqlConnection con = new SqlConnection(connections))
             {
                 SqlCommand cmd = new SqlCommand("selectuserbyprofile", con);
                 cmd.CommandType = CommandType.StoredProcedure;
                 cmd.Parameters.AddWithValue("@userName", name);
                 con.Open();
                 SqlDataReader rdr = cmd.ExecuteReader();
                 while ( rdr.Read())
                 {
                     ProfileVm names = new ProfileVm
                     {
                         name = rdr["Name"].ToString(),
                         email = rdr["Email"].ToString(),
                         aboutme = rdr["aboutme"].ToString(),
                         status = rdr["status"].ToString(),
                         imgstr = rdr["imgstr"].ToString(),
                         gender = rdr["gender"].ToString(),
                         phonenumber = rdr["phonenumber"].ToString(),
                         dob = rdr["dob"].ToString()
                     };

                     model.Add(names);
                 }
                 con.Close();
             }
             return model.FirstOrDefault();
         }*/
        public async Task<ProfileVm> GetUserByProfileAsync(string name)
        {
            List<ProfileVm> model = new List<ProfileVm>();

            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("selectuserbyprofile", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@userName", name);

                await con.OpenAsync(); 

                using (SqlDataReader rdr = await cmd.ExecuteReaderAsync())
                {
                    while (await rdr.ReadAsync())
                    {
                        ProfileVm names = new ProfileVm
                        {
                            name = rdr["Name"].ToString(),
                            email = rdr["Email"].ToString(),
                            aboutme = rdr["aboutme"].ToString(),
                            status = rdr["status"].ToString(),
                            imgstr = rdr["imgstr"].ToString(),
                            gender = rdr["gender"].ToString(),
                            phonenumber = rdr["phonenumber"].ToString(),
                            dob = Convert.ToDateTime(rdr["dob"])
                        };
                      
                        model.Add(names);
                    }
                }
            }

            return model.FirstOrDefault();
        }

        public List<AllUsersVm> loadmembers(string gpname)
        {
            List<AllUsersVm> model = new List<AllUsersVm>();
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("loadgrpmembers", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@grpname", gpname);
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    AllUsersVm names = new AllUsersVm
                    {
                        username = rdr["Name"].ToString()
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
       /* public List<MessageVM> loadprivatechat(string from, string to)
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
                        From = rdr["fromusername"].ToString(),
                        To = rdr["tousername"].ToString(),
                        Content = rdr["message"].ToString(),
                        time = rdr["FormattedChatTime"].ToString()
                    };

                    model.Add(names);
                }
                con.Close();
            }
            return model;
        }*/
        public  List<MessageVM> loadprivatechat(string from ,string to)
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
                        From = rdr["fromusername"].ToString(),
                        To = rdr["tousername"].ToString(),
                        Content = rdr["message"].ToString(),
                        time = rdr["FormattedChatTime"].ToString(),
                        isread = Convert.ToInt32(rdr["isread"]),
                        isdelievered = Convert.ToInt32(rdr["delievered"]),
                        messageid = Convert.ToInt32(rdr["messageid"]),
                        messageLike = Convert.ToInt32(rdr["MessageLike"]),
                        count = Convert.ToInt32(rdr["count"]),
                        likename = rdr["likename"].ToString()
                        //msgid = Convert.ToInt32(rdr["msgid"])
                    };

                    model.Add(names);
                }
                con.Close();
           
            }
            return model;
        }
        public async Task<List<MessageVM>> loadgroupchat(string grpname,string name)
        {
            List<MessageVM> model = new List<MessageVM>();
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("loadgrpchat", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@grpname", grpname);
                cmd.Parameters.AddWithValue("@fromname", name);

               await con.OpenAsync();
                using (SqlDataReader rdr = await cmd.ExecuteReaderAsync())
                {
                    while (await rdr.ReadAsync())
                    {
                        MessageVM names = new MessageVM
                        {
                            From = rdr["Name"].ToString(),
                            Content = rdr["message"].ToString(),
                            time = rdr["FormattedChatTime"].ToString(),
                            isgrpread = Convert.ToInt32(rdr["count"]),
                        };

                        model.Add(names);
                    }
                    con.Close();
                }
                   
            }
            return model;
        }

        /*public async Task<ProfileVm> GetUserByProfileAsync(string name)
        {
            List<ProfileVm> model = new List<ProfileVm>();

            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("selectuserbyprofile", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@userName", name);

                await con.OpenAsync();

                using (SqlDataReader rdr = await cmd.ExecuteReaderAsync())
                {
                    while (await rdr.ReadAsync())
                    {
                        ProfileVm names = new ProfileVm
                        {
                            name = rdr["Name"].ToString(),
                            email = rdr["Email"].ToString(),
                            aboutme = rdr["aboutme"].ToString(),
                            status = rdr["status"].ToString(),
                            imgstr = rdr["imgstr"].ToString(),
                            gender = rdr["gender"].ToString(),
                            phonenumber = rdr["phonenumber"].ToString(),
                            dob = rdr["dob"].ToString()
                        };

                        model.Add(names);
                    }
                }
            }

            return model.FirstOrDefault();
        }*/



















        public int profiledata(ProfileVm model)
        {
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("spInsertUserProfile", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@userName", model.username);
                cmd.Parameters.AddWithValue("@name", model.name);
                cmd.Parameters.AddWithValue("@gender", model.gender);
                cmd.Parameters.AddWithValue("@phoneNumber", model.phonenumber);
                cmd.Parameters.AddWithValue("@dob", model.dob);
                cmd.Parameters.AddWithValue("@aboutme", model.aboutme);
                cmd.Parameters.AddWithValue("@status", model.status);
                cmd.Parameters.AddWithValue("@email", model.email);
                con.Open();

                int i = cmd.ExecuteNonQuery();

                return i;
            }
        }
        public int uploadphoto(string photo,string name)
        {
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("spInsertImageInUserProfile", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@userName", name);
                cmd.Parameters.AddWithValue("@imageSrc", photo);
                con.Open();

                int i = cmd.ExecuteNonQuery();

                return i;
            }
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

        public int UploadGalleryData(string caption, string imgstr, string uploadedUser)
        {
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("UploadGalleryData", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@caption", caption);
                cmd.Parameters.AddWithValue("@imgstr", imgstr);
                cmd.Parameters.AddWithValue("@uploadedUser", uploadedUser);
                con.Open();

                int i = cmd.ExecuteNonQuery();

                return i;
            }
        }


        public List<GalleryVm> GetGalleryData()
        {
            List<GalleryVm> model = new List<GalleryVm>();
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("GetGalleryData", con);
                cmd.CommandType = CommandType.StoredProcedure;
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    GalleryVm gallery = new GalleryVm
                    {
                        caption = rdr["caption"].ToString(),
                        imgstr = rdr["imgstr"].ToString(),
                        uploadedUser = rdr["uploadedUser"].ToString(),
                        galleryId = Convert.ToInt32(rdr["id"])
                    };

                    model.Add(gallery);
                }
                con.Close();
            }
            return model;
        }

    }
}
