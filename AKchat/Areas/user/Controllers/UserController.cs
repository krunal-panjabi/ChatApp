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
using System.Net.Mail;
using System.Net;
using Microsoft.CodeAnalysis.CSharp.Syntax;

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
            if (!Convert.ToBoolean(valid_user)) // Result=>   0=false and 1=true 
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

        //[HttpPost("GetUserDetails")]
        //public IActionResult GetUserDetails([FromBody] string username)
        //{
        //    var count_value = _userrepo.GetUserDetails(username);
        //    if (count_value > 0)
        //    {
        //        return Ok(true);
        //    }
        //    else
        //    {
        //        return Ok(false);
        //    }
        //}
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
        public List<AllUsersVm> GetAllOfflineUsers(string username)
        {
            var users = _userrepo.GetAllOfflineUsers(username);
            return users;
        }


        [Authorize]
        [HttpGet("GetMutualOfUser")]
        public MutualFriends GetMutualOfUser(string myName,string name)
        {
            var users = _userrepo.GetMutualOfUser(myName,name);
            return users;
        }

        //[Authorize]
        //[HttpGet("FetchUserDetail")]
        //public async Task<IActionResult> GetUserByprofile(string username)
        //{
        //    var user = await _userrepo.GetUserByProfileAsync(username);
        //    return Ok(user);
        //}






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



        private string GenerateOTP()
        {
            Random random = new Random();
            return random.Next(1000, 9999).ToString();
        }


        [HttpPost("sendOtp")]
        public IActionResult sendOtp([FromBody] ForgetVm model)//company register
         {
            string email = model.email;
            string OTP = GenerateOTP();
            model = new ForgetVm();
            
            model.otp = OTP;
            model.email = email;

            //return Ok(model);

            var count_value = _userrepo.otpSend(model);
            if (count_value > 0)
            {
                var fromAddress = new MailAddress("pankru2002@gmail.com", "Krunamissionanjabi");
                var toAddress = new MailAddress(model.email);
                var subject = "Password reset request";
                var body = $"Hi,<br /><br />this is your one time password:<br /><br /><a href='{OTP}'>{OTP}</a>";
                var message = new MailMessage(fromAddress, toAddress)
                {
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };
                var smtpClient = new SmtpClient("smtp.gmail.com", 587)
                {
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential("pankru2002@gmail.com", "iumtuyfqrdpwsfcq"),
                    EnableSsl = true
                };
                smtpClient.Send(message);
                return Ok(true);
            }
            else
            {
                return Ok(new { result = "NoUser" });
            }
        }



        [HttpPost("CheckOtp")]
        public IActionResult CheckOtp([FromBody] ForgetVm model)
        {
            var count_value = _userrepo.CheckOtp(model.otp);

            if (count_value == 0)
            {
                return Ok(new { result = "success" });
            }
            else if (count_value == 1)
            {
                return Ok(new { result = "timeout" });
            }
            else if (count_value == 2)
            {
                return Ok(new { result = "wrong" });
            }

            // In case no condition is met, return a generic response
            return Ok(new { result = "unknown" });
        }




        [HttpPost("NewPassword")]
        public IActionResult NewPassword([FromBody] NewPasswordVM model)//company register
        {

            var count_value = _userrepo.newpassword(model);
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
        [HttpPost("UploadGalleryData")]
        public IActionResult UploadGalleryData([FromBody] GalleryVm model)//company register
        {

            var count_value = _userrepo.UploadGalleryData(model.caption, model.imgstr, model.uploadedUser,model.tagnames);
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
        [HttpGet("GetMyGallery")]
        public List<GalleryVm> GetMyGallery(string myName)
        {
            var gallery = _userrepo.GetMyGalleryData(myName);
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
        public List<AllStoryVm> GetStory(string username)
        {
            var story = _userrepo.GetStory(username);
            return story;
        }

        [Authorize]
        [HttpGet("UsersLikedPost")]
        public List<UsersLikedPostVm> UsersLikedPost(int imageId)
        {
            var story = _userrepo.UsersLikedPost(imageId);
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


        [HttpPost("deletePost")]
        public IActionResult deletePost([FromBody] int id)
        {
            var post = _userrepo.deletePost(id);
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
