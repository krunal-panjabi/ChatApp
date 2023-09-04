using AKchat.Services;
using dataRepository.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NuGet.ContentModel;
using ViewModels.Models;

namespace AKchat.Areas.user.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class UserController : Controller
    {

        private readonly IUserRepository _userrepo;
        private readonly IConfiguration _configuration;
        private readonly ChatServices _chatservices;
        public UserController(IUserRepository userrepo, IConfiguration configuration,ChatServices chatservices)
        {
            _userrepo = userrepo;
            _chatservices=chatservices;
            _configuration = configuration;

        }

        [HttpPost("Register")]
        public IActionResult Register([FromBody] UserVM model)//company register
        {
           
            var i = _userrepo.registerrepo(model);
            if (i > 0)
            {
                return Ok(true);
            }
            else
            {
                return Ok(false);
            }
        }

        [HttpPost("UserLogin")]
        public IActionResult Login([FromBody] UserVM model)
        {
            var i = _userrepo.loginrepo(model);
            if(i == 0)
            {
                if (_chatservices.AddUserToList(model))
                {
                    return Ok(true);
                }
                return Ok("Name in use");
            }
            return Ok(false);
        }
        [HttpPost("uploadphoto")]
        public IActionResult uploadphoto()
        {
            var httpRequest = HttpContext.Request;
            var imageFile = httpRequest.Form.Files["Image"];
            string name = httpRequest.Form["name"].ToString();
            string angpath = "\\assets\\img\\" + imageFile.FileName;
            if (imageFile == null)
            {
                return BadRequest("No image file uploaded.");
            }
            if (imageFile != null)
            {
                string addpath = "\\Assets\\UserProfile";
                var filePath = Directory.GetCurrentDirectory() + addpath + imageFile.FileName;
                Console.WriteLine(filePath);

                var filepathanguar = Path.Combine("D:\\ChatApp\\AKchatApp\\src\\assets\\img", imageFile.FileName);


                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    imageFile.CopyTo(stream);
                }

                using (var stream = new FileStream(filepathanguar, FileMode.Create))
                {
                    imageFile.CopyTo(stream);
                }
              
            }
            var i = _userrepo.uploadphoto(angpath, name);
            if (i > 0)
            {
                return Ok(true);
            }
            else
            {
                return Ok(false);
            }
            /*using (var memoryStream = new MemoryStream())
            {
                imageFile.CopyTo(memoryStream);
                byte[] imageBytes = memoryStream.ToArray();

                string base64String = Convert.ToBase64String(imageBytes);

               var i=_userrepo.uploadphoto(base64String, name);
                if (i > 0)
                {
                    return Ok(true);
                }
                else
                {
                    return Ok(false);
                }
            }*/
        }
        [HttpPost("DisLikemsgbyId")]
        public IActionResult DisLikeMsgById([FromBody] LikeVm model)
        {
            var i = _userrepo.DisLikeEntry(model);
            if (i == 0)
            {
                return Ok(false);
            }
            else
            {
                return Ok(true);
            }
        }
        [HttpPost("ProfileData")]
        public IActionResult profiledata([FromBody] ProfileVm model)
        {
            var i = _userrepo.profiledata(model);
              if(i>0)
            {
                return Ok(true);
            }
            else
            {
                return Ok(false);
            }


        }
        [HttpPost("LikemsgbyId")]
        public IActionResult LikeMsgById([FromBody] LikeVm model)
        {
            var i = _userrepo.LikeEntry(model);
            if (i == 0)
            {
                return Ok(false);
            }
            else
            {
                return Ok(true);
            }

        }
        [HttpGet("FetchUserDetail")]
        public async Task<IActionResult> GetUserByprofile(string username)
        {
            var user = await _userrepo.GetUserByProfileAsync(username);
            return Ok(user);
        }
        [HttpGet("CheckForName")]
        public IActionResult CheckForName(string username)
        {
            var i = _userrepo.checkforname(username);

            if (i == 0)
            {
                return Ok(false);

            }
            else
            {
                return Ok(true);
            }
        }
        [HttpGet("GetOfflineUsers")]
        public List<AllUsersVm> GetAllUsers()
        {
            var users = _userrepo.GetAllUsers();
            return users;
        }
        [HttpGet("GetLikeMembers")]
        public IActionResult GetLikeMmbers(int msgid)
        {
            var members = _userrepo.GetLikeMembers(msgid);
            if (members != null)
            {
                return Ok(members);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpGet("GetGroups")]
        public IActionResult GetGroups(string username)
        {
            var grpnames = _userrepo.GetAllGroupsName(username);

            if (grpnames != null)
            {
                return Ok(grpnames); 
            }
            else
            {
                return NotFound(); 
            }
        }




        [HttpGet("LoadInitialPrivateChat")]
        public List<MessageVM> LoadInitialPrivateChat(string fromUser, string toUser)
        {
            var messages = _userrepo.loadprivatechat(fromUser, toUser);
            return messages;
        }

        [HttpGet("LoadGrpMembers")]
        public List<AllUsersVm> LoadGrpMembers(string grpname)
        {
            var members = _userrepo.loadmembers(grpname);
            return members;
        }

        [HttpGet("LoadInitialGroupChat")]
        public async Task<List<MessageVM>> LoadInitialGroupChat(string grpname,string name)
        {
            var messages =await _userrepo.loadgroupchat(grpname,name);
            return messages;
        }


        [HttpPost("CreateGroup")]
        public IActionResult CreateGroup([FromBody] GroupVM model)//company register
        {
            
            var i = _userrepo.creategroup(model.groupName,model.members);
            if (i > 0)
            {
                return Ok(true);
            }
            else
            {
                return Ok(false);
            }
        }


        [HttpPost("UploadGalleryData")]
        public IActionResult UploadGalleryData([FromBody] GalleryVm model)//company register
        {

            var i = _userrepo.UploadGalleryData(model.caption, model.imgstr, model.uploadedUser);
            if (i > 0)
            {
                return Ok(true);
            }
            else
            {
                return Ok(false);
            }
        }


        [HttpGet("GetGallery")]
        public List<GalleryVm> GetGallery()
        {
            var gallery = _userrepo.GetGalleryData();
            return gallery;
        }



    }
}
