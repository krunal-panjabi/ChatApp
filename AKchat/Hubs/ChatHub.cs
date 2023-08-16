using AKchat.Services;
using dataRepository.Interface;
using Microsoft.AspNetCore.SignalR;
using ViewModels.Models;

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
            MessageVM model = new MessageVM
            {
                From = message.from,
                Content=message.content
            };
            await Clients.Group("ChatApp").SendAsync("NewGrpMessage", model);
        }

        public async Task CreatePrivateChat(MessageVM message)
        {
            _userrepo.storechat(message);
            string privateGroupName = GetPrivateGroupName(message.From, message.To);
            await Groups.AddToGroupAsync(Context.ConnectionId, privateGroupName);
            var toConnectionId = _chatServices.GetConnectionIdByUser(message.To);
            // for openinf private chat

            await Groups.AddToGroupAsync(toConnectionId, privateGroupName);
            await Clients.Client(toConnectionId).SendAsync("OpenPrivateChat", message);

        }
     
        public async Task LoadGrpNames()
        {
            await Clients.Groups("ChatApp").SendAsync("CallForLoadGrpNames");
        }
        public async Task ReceivePrivateMessage(MessageVM message)
        {
            _userrepo.storechat(message);
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
    }
}
