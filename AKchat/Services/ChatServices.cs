using dataRepository.Interface;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using ViewModels.Models;

namespace AKchat.Services
{
    public class ChatServices
    {
        private readonly IUserRepository _userrepo;
        private IConfiguration _config;
        public ChatServices(IConfiguration configuration, IUserRepository userrepo)
        {
            _userrepo = userrepo;
            _config = configuration;
        }
        private static readonly Dictionary<string, string> Users = new Dictionary<string, string>();
        public bool AddUserToList(UserVM model)
        {
                lock (Users)
                {
                    var result = Users.Any(x => x.Key.ToLower() == model.username.ToLower());
                    if (result)
                    {
                        return false;
                    }
                    foreach (var user in Users)
                    {
                        if (user.Key.ToLower() == model.username.ToLower())
                        {
                            return false;
                        }
                    }
                    Users.Add(model.username.ToLower(), null);
                    return true;
                }
           
            
        }

        public void AddUserConnectionId(string user, string connectionId)
        {
            lock (Users)
            {
                if (Users.ContainsKey(user.ToLower()))
                {
                    Users[user.ToLower()] = connectionId;
                }
            }
        }
        public string GetUserByConnectionId(string connectionId)
        {
            lock (Users)
            {
                return Users.Where(x => x.Value == connectionId).Select(x => x.Key).FirstOrDefault();
            }
        }

        public string GetConnectionIdByUser(string user)
        {
            lock (Users)
            {
                return Users[user.ToLower()];
            }
        }

        public void RemoveUserFromList(string user)
        {
            lock (Users)
            {
                if (Users.ContainsKey(user.ToLower()))
                {
                    Users.Remove(user.ToLower());
                }
            }
        }

        public string[] GetOnlineUsers()
        {
            lock (Users)
            {
                return Users.OrderBy(x => x.Key).Select(x => x.Key).ToArray();
            }
        }
        public bool IsUserOnline(string from)
        {
            return Users.ContainsKey(from);
        }

    }
}
