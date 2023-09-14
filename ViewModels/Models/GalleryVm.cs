using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ViewModels.Models
{
    public class GalleryVm
    {
        public int? galleryId { get; set; }
        public string caption { get; set; }
        public string imgstr { get; set; }
        public string uploadedUser { get; set; }
        public int likeCount { get; set; }
        public int currentUserLiked { get; set; }
    }
}
