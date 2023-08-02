using AKchat.Services;
using dataRepository.Interface;
using Microsoft.AspNetCore.Mvc;
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
            if (_chatservices.AddUserToList(model))
            {
                return NoContent();
            }
            return BadRequest("User Name Taken");
            /*var i = _userrepo.registerrepo(model);
            if (i > 0)
            {
                return Ok(true);
            }
            else
            {
                return Ok(false);
            }*/
        }

        [HttpPost("UserLogin")]
        public IActionResult Login([FromBody] UserVM model)
        {
            var i = _userrepo.loginrepo(model);
            if (i == 0)
            {
                return Ok(true);
            }
            else
            {
                return Ok(false);
            }
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

    }
}
