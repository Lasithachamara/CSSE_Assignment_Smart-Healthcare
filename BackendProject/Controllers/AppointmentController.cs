using BackendProject.DTO;
using BackendProject.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BackendProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _service;
        public AppointmentController(IAppointmentService service) => _service = service;

        // ✅ Get all appointments
        [HttpPost("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }

        // ✅ Get all appointments with full details (doctor, department, patient names)
        [HttpPost("GetAllWithDetails")]
        public async Task<IActionResult> GetAllWithDetails()
        {
            var result = await _service.GetAllAppointmentsWithDetailsAsync();
            return Ok(result);
        }

        // ✅ Get appointment by ID
        [HttpPost("GetById")]
        public async Task<IActionResult> GetById([FromBody] int id)
        {
            if (id <= 0)
                return BadRequest("Invalid appointment ID.");
            var result = await _service.GetByIdAsync(id);
            if (result == null)
                return NotFound($"Appointment with ID {id} not found.");
            return Ok(result);
        }

        // ✅ Get doctors by department
        [HttpPost("GetDoctorsByDepartment")]
        public async Task<IActionResult> GetDoctorsByDepartmentAsync([FromBody] DepartmentRequest request)
        {
            if (request == null || request.DepartmentId <= 0)
                return BadRequest("Invalid DepartmentId.");
            var result = await _service.GetDoctorsByDepartmentAsync(request.DepartmentId);
            if (result == null || !result.Any())
                return NotFound("No doctors found for this department.");
            return Ok(result);
        }

        // ✅ Get appointments by user
        [HttpPost("getAppointmentsByUser")]
        public async Task<IActionResult> GetAppointmentsByUser([FromBody] UserAppointmentsRequest request)
        {
            if (request == null || request.UserId <= 0)
            {
                return BadRequest(new { message = "Invalid user ID." });
            }
            var appointments = await _service.GetAppointmentsByUserAsync(request.UserId);
            if (!appointments.Any())
            {
                return NotFound(new { message = "No appointments found for this user." });
            }
            return Ok(appointments);
        }

        // ✅ Create a new appointment
        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromBody] AppointmentDTO dto)
        {
            if (dto == null)
                return BadRequest("Appointment data is required.");
            var result = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        // ✅ Update an existing appointment
        [HttpPost("Update")]
        public async Task<IActionResult> Update([FromBody] AppointmentDTO dto)
        {
            if (dto == null || dto.Id <= 0)
                return BadRequest("Invalid appointment data.");
            var success = await _service.UpdateAsync(dto.Id, dto);
            if (!success)
                return NotFound($"Appointment with ID {dto.Id} not found.");
            return Ok(new { message = "Updated successfully", dto });
        }

        // ✅ Check-in appointment
        [HttpPost("CheckIn")]
        public async Task<IActionResult> CheckIn([FromBody] CheckInRequest request)
        {
            if (request == null || request.AppointmentId <= 0)
                return BadRequest("Invalid appointment ID.");

            var success = await _service.CheckInAsync(request.AppointmentId);
            if (!success)
                return BadRequest(new { message = "Check-in failed. Appointment must be Confirmed." });

            return Ok(new { message = "Check-in successful" });
        }

        // ✅ Delete an appointment
        [HttpPost("Delete")]
        public async Task<IActionResult> Delete([FromBody] DeleteRequest request)
        {
            if (request == null || request.AppointmentId <= 0)
                return BadRequest("Invalid appointment ID.");
            var success = await _service.DeleteAsync(request.AppointmentId);
            if (!success)
                return NotFound($"Appointment with ID {request.AppointmentId} not found.");
            return Ok(new { message = "Deleted successfully" });
        }
    }

    // Request DTOs
    public class CheckInRequest
    {
        public int AppointmentId { get; set; }
    }

    public class DeleteRequest
    {
        public int AppointmentId { get; set; }
    }
}