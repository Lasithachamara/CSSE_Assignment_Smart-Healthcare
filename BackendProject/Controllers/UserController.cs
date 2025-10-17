using Microsoft.AspNetCore.Mvc;
using BackendProject.Services;
using BackendProject.DTO;

namespace BackendProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UserService _userService;

        public UsersController(UserService userService)
        {
            _userService = userService;
        }

        // Get all users
        [HttpPost("getall")]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userService.GetAllAsync();
            return Ok(users);
        }

        [HttpPost("getallAppointmentUser")]
        public async Task<IActionResult> getallAppointmentUser()
        {
            var users = await _userService.getallAppointmentUser();
            return Ok(users);
        }

        // Get all user levels
        [HttpPost("getallUserlevel")]
        public async Task<IActionResult> GetAllUserLevel()
        {
            var userLevels = await _userService.GetAllUserLevelAsync();
            return Ok(userLevels);
        }

        // Get user by ID
        [HttpPost("getbyid")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _userService.GetByIdAsync(id);
            if (user == null) return NotFound(new { message = "User not found" });
            return Ok(user);
        }

        // Create new user
        [HttpPost("create")]
        public async Task<IActionResult> Create(UserDto dto)
        {
            try
            {
                if (dto == null)
                    return BadRequest(new { message = "User data cannot be null." });

                await _userService.CreateAsync(dto);

                return Ok(new { message = "User created successfully" });
            }
            catch (InvalidOperationException ex)
            {
                // This catches your "User already exists" or "NIC already exists" exceptions
                return BadRequest(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                // This catches validation issues like empty username or NIC
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                // Generic fallback
                return StatusCode(500, new { message = "An unexpected error occurred." });
            }
        }

        [HttpPost("update-password")]
        public async Task<IActionResult> UpdatePassword(PasswordUpdateDto dto)
        {
            try
            {
                if (dto == null)
                    return BadRequest(new { message = "Invalid request data" });

                await _userService.UpdatePasswordAsync(dto.UserId, dto.Password);
                return Ok(new { message = "Password updated successfully" });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "User not found" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }



        [HttpPost("update")]
        public async Task<IActionResult> Update(int id, UserDto dto)
        {
            try
            {
                await _userService.UpdateAsync(id, dto);
                return Ok(new { message = "User updated successfully" });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Soft delete user
        [HttpPost("delete")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _userService.GetByIdAsync(id);
            if (user == null)
                return NotFound(new { message = "User not found" });

            await _userService.DeleteAsync(id);
            return Ok(new { message = "User deleted successfully" });
        }
    }
}