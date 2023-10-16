using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ViewModels.Models
{
    public class MessageVM
        //for chatApp
    {
        [Required]
        public string From { get; set; }
        public string To { get; set; }
        [Required]
        public string Content { get; set; }
        public string time { get; set; }
        public int messageid { get; set; }
        public int isdelievered { get;set; }
        public int isread { get; set; }
        public int isgrpread { get; set; }
        public string? grpname { get; set; }
        public int? messageLike { get; set; }
        public int? count { get; set; }
        public string? likename { get; set; }
        public int? type { get; set; }
        //public int msgid { get; set;}

    }
}
