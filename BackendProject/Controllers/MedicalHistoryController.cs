using BackendProject.DTO;
using BackendProject.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BackendProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicalHistoryController : ControllerBase
    {
        private readonly IMedicalHistoryService _service;
        public MedicalHistoryController(IMedicalHistoryService service) => _service = service;

        [HttpPost("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }

        [HttpPost("GetById")]
        public async Task<IActionResult> GetById([FromBody] int id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromBody] MedicalHistoryDTO dto)
        {
            var result = await _service.CreateAsync(dto);
            return Ok(result);
        }

        [HttpPost("Update")]
        public async Task<IActionResult> Update([FromBody] MedicalHistoryDTO dto)
        {
            var success = await _service.UpdateAsync(dto.Id, dto);
            if (!success) return NotFound();
            return Ok(dto);
        }

        [HttpPost("Delete")]
        public async Task<IActionResult> Delete([FromBody] int id)
        {
            var success = await _service.DeleteAsync(id);
            if (!success) return NotFound();
            return Ok(new { message = "Deleted successfully" });
        }

        [HttpPost("GetByUserId")]
        public async Task<IActionResult> GetByUserId([FromBody] int userId)
        {
            var result = await _service.GetByUserIdAsync(userId);
            if (result == null || !result.Any())
                return NotFound(new { message = "No medical history found for this user." });

            return Ok(result);
        }

    }
}
