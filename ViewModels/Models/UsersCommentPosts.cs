using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ViewModels.Models
{
    public class UsersCommentPosts
    {
        public int? postid { get; set; }
        public string? caption { get; set; }
        public string? comment { get; set; }
        public string? imgstr { get; set; }
    }
}
