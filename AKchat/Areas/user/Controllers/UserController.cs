using AKchat.Services;
using dataRepository.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using NuGet.ContentModel;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ViewModels.Models;
using Microsoft.AspNetCore.Http;
using Swashbuckle.AspNetCore.Annotations;
using NuGet.Configuration;
using NuGet.Common;


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
           
            var count_value = _userrepo.registerrepo(model);
            if (count_value > 0)
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
            var valid_user = _userrepo.loginrepo(model);
            if(valid_user == 0)
            {
                if (_chatservices.AddUserToList(model))
                {
                    string token = CreateJwt(model.username);
                    var response = new { Token = token, Success = true,message="Valid" };
                    return Ok(response);
                }
                return Ok("Name in use");
            }
            var invalid_response = new { message = "Invalid" };
            return Ok(invalid_response);
        }
        [Authorize]
        [SwaggerOperation(Summary = "Upload Image")]
        [SwaggerResponse(StatusCodes.Status200OK, "Store the path")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, "You are not authenticated.")]

        [HttpPost("uploadphoto")]
        public IActionResult uploadphoto()
        {
            var httpRequest = HttpContext.Request;
            var imageFile = httpRequest.Form.Files["Image"];
            string name = httpRequest.Form["name"].ToString();
            string angpath = Constants.ANGULAR_ABSOLUTE_PATH + imageFile.FileName;
            if (imageFile == null)
            {
                return BadRequest("No image file uploaded.");
            }
            else
            {
                string addpath = Constants.WEBAPI_PATH;
                var filePath = Directory.GetCurrentDirectory() + addpath + imageFile.FileName;
                var filepathanguar = Path.Combine(Constants.ANGULAR_RELATIVE_PATH, imageFile.FileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    imageFile.CopyTo(stream);
                }
                using (var stream = new FileStream(filepathanguar, FileMode.Create))
                {
                    imageFile.CopyTo(stream);
                }
            }
            var count_value = _userrepo.uploadphoto(angpath, name);
            if (count_value > 0)
            {
                return Ok(true);
            }
            else
            {
                return Ok(false);
            }
           
        }
       
        /// <summary>
        /// For disling purpose in Grp chat
        /// </summary>
        /// <response code="401">You are not authorized</response>
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [Authorize]
        [HttpPost("DisLikemsgbyIdGrp")]
        public IActionResult DisLikemsgbyIdGrp([FromBody] LikeVm model)
        {
            var count_value = _userrepo.DisLikeEntryGrp(model);
            if (count_value == 0)
            {
                return Ok(false);
            }
            else
            {
                return Ok(true);
            }
        }
        /// <summary>
        /// For disling purpose in private chat
        /// </summary>
        /// <response code="401">You are not authorized</response>
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [Authorize]
        [HttpPost("DisLikemsgbyId")]
        public IActionResult DisLikeMsgById([FromBody] LikeVm model)
        {
            var count_value = _userrepo.DisLikeEntry(model);
            if (count_value == 0)
            {
                return Ok(false);
            }
            else
            {
                return Ok(true);
            }
        }
        [Authorize]
        [HttpPost("ProfileData")]
        public IActionResult profiledata([FromBody] ProfileVm model)
        {
            var count_value = _userrepo.profiledata(model);
              if(count_value > 0)
            {
                return Ok(true);
            }
            else
            {
                return Ok(false);
            }


        }
        [Authorize]
        [SwaggerOperation(Summary = "For liking grp msg")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, "You are not authenticated.")]
        [HttpPost("LikemsgbyIdGrp")]
        public IActionResult LikeMsgByIdGrp([FromBody] LikeVm model)
        {
            var count_value = _userrepo.LikeEntryGrp(model);
            if(count_value ==0)
            {
                return Ok(false);
            }
            else
            {
                return Ok(true);
            }
        }
        

        [Authorize]
        [SwaggerOperation(Summary = "For like msg")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, "You are not authenticated.")]
        [HttpPost("LikemsgbyId")]
        public IActionResult LikeMsgById([FromBody] LikeVm model)
        {
            var count_value = _userrepo.LikeEntry(model);
            if (count_value == 0)
            {
                return Ok(false);
            }
            else
            {
                return Ok(true);
            }
        }
        [Authorize]
        [HttpGet("FetchUserDetail")]
        public async Task<IActionResult> GetUserByprofile(string username)
        {
            var user = await _userrepo.GetUserByProfileAsync(username);
            return Ok(user);
        }
        [HttpGet("CheckForName")]
        public IActionResult CheckForName(string username)
        {
            var valid_value = _userrepo.checkforname(username);

            if (valid_value == 0)
            {
                return Ok(false);
            }
            else
            {
                return Ok(true);
            }
        }
        [Authorize]
        [HttpGet("GetAllOfflineUsers")]
        public List<AllUsersVm> GetAllOfflineUsers()
        {
            var users = _userrepo.GetAllOfflineUsers();
            return users;
        }
        [Authorize]
        [HttpGet("GetOfflineUsers")]
        public List<AllUsersVm> GetAllUsers(string username)
        {
            var users = _userrepo.GetAllUsers(username);
            return users;
        }
        [Authorize]
        [HttpGet("GetLikeMembersGrp")]
        public IActionResult GetLikeMmbersGrp(int msgid)
        {
            var members = _userrepo.GetLikeMembersGrp(msgid);
            if(members!=null)
            {
                return Ok(members);
            }
            else
            {
                return NotFound();
            }
        }
        [Authorize]
        [HttpGet("DeleteNotiMsg")]
        public IActionResult DeleteNotiMsg(int msgid)
        {
            var count_value = _userrepo.DeleteNotiMsg(msgid);
            if(count_value>0)
            {
                return Ok(true);
            }
            else
            {
                return Ok(false);
            }
        }
        [HttpGet("GetNotiMsg")]
        public IActionResult GetNotificationMessages(string username)
        {
            var messages=_userrepo.GetNotimsgs(username);
            if (messages != null)
            {
                return Ok(messages);
            }
            else
            {
                return NotFound();
            }

        }
        [Authorize]
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
        [Authorize]
        [HttpGet("GetGroups")]
        public async Task<IActionResult> GetGroups(string username)
        {
            var grpnames =await _userrepo.GetAllGroupsName(username);

            if (grpnames != null)
            {
                return Ok(grpnames); 
            }
            else
            {
                return NotFound(); 
            }
        }
        [Authorize]
        [HttpPost("DeclineReq")]
        public IActionResult DeclineReq([FromBody] ResponseVm model)
        {
            var count_value = _userrepo.declinerequest(model);
            if (count_value > 0)
            {
                return Ok(true);

            }
            else
            {
                return Ok(false);
            }
        }


        [Authorize]
        [HttpPost("AcceptReq")]
        public IActionResult AcceptReq([FromBody] ResponseVm model)
        {
            var count_value = _userrepo.acceptrequest(model);
            if(count_value>0) {
                return Ok(true);

            }
            else
            {
                return Ok(false);
            }
        }

        [Authorize]
        [HttpPost("DeleteById")]
        public IActionResult DeleteById([FromBody] ResponseVm model)
        {
            var count_value = _userrepo.deletemessage(model);
            if(count_value > 0)
            {
                return Ok(true);
            }
            else
            {
                return Ok(false);
            }
        }

        [Authorize]
        [HttpPost("SelectedUsers")]
        public IActionResult SelectedUsers([FromBody] Dictionary<string,string> data)
        {
            string userlist = data["userlist"];
            string name = data["name"];
      
            var count_value = _userrepo.selectedusers(userlist, name);
            if (count_value > 0)
            {
                return Ok(true);
            }
            else
            {
                return Ok(false);
            }
        }

        [Authorize]
        [HttpGet("LoadInitialPrivateChat")]
        public async  Task<List<MessageVM>> LoadInitialPrivateChat(string fromUser, string toUser)
        {
            var messages =await _userrepo.loadprivatechat(fromUser, toUser);
            return messages;
        }
        [Authorize]
        [HttpGet("LoadGrpMembers")]
        public List<AllUsersVm> LoadGrpMembers(string grpname)
        {
            var members = _userrepo.loadmembers(grpname);
            return members;
        }
        [Authorize]
        [HttpGet("LoadInitialGroupChat")]
        public async Task<List<MessageVM>> LoadInitialGroupChat(string grpname,string name)
        {
            var messages =await _userrepo.loadgroupchat(grpname,name);
            return messages;
        }

        [Authorize]
        [HttpPost("CreateGroup")]
        public IActionResult CreateGroup([FromBody] GroupVM model)//company register
        {
            
            var count_value = _userrepo.creategroup(model.groupName,model.members);
            if (count_value > 0)
            {
                return Ok(true);
            }
            else
            {
                return Ok(false);
            }
        }



    
        [HttpPost("sendOtp")]
        public IActionResult sendOtp([FromBody] string toemail)//company register
        {

            return null;

        }




        [Authorize]
        [HttpPost("UploadGalleryData")]
        public IActionResult UploadGalleryData([FromBody] GalleryVm model)//company register
        {

            var count_value = _userrepo.UploadGalleryData(model.caption, model.imgstr, model.uploadedUser);
            if (count_value > 0)
            {
                return Ok(true);
            }
            else
            {
                return Ok(false);
            }
        }

        [HttpPost("postComment")]
        public IActionResult postComment([FromBody] PostComments model)//company register
        {

            var count_value = _userrepo.postComment(model);
            if (count_value > 0)
            {
                return Ok(true);
            }
            else
            {
                return Ok(false);
            }
        }


        //[Authorize]
        [HttpGet("GetPostComments")]
        public List<PostComments> GetPostComments(int postId)
        {
            var comments = _userrepo.GetPostComments(postId);
            return comments;
        }

        [Authorize]
        [HttpGet("GetGallery")]
        public List<GalleryVm> GetGallery(string myName)
        {
            var gallery = _userrepo.GetGalleryData(myName);
            return gallery;
        }

        [Authorize]
        [HttpPost("UploadStoryData")]
        public IActionResult UploadStoryData([FromBody] StoryVm model)//company register
        {
            var count_value = _userrepo.UploadStoryData(model.caption, model.imgstr, model.uploadedUser);
            if (count_value > 0)
            {
                return Ok(true);
            }
            else
            {
                return Ok(false);
            }
        }


        [Authorize]
        [HttpGet("GetStory")]
        public List<AllStoryVm> GetStory()
        {
            var story = _userrepo.GetStory();
            return story;
        }



        //[HttpGet("StoryOfUser")]
        //public IActionResult StoryOfUser(StoryVm model)
        //{
        //    var post = _userrepo.StoryOfUser(model);
        //    if (post > 0)
        //    {
        //        return Ok(true);
        //    }
        //    else
        //    {
        //        return Ok(false);
        //    }
        //}





        [HttpGet("StoryOfUser")]
        public StoryVm  StoryOfUser(int userId)
        {
             var story = _userrepo.StoryOfUser(userId);

            return story;
        }


        [HttpPost("deleteStory")]
        public IActionResult deleteStory([FromBody]int userid)
        {
            var post = _userrepo.deleteStory(userid);
            if (post > 0)
            {
                return Ok(true);
            }
            else
            {
                return Ok(false);
            }
        }











        private string CreateJwt(string name)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("veryverysceret.....");
            var identity = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Name,$"{name}")
            });

            var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = identity,
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = credentials
            };
            var token = jwtTokenHandler.CreateToken(tokenDescriptor);
            return jwtTokenHandler.WriteToken(token);
        }

        [HttpPost("likePost")]
        public IActionResult likePost(likePostVm model)
        {
            var post = _userrepo.likePost(model);
                 if (post > 0)
            {
                return Ok(true);
            }
            else
            {
                return Ok(false);
            }
        }



    }
}
