using AKchat.Services;
using dataRepository.Interface;
using Humanizer;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Text.RegularExpressions;
using System.Xml.Linq;
using ViewModels.Models;
using static Azure.Core.HttpHeader;

namespace AKchat.Hubs
{
    public class ChatHub : Hub
    { 
        private readonly IUserRepository _userrepo;
        private readonly ChatServices _chatServices;
        public ChatHub(ChatServices chatServices,IUserRepository userrepo)
        {
            _userrepo = userrepo;
            _chatServices = chatServices;
        }
      
        public override async Task OnConnectedAsync()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "ChatApp");
            await Clients.Caller.SendAsync("UserConnected");
        }
         
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, "ChatApp");
            await base.OnDisconnectedAsync(exception);
            var user = _chatServices.GetUserByConnectionId(Context.ConnectionId);
            if (user != null)
            {
                _chatServices.RemoveUserFromList(user);
                await DisplayOnlineUsers();
            }
            else
            {
                Console.WriteLine("Login Again");
            }
        }
        public async Task AddUserConnectionId(string name)
        {
            _chatServices.AddUserConnectionId(name, Context.ConnectionId);
            await DisplayOnlineUsers();
        }

        public async Task ReceiveMessage(MessageVM message)
        {
            await Clients.Group("ChatApp").SendAsync("NewMessage", message);
        }
        public async Task ReceiveGrpMessage(GroupMsgVm message)
        {
            _userrepo.storegroupchat(message);
          //  await Clients.Group("ChatApp").SendAsync("NewGrpMessage", message.grpname);
            string privateGroupName = message.grpname;
            string[] namearr = message.userlist.Split(',');
            foreach (string item in namearr)
            {
                if (_chatServices.IsUserOnline(item))
                {
                    var toConnectionId = _chatServices.GetConnectionIdByUser(item);
                    await Groups.AddToGroupAsync(toConnectionId, privateGroupName);
                }
            }
            await Clients.Group(privateGroupName).SendAsync("NewGrpMessage", message.grpname);
            await Clients.Group(privateGroupName).SendAsync("NotificationGrp", message.grpname);

        }

        public async Task CreatePrivateChat(MessageVM message)
        {
         
            string privateGroupName = GetPrivateGroupName(message.From, message.To);
            await Groups.AddToGroupAsync(Context.ConnectionId, privateGroupName);
            if(_chatServices.IsUserOnline(message.To))
            {                      
                message.isread = 1;
                _userrepo.storechat(message);
                var toConnectionId = _chatServices.GetConnectionIdByUser(message.To);
                await Groups.AddToGroupAsync(toConnectionId, privateGroupName);
                await Clients.Client(toConnectionId).SendAsync("OpenPrivateChat", message);
            }
            else
            {
                 _userrepo.storechat(message);
                MessageVM model = new MessageVM
                {
                    From = message.From,
                    Content = message.Content,
                    time = DateTime.Now.ToString("MMM dd, HH:mm")
                };
                await Clients.Group("ChatApp").SendAsync("NewPrivateChatMessage", model);
            }
        }

        public async Task LoadGrpNames(string userlist)
        {
            string privateGroupName = "randomgrp";
            string[] namearr = userlist.Split(',');
            foreach (string item in namearr)
            {
                if (_chatServices.IsUserOnline(item))
                {
                    var toConnectionId = _chatServices.GetConnectionIdByUser(item);
                    await Groups.AddToGroupAsync(toConnectionId, privateGroupName);
                }
            }
            await Clients.Groups(privateGroupName).SendAsync("CallForLoadGrpNames");
        }
        public async Task ReceivePrivateMessage(MessageVM message)
        {
            if (_chatServices.IsUserOnline(message.To))
            {
                message.isread = 1;
                var toConnectionId = _chatServices.GetConnectionIdByUser(message.To);
                await Clients.Client(toConnectionId).SendAsync("NotificationCount", message);
            }
            else
            {
                message.isread = 0;
            }
            message.likename = "other";
            message.messageLike = 0;
            message.count = 0;
            _userrepo.storechat(message);
            message.time = DateTime.Now.ToString("MMM dd, HH:mm");
            string privateGroupName = GetPrivateGroupName(message.From, message.To);
            await Clients.Group(privateGroupName).SendAsync("NewPrivateMessage", message);
        }

        public async Task RemovePrivateChat(string from, string to)
        {
            string privateGroupName = GetPrivateGroupName(from, to);
            await Clients.Group(privateGroupName).SendAsync("ClosePrivateChat");

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, privateGroupName);
            var toConnectionId = _chatServices.GetConnectionIdByUser(to);
            await Groups.RemoveFromGroupAsync(toConnectionId, privateGroupName);
        }


        private async Task DisplayOnlineUsers()
        {
            var onlineUsers = _chatServices.GetOnlineUsers();
            await Clients.Groups("ChatApp").SendAsync("OnlineUsers", onlineUsers);
        }


        private string GetPrivateGroupName(string from, string to)
        {
            var stringCompare = string.CompareOrdinal(from, to) < 0;
            return stringCompare ? $"{from}-{to}" : $"{to}-{from}";
        }
        public async Task SendTypingIndicator(string name,string myname)
        {
            if (_chatServices.IsUserOnline(name))
            {
                var toConnectionId = _chatServices.GetConnectionIdByUser(name);
                await Clients.Client(toConnectionId).SendAsync("ReceiveTypingIndicator", myname);
            }
        }
        public async Task SendTypingIndicatorGrp(string name,string userlist)
        {
            string privateGroupName = "random grp";
            string[] namearr = userlist.Split(',');
            foreach (string item in namearr)
            {
                if (_chatServices.IsUserOnline(item))
                {
                    var toConnectionId = _chatServices.GetConnectionIdByUser(item);
                    await Groups.AddToGroupAsync(toConnectionId, privateGroupName);
                }
            }
            await Clients.Group(privateGroupName).SendAsync("ReceiveTypingIndicatorGrp", name);
        }
        public async Task SendReqNoti(string names)
        {
            string privateGroupName = "randomgrp";
            string[] namearr = names.Split(',');
            foreach (string item in namearr)
            {
                if (_chatServices.IsUserOnline(item))
                {
                    var toConnectionId = _chatServices.GetConnectionIdByUser(item);
                    await Groups.AddToGroupAsync(toConnectionId, privateGroupName);
                }
            }
            await Clients.Group(privateGroupName).SendAsync("SendNotiRequest", names);
        }
        public async Task SendDisLikeResGrp(string userlist,string gpname)
        {
            string privateGroupName = "randomgrp";
            string[] namearr = userlist.Split(',');
            foreach (string item in namearr)
            {
                if (_chatServices.IsUserOnline(item))
                {
                    var toConnectionId = _chatServices.GetConnectionIdByUser(item);
                    await Groups.AddToGroupAsync(toConnectionId, privateGroupName);
                }
            }
            await Clients.Group(privateGroupName).SendAsync("SendDisLikeResGrp", userlist, gpname);
        }
        public async Task SendLikeResGrp(string userlist,string gpname)
        {
            string privateGroupName = "randomgrp";
            string[] namearr = userlist.Split(',');
            foreach (string item in namearr)
            {
                if (_chatServices.IsUserOnline(item))
                {
                    var toConnectionId = _chatServices.GetConnectionIdByUser(item);
                    await Groups.AddToGroupAsync(toConnectionId, privateGroupName);
                }
            }
            await Clients.Group(privateGroupName).SendAsync("SendLikeResGrp", userlist,gpname);
        }
        public async Task SendAcceptNoti(string name)
        {
            if(_chatServices.IsUserOnline(name))
            {
                var toConnectionId = _chatServices.GetConnectionIdByUser(name);
                await Clients.Client(toConnectionId).SendAsync("AcceptUser", name);
            }
        }
        public async Task SendDeclineNoti(string name)
        {
            if(_chatServices.IsUserOnline(name))
            {
                var toConnectionId = _chatServices.GetConnectionIdByUser(name);
                await Clients.Client(toConnectionId).SendAsync("DeclineUser", name);
            }
        }
        public async Task SendLikeRes(int msgid, string name, int like,int messageid,int count,string myname,string typename)
        {
            if(string.IsNullOrEmpty(name))
            {
                if (_chatServices.IsUserOnline(typename))
                {
                    var toConnectionId = _chatServices.GetConnectionIdByUser(typename);
                    await Clients.Client(toConnectionId).SendAsync("ReceiveLikeRes", msgid, like, messageid, count,typename);
                }
            }
            else
            {
                if (_chatServices.IsUserOnline(name))
                {
                    var toConnectionId = _chatServices.GetConnectionIdByUser(name);
                    await Clients.Client(toConnectionId).SendAsync("ReceiveLikeRes", msgid, like, messageid, count, myname);
                }
            }
           
        }
        public async Task DeleteMsgById(int msgid,string name)
        {
            if (_chatServices.IsUserOnline(name))
            {
                var toConnectionId = _chatServices.GetConnectionIdByUser(name);
                await Clients.Client(toConnectionId).SendAsync("DeleteMsgById", msgid, name);
            }
        }
        public async Task SendLikeResById(int msgid, string name, int like,string myname,string typename)
        {
            if(string.IsNullOrEmpty(name))
            {
                if (_chatServices.IsUserOnline(typename))
                {
                    var toConnectionId = _chatServices.GetConnectionIdByUser(typename);
                    await Clients.Client(toConnectionId).SendAsync("ReceiveLikeResById", msgid, like,typename);
                }
            }
            else
            {
                if (_chatServices.IsUserOnline(name))
                {
                    var toConnectionId = _chatServices.GetConnectionIdByUser(name);
                    await Clients.Client(toConnectionId).SendAsync("ReceiveLikeResById", msgid, like, myname);
                }

            }
            
        }
        public async Task SendClosingIndicator(string name)
        {
            var toConnectionId = _chatServices.GetConnectionIdByUser(name);
            await Clients.Client(toConnectionId).SendAsync("ReceiveCloseTypingIndicator",name);
        }
        public async Task SendClosingIndicatorGrp(string userlist)
        {
            string privateGroupName = "randomgrp";
            string[] namearr = userlist.Split(',');
            foreach (string item in namearr)
            {
                if (_chatServices.IsUserOnline(item))
                {
                    var toConnectionId = _chatServices.GetConnectionIdByUser(item);
                    await Groups.AddToGroupAsync(toConnectionId, privateGroupName);
                }
            }
            await Clients.Group(privateGroupName).SendAsync("ReceiveCloseTypingIndicatorGrp", userlist);
        }



        public async Task LiveStory()
        {
            string privateGroupName = "randomgrp";
            string[] namearr = _chatServices.GetOnlineUsers();

            foreach (string item in namearr)
            {
               
                
                    var toConnectionId = _chatServices.GetConnectionIdByUser(item);
                    await Groups.AddToGroupAsync(toConnectionId, privateGroupName);
                
            }

            await Clients.Group(privateGroupName).SendAsync("LiveStory");


        }




    }
}
