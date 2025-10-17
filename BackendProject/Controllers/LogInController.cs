using BackendProject.DTO;
using BackendProject.Services;
using Microsoft.AspNetCore.Mvc;

namespace BackendProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LogInController : ControllerBase
    {
        private readonly UserService _userService;

        public LogInController(UserService userService)
        {
            _userService = userService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LogInDto dto)
        {
            var user = await _userService.LoginAsync(dto);

            if (user == null)
                return Unauthorized("Invalid credentials");


            var userDto = new UserDto
            {
                Id = user.Id,
                Nic = user.Nic,
                FirstName = user.FirstName,
                UserName = user.UserName,
                Email = user.Email,
                AccessLevel = user.AccessLevel,
                ActiveStatus = user.ActiveStatus,
                Mobile = user.Mobile,
                CreatedBy = user.CreatedBy,
                CreatedDate = user.CreatedDate

            };

            return Ok(userDto);
        }


    }
}