﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ViewModels.Models
{
    public  class AllUsersVm
    {
        public string username { get; set; }
        public string imgstr { get; set; }
        public int? status { get; set; }
        public int? notread { get; set; }
        public string? mutualimages { get; set; }

        public string? mutualnames { get;set; }

    }
}
