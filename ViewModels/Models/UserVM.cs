using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ViewModels.Models
{
    public class UserVM
    {
        [Required(ErrorMessage = "User Name is required")]
        public string username { get; set; }
        [Required(ErrorMessage = "Password is required")]
        public string password { get; set; }
    }
}
