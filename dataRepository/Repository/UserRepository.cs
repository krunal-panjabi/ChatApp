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
using Microsoft.Identity.Client;
using System.Reflection.Metadata;
using System.Runtime.Intrinsics.Arm;

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
                cmd.Parameters.AddWithValue("@email", model.email);
                con.Open();
                int value= cmd.ExecuteNonQuery();
                return value;
            }
        }
        public int DisLikeEntryGrp(LikeVm model) 
        {
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("DisLikeEntryByUserGrp", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@msgid", model.msgid);
                cmd.Parameters.AddWithValue("@name", model.name);
                con.Open();
                int row_count = cmd.ExecuteNonQuery();
                return row_count;
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
                int row_count = cmd.ExecuteNonQuery();
                return row_count;
            }
        }
        public int LikeEntryGrp(LikeVm model)
        {
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("LikeEntryByUserGrp", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@msgid", model.msgid);
                cmd.Parameters.AddWithValue("@name", model.name);
                con.Open();
                int row_count = cmd.ExecuteNonQuery();
                return row_count;
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
                cmd.Parameters.AddWithValue("@toname", model.toname);
                con.Open();
                int row_count = cmd.ExecuteNonQuery();
                return row_count;
            }
        }

        public int likePost(likePostVm model)
        {
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("LikePostByUser", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@myName", model.myName);
                cmd.Parameters.AddWithValue("@id", model.id);
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
                cmd.Parameters.AddWithValue("@type", model.type);
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
                cmd.Parameters.AddWithValue("@type", model.type);
                con.Open();
                int i = cmd.ExecuteNonQuery();
            }

        }
        public int checkforname(string name)
        {
            int value = 10;
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
                    value = (int)cmd.Parameters["@valid"].Value;
                }
                return value;
            }
        }
        public int CheckOtp(string otp)
        {
            int value=10;
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("ValidOTP", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@inputOTP", otp);
                cmd.Parameters.Add("@result", SqlDbType.Int).Direction = ParameterDirection.Output;
                con.Open();

                cmd.ExecuteNonQuery();
                if (cmd.Parameters["@result"].Value != DBNull.Value)
                {
                    value = (int)cmd.Parameters["@result"].Value;
                }
                return value;
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
        public List<AllUsersVm> GetLikeMembersGrp(int msgid)
        {
            List<AllUsersVm> model = new List<AllUsersVm>();
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("GetAllLikeMembersForGrp", con);
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
        public int DeleteNotiMsg(int msgid)
        {
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("removenotimsg", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@msgid", msgid);
                con.Open();
                int i = cmd.ExecuteNonQuery();
                return i;
            }
        }
        public List<NotiMsgVm> GetNotimsgs(string username)
        {
            List<NotiMsgVm> model=new List<NotiMsgVm>();
            using(SqlConnection con=new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("GetNotiMsgs", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@name", username);
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    NotiMsgVm names = new NotiMsgVm
                    { //rdr["stocks"] != DBNull.Value ? Convert.ToInt64(rdr["stocks"]) : 0,
                        content =  rdr["Message"].ToString(),
                        status= Convert.ToInt32(rdr["status"]),
                        name = rdr["name"].ToString(),
                        userImage = rdr["userImage"].ToString(),
                        id = Convert.ToInt32(rdr["id"]),
                        msgid = rdr["msgid"]!= DBNull.Value?Convert.ToInt32(rdr["msgid"]): 00,
                        usename = rdr["usename"].ToString(),
                        answer = Convert.ToInt32(rdr["asnwer"])
                    };

                    model.Add(names);
                }
                con.Close();
            }
            return model;
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
        public List<AllUsersVm> GetAllOfflineUsers(string username)
        {
            List<AllUsersVm> model = new List<AllUsersVm>();
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("GetAllUsersOffline_copy", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@currentname", username);
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    AllUsersVm names = new AllUsersVm
                    {
                        username = rdr["name"].ToString(),
                        imgstr = rdr["image"].ToString(),
                        status = Convert.ToInt32(rdr["count"]),
                        mutualimages = rdr["MutualImages"].ToString(),
                        mutualnames = rdr["MutualNames"].ToString()
                    };

                    model.Add(names);
                }
                con.Close();
            }
            return model;
        }


       
            public MutualFriends GetMutualOfUser(string myName, string name)
            {
                MutualFriends mutualFriends = new MutualFriends();

                using (SqlConnection con = new SqlConnection(connections))
                {
                    SqlCommand cmd = new SqlCommand("MutualOfUser", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@myName", myName);
                    cmd.Parameters.AddWithValue("@name", name);

                    // Output parameters
                    cmd.Parameters.Add("@AllImagesResult", SqlDbType.NVarChar, -1).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@AllNamesResult", SqlDbType.NVarChar, -1).Direction = ParameterDirection.Output;

                    con.Open();
                    cmd.ExecuteNonQuery();

                    // Assign output parameter values to the MutualFriends model
                    mutualFriends.images = Convert.ToString(cmd.Parameters["@AllImagesResult"].Value);
                    mutualFriends.names = Convert.ToString(cmd.Parameters["@AllNamesResult"].Value);
                }

                return mutualFriends;
            }
        


        //public async Task<ProfileVm> GetUserByProfileAsync(string name)
        //{
        //    List<ProfileVm> model = new List<ProfileVm>();
        //    using (SqlConnection con = new SqlConnection(connections))
        //    {
        //        SqlCommand cmd = new SqlCommand("selectuserbyprofile", con);
        //        cmd.CommandType = CommandType.StoredProcedure;
        //        cmd.Parameters.AddWithValue("@userName", name);
        //        await con.OpenAsync();
        //        using (SqlDataReader rdr = await cmd.ExecuteReaderAsync())
        //        {
        //            while (await rdr.ReadAsync())
        //            {
        //                ProfileVm names = new ProfileVm
        //                {
        //                    name = rdr["Name"].ToString(),
        //                    email = rdr["Email"].ToString(),
        //                    aboutme = rdr["aboutme"].ToString(),
        //                    status = rdr["status"].ToString(),
        //                    imgstr = rdr["imgstr"].ToString(),
        //                    gender = rdr["gender"].ToString(),
        //                    phonenumber = rdr["phonenumber"].ToString(),
        //                    dob = Convert.ToDateTime(rdr["dob"])
        //                };
        //                model.Add(names);
        //            }
        //        }
        //    }
        //    return model.FirstOrDefault();
        //}
        public List<AllUsersVm> GetAllUsers(string username)
        {
            List<AllUsersVm> model = new List<AllUsersVm>();
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("GetAllUsers_copy", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@name", username);
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
                            name = rdr.IsDBNull(rdr.GetOrdinal("Name")) ? null : rdr["Name"].ToString(),
                            email = rdr.IsDBNull(rdr.GetOrdinal("Email")) ? null : rdr["Email"].ToString(),
                            aboutme = rdr.IsDBNull(rdr.GetOrdinal("aboutme")) ? null : rdr["aboutme"].ToString(),
                            status = rdr.IsDBNull(rdr.GetOrdinal("status")) ? null : rdr["status"].ToString(),
                            imgstr = rdr.IsDBNull(rdr.GetOrdinal("imgstr")) ? null : rdr["imgstr"].ToString(),
                            imgstr2 = rdr.IsDBNull(rdr.GetOrdinal("imgstr2")) ? null : rdr["imgstr2"].ToString(),
                            gender = rdr.IsDBNull(rdr.GetOrdinal("gender")) ? null : rdr["gender"].ToString(),
                            phonenumber = rdr.IsDBNull(rdr.GetOrdinal("phonenumber")) ? null : rdr["phonenumber"].ToString(),
                            dob = rdr.IsDBNull(rdr.GetOrdinal("dob")) ? DateTime.Now : Convert.ToDateTime(rdr["dob"]),
                            schoolname=rdr.IsDBNull(rdr.GetOrdinal("scname")) ? null : rdr["scname"].ToString(),
                            workplace=rdr.IsDBNull(rdr.GetOrdinal("wpname")) ? null : rdr["wpname"].ToString(),
                            clgname=rdr.IsDBNull(rdr.GetOrdinal("clname")) ? null : rdr["clname"].ToString(),
                            twitterlink=rdr.IsDBNull(rdr.GetOrdinal("twitlink")) ? null : rdr["twitlink"].ToString(),
                            facebooklink=rdr.IsDBNull(rdr.GetOrdinal("facelink"))? null : rdr["facelink"].ToString(),
                            instalink=rdr.IsDBNull(rdr.GetOrdinal("instalink"))? null : rdr["instalink"].ToString(),
                            linkdinlink=rdr.IsDBNull(rdr.GetOrdinal("linlink"))? null : rdr["linlink"].ToString()
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
        public async Task<List<AllGroupsVm>> GetAllGroupsName(string username)
        {
            List<AllGroupsVm> model = new List<AllGroupsVm>();
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("FetchGrpNamesByUser", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@name", username);
                await con.OpenAsync();
               // SqlDataReader rdr =await cmd.ExecuteReaderAsync();
                using (SqlDataReader rdr = await cmd.ExecuteReaderAsync())
                {
                    while (await rdr.ReadAsync())
                    {
                        AllGroupsVm names = new AllGroupsVm
                        {
                            groupname = rdr["GrpName"].ToString()
                        };

                        model.Add(names);
                    }
                }
                    
                
            }
            return model;
        }
      
        public async Task<List<MessageVM>> loadprivatechat(string from ,string to)
        {
            List<MessageVM> model = new List<MessageVM>();
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("loadprivatechat", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@fromname", from);
                cmd.Parameters.AddWithValue("@toname", to);
               await con.OpenAsync();
               using (SqlDataReader rdr = await cmd.ExecuteReaderAsync())
                {
                    while (await rdr.ReadAsync())
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
                            likename = rdr["likename"].ToString(),
                            type = Convert.ToInt32(rdr["msgtype"])
                            //msgid = Convert.ToInt32(rdr["msgid"])
                        };
                        model.Add(names);
                    }
                    con.Close();
                }
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
                            messageid = Convert.ToInt32(rdr["messageid"]),
                            count = Convert.ToInt32(rdr["grpcount"]),
                            likename = rdr["likename"].ToString(),
                            messageLike = Convert.ToInt32(rdr["messagelike"]),
                            type =rdr["msgtype"] != DBNull.Value? Convert.ToInt32(rdr["msgtype"]):0
                           // rdr["msgid"] != DBNull.Value ? Convert.ToInt32(rdr["msgid"]) : 00,
                        };

                        model.Add(names);
                    }
                    con.Close();
                }
                   
            }
            return model;
        }
        public int deletemessage(ResponseVm model)
        {
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("DeleteMessageById", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@msgid", model.msgid);
                
                con.Open();

                int row_count = cmd.ExecuteNonQuery();

                return row_count;
            }
        }
        public int profiledata(ProfileVm model)
         {
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("spInsertUserProfile", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@userName", model.username ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@cover", model.imgstr2 ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@name", model.name ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@gender", model.gender ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@phoneNumber", model.phonenumber ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@dob", model.dob ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@aboutme", model.aboutme ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@status", model.status ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@email", model.email ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@schoolname", model.schoolname ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@workplace", model.workplace ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@clgname", model.clgname ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@instalink", model.instalink ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@facelink", model.facebooklink ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@twitlink", model.twitterlink ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@linkdinlink", model.linkdinlink ?? (object)DBNull.Value);


                con.Open();

                int row_count = cmd.ExecuteNonQuery();

                return row_count;
            }
        }

        //public int GetUserDetails(ProfileVm model)
        //{
        //    using (SqlConnection con = new SqlConnection(connections))
        //    {
        //        SqlCommand cmd = new SqlCommand("spInsertUserProfile", con);
        //        cmd.CommandType = CommandType.StoredProcedure;
        //        cmd.Parameters.AddWithValue("@userName", model.username ?? (object)DBNull.Value);
        //        cmd.Parameters.AddWithValue("@name", model.name ?? (object)DBNull.Value);
        //        cmd.Parameters.AddWithValue("@gender", model.gender ?? (object)DBNull.Value);
        //        cmd.Parameters.AddWithValue("@phoneNumber", model.phonenumber ?? (object)DBNull.Value);
        //        cmd.Parameters.AddWithValue("@dob", model.dob ?? (object)DBNull.Value);
        //        cmd.Parameters.AddWithValue("@aboutme", model.aboutme ?? (object)DBNull.Value);
        //        cmd.Parameters.AddWithValue("@status", model.status ?? (object)DBNull.Value);
        //        cmd.Parameters.AddWithValue("@email", model.email ?? (object)DBNull.Value);
        //        cmd.Parameters.AddWithValue("@schoolname", model.schoolname ?? (object)DBNull.Value);
        //        cmd.Parameters.AddWithValue("@workplace", model.workplace ?? (object)DBNull.Value);
        //        cmd.Parameters.AddWithValue("@clgname", model.clgname ?? (object)DBNull.Value);
        //        cmd.Parameters.AddWithValue("@instalink", model.instalink ?? (object)DBNull.Value);
        //        cmd.Parameters.AddWithValue("@facelink", model.facebooklink ?? (object)DBNull.Value);
        //        cmd.Parameters.AddWithValue("@twitlink", model.twitterlink ?? (object)DBNull.Value);
        //        cmd.Parameters.AddWithValue("@linkdinlink", model.linkdinlink ?? (object)DBNull.Value);


        //        con.Open();

        //        int row_count = cmd.ExecuteNonQuery();

        //        return row_count;
        //    }
        //}


        public int otpSend(ForgetVm model)
        {
            int value = 10;
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("otpSend", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@otp", model.otp);
                cmd.Parameters.AddWithValue("@email", model.email);
                cmd.Parameters.Add("@result", SqlDbType.Int).Direction = ParameterDirection.Output;

                con.Open();

                int row_count = cmd.ExecuteNonQuery();
                if (cmd.Parameters["@result"].Value != DBNull.Value)
                {
                    value = (int)cmd.Parameters["@result"].Value;
                }
                return value;

            }
        }


       


        public int newpassword(NewPasswordVM model)
        {
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("Resetpassword", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@otp", model.otp);
                cmd.Parameters.AddWithValue("@newPassword", model.newPassword);

                con.Open();

                int row_count = cmd.ExecuteNonQuery();

                return row_count;
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

                int row_count = cmd.ExecuteNonQuery();

                return row_count;
            }
        }
        public int declinerequest(ResponseVm model)
        {
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("DeclinedResponse", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@myname", model.myname);
                cmd.Parameters.AddWithValue("@toname", model.toname);
                cmd.Parameters.AddWithValue("@msgid", model.msgid);
                con.Open();

                int row_count = cmd.ExecuteNonQuery();

                return row_count;
            }
        }
        public int acceptrequest(ResponseVm model)
        {
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("AcceptedResponse", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@myname", model.myname);
                cmd.Parameters.AddWithValue("@toname", model.toname);
                cmd.Parameters.AddWithValue("@msgid", model.msgid);
                con.Open();

                int row_count = cmd.ExecuteNonQuery();

                return row_count;
            }
        }
        public int selectedusers(string userlist,string name)
        {
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("UsersForChat_copy", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@userlist", userlist);
                cmd.Parameters.AddWithValue("@name", name);
                con.Open();

                int row_count = cmd.ExecuteNonQuery();

                return row_count;
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

                int row_count = cmd.ExecuteNonQuery();

                return row_count;
            }
        }

        public int UploadGalleryData(string caption, string imgstr, string uploadedUser,string tagnames)
        {
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("UploadGalleryData", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@caption", caption);
                cmd.Parameters.AddWithValue("@imgstr", imgstr);
                cmd.Parameters.AddWithValue("@uploadedUser", uploadedUser);
                cmd.Parameters.AddWithValue("@tagnames", tagnames);
                con.Open();

                int row_count = cmd.ExecuteNonQuery();

                return row_count;
            }
        }


        public int postComment(PostComments model)
        {
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("postComments", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@comment", model.comment);
                cmd.Parameters.AddWithValue("@commenter", model.commenter);
                cmd.Parameters.AddWithValue("@postId", model.postId);
                con.Open();

                int row_count = cmd.ExecuteNonQuery();

                return row_count;
            }
        }


        public List<PostComments> GetPostComments(int postId)
        {
            List<PostComments> model = new List<PostComments>();
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("GetPostComments", con);

                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@postId", postId);

                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    PostComments comments = new PostComments
                    {
                        comment = rdr["comment"].ToString(),
                        commenter = rdr["commenter"].ToString(),
                    };
                    model.Add(comments);
                }
                con.Close();
            }
            return model;
        }
        public int UploadStoryData(string caption, string imgstr, string uploadedUser)
        {
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("UploadStoryData", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@caption", caption);
                cmd.Parameters.AddWithValue("@imgstr", imgstr);
                cmd.Parameters.AddWithValue("@uploadedUser", uploadedUser);
                con.Open();

                int row_count = cmd.ExecuteNonQuery();

                return row_count;
            }
        }

            
        public List<AllStoryVm> GetStory(string username)
        {
            List<AllStoryVm> model = new List<AllStoryVm>();
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("GetStory_copy", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@inputname", username);
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    AllStoryVm names = new AllStoryVm
                    {
                        uploadedUser = rdr["uploadedUser"].ToString(),
                        userimg = rdr["image"].ToString(),
                        userid = Convert.ToInt32(rdr["id"])
                        //Convert.ToInt32(rdr["id"]),
                    };

                    model.Add(names);
                }
                con.Close();
            }
            return model;
        }


        public List<UsersLikedPostVm> UsersLikedPost(int imageId)
        {
            List<UsersLikedPostVm> model = new List<UsersLikedPostVm>();
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("UsersLikedPost", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@imageId", imageId);
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    UsersLikedPostVm names = new UsersLikedPostVm
                    {
                        userName = rdr["userLiked"].ToString(),
                        userimg = rdr["image"].ToString(),
                        //Convert.ToInt32(rdr["id"]),
                    };

                    model.Add(names);
                }
                con.Close();
            }
            return model;
        }






        public StoryVm StoryOfUser(int userId)
        {
            StoryVm model = new StoryVm();
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("StoryOfUser", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@userId", userId);
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                //cmd.ExecuteNonQuery();

                while (rdr.Read())
                {
                  StoryVm model1 = new StoryVm
                    {
                        uploadedUser = rdr["uploadedUser"].ToString(),
                        userimg = rdr["image"].ToString(),
                        imgstr = rdr["imgstr"].ToString(),
                        caption = rdr["caption"].ToString(),
                        //Convert.ToInt32(rdr["id"]),
                    };
                    model = model1;
                  
                }
                con.Close();
            }
            return model;
        }


        public int deleteStory(int userid)
        {
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("deleteStory", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@userid", userid);
                con.Open();
                int i = cmd.ExecuteNonQuery();
                return i;
            }
        }


        public int deletePost(int id)
        {
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("deletePost", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@id", id);
                con.Open();
                int i = cmd.ExecuteNonQuery();
                return i;
            }
        }

















        public List<GalleryVm> GetGalleryData(string myName)
        {
            List<GalleryVm> model = new List<GalleryVm>();
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("GetGalleryData", con);

                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@myName", myName);

                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    GalleryVm gallery = new GalleryVm
                    {
                        caption = rdr["caption"].ToString(),
                        imgstr = rdr["imgstr"].ToString(),
                        uploadedUser = rdr["uploadedUser"].ToString(),
                        userimage = rdr["image"].ToString(),
                        galleryId = Convert.ToInt32(rdr["id"]),
                        likeCount = Convert.ToInt32(rdr["likes"]),
                        currentUserLiked = Convert.ToInt32(rdr["currentUserLiked"]),
                        tagnames= rdr.IsDBNull(rdr.GetOrdinal("tagname")) ? null : rdr["tagname"].ToString(),
                    };
                    model.Add(gallery);
                }
                con.Close();
            }
            return model;
        }


        public List<GalleryVm> GetMyGalleryData(string myName)
        {
            List<GalleryVm> model = new List<GalleryVm>();
            using (SqlConnection con = new SqlConnection(connections))
            {
                SqlCommand cmd = new SqlCommand("GetMyGalleryData", con);

                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@myName", myName);

                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    GalleryVm gallery = new GalleryVm
                    {
                        caption = rdr["caption"].ToString(),
                        imgstr = rdr["imgstr"].ToString(),
                        uploadedUser = rdr["uploadedUser"].ToString(),
                        userimage = rdr["image"].ToString(),
                        galleryId = Convert.ToInt32(rdr["id"]),
                        likeCount = Convert.ToInt32(rdr["likes"]),
                        currentUserLiked = Convert.ToInt32(rdr["currentUserLiked"]),
                    };
                    model.Add(gallery);
                }
                con.Close();
            }
            return model;
        }

    }
}
