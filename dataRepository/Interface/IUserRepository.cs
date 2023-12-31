﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ViewModels.Models;


namespace dataRepository.Interface
{
    public interface IUserRepository
    {
        public int registerrepo(UserVM model);
        public int creategroup(string grpname,string members);
        public int checkforname(string name);
        public int loginrepo(UserVM model);
        public List<AllUsersVm> GetAllOfflineUsers(string username);
        public MutualFriends GetMutualOfUser(string myName,string name);
        public List<AllUsersVm> GetAllUsers(string username);
        public void storechat(MessageVM model);
        public Task<List<MessageVM>> loadprivatechat(string from, string to);
        public Task<List<AllGroupsVm>> GetAllGroupsName(string username);
        public void storegroupchat(GroupMsgVm model);
        public Task<List<MessageVM>> loadgroupchat(string grpname, string name);
        public List<AllUsersVm> loadmembers(string gpname);
        public int profiledata(ProfileVm model);
        //public int GetUserDetails(string username);
        public int otpSend(ForgetVm model);
        public int newpassword(NewPasswordVM model);
        public int CheckOtp(string otp);
        public int uploadphoto(string photo, string name);
        public int uploadgrpphoto(string photo, string name);
        public Task<ProfileVm> GetUserByProfileAsync(string name);
        public Task<ProfileVm> FetchUserImage(string name);
        public int UploadGalleryData(string caption, string imgstr, string uploadedUser, string tagnames);
        public int postComment(PostComments model);
        public List<PostComments> GetPostComments(int postId);
        public int UploadStoryData(string caption, string imgstr , string uploadedUser);
        public List<GalleryVm> GetGalleryData(string myName);
        public List<GalleryVm> GetMyGalleryData(string myName);
        public List<NotiMsgVm> GetNotimsgs(string username);
        public int DeleteNotiMsg(int msgid);
        public List<AllStoryVm> GetStory(string username);
        public List<UsersLikedPostVm> UsersLikedPost(int imageId);
        public StoryVm StoryOfUser(int userId);
        public int deleteStory(int userid);
        public int deletePost(int userid);
        public int DisLikeEntryGrp(LikeVm model);
        public int DisLikeEntry(LikeVm model);
        public int LikeEntry(LikeVm model);
        public int likePost(likePostVm model);
        public List<AllUsersVm> GetLikeMembers(int msgid);
        public int LikeEntryGrp(LikeVm model);
        public List<AllUsersVm> GetLikeMembersGrp(int msgid);
        public int selectedusers(string userlist, string name);
        public int acceptrequest(ResponseVm model);
        public int declinerequest(ResponseVm model);
        public int deletemessage(ResponseVm model);
        public List<UsersLikeCommentPostsVm> GetUsersLikeCommentData(string username);
        public List<UsersLikePostDataVm> GetUsersLikeData(string username);
        public List<UsersLikeCommentPostsVm> GetUsersCommentData(string username);
    }
}
