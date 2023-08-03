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
        public int checkforname(string name);
        public int loginrepo(UserVM model);
        public List<AllUsersVm> GetAllUsers();

    }
}
