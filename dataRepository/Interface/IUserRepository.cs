using System;
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
        public List<AllUsersVm> GetAllUsers();
        public void storechat(MessageVM model);
        public List<MessageVM> loadprivatechat(string from, string to);
        public List<AllGroupsVm> GetAllGroupsName(string username);
        public void storegroupchat(GroupMsgVm model);
        public List<MessageVM> loadgroupchat(string grpname);
        public List<AllUsersVm> loadmembers(string gpname);
    }
}
