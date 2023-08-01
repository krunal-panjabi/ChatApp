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
        public UserController(IUserRepository userrepo, IConfiguration configuration)
        {
            _userrepo = userrepo;
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
        //public IActionResult Index()
        //{
        //    return View();
        //}
    }
}
