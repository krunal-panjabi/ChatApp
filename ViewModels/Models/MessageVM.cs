using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ViewModels.Models
{
    public class MessageVM
    {
        [Required]
        public string From { get; set; }
        public string To { get; set; }
        [Required]
        public string Content { get; set; }
        public string time { get; set; }

        public int isdelievered { get;set; }
        public int isread { get; set; }
        public int isgrpread { get; set; }
        public string? grpname { get; set; }
        //public int msgid { get; set;}
       
    }
}
