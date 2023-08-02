﻿using dataRepository.Interface;
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
        [HttpPost("UserLogin")]
        public IActionResult Login([FromBody] UserVM model)
        {
            var i = _userrepo.loginrepo(model);
            if (i > 0)
            {
                return Ok(true);
            }
            else
            {
                return Ok(false);
            }
        }
        [HttpPost("CheckForName")]
        public IActionResult CheckForName([FromBody] string name)
        {
            var i = _userrepo.checkforname(name);
            if (i == 0)
            {
                return Ok(false);

            }
            else
            {
                return Ok(true);
            }
        }

        //public IActionResult Index()
        //{
        //    return View();
        //}
    }
}
