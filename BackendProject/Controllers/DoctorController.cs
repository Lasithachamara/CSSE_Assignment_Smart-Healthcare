using BackendProject.DTO;
using BackendProject.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BackendProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorController : ControllerBase
    {
        private readonly IDoctorService _service;
        public DoctorController(IDoctorService service) => _service = service;

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
        public async Task<IActionResult> Create([FromBody] DocterDTO dto)
        {
            var result = await _service.CreateAsync(dto);
            return Ok(result);
        }

        [HttpPost("Update")]
        public async Task<IActionResult> Update([FromBody] DocterDTO dto)
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
    }
}
