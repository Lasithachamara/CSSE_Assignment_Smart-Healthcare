using BackendProject.DTO;
using BackendProject.Interfaces;
using BackendProject.Service;
using Microsoft.AspNetCore.Mvc;

namespace BackendProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicalReportController : ControllerBase
    {
        private readonly IMedicalReportService _medicalReportService;

        public MedicalReportController(IMedicalReportService medicalReportService)
        {
            _medicalReportService = medicalReportService;
        }

        //// ✅ Upload report (PDF or image)
        [HttpPost("upload")]
        public async Task<IActionResult> UploadReport([FromForm] int patientId, [FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            // Split the file name to get user ID and original name
            var originalFileName = file.FileName;
            string[] parts = originalFileName.Split('_', 2); // split on first underscore
            int fileUserId = 0;
            string fileName = originalFileName;

            if (parts.Length == 2 && int.TryParse(parts[0], out fileUserId))
            {
                fileName = parts[1]; // actual file name
            }

            using var ms = new MemoryStream();
            await file.CopyToAsync(ms);

            var reportDto = new MedicalReportDTO
            {
                PatientId = patientId,         // from FormData
                ReportName = fileName,         // original file name without user ID
                FileType = Path.GetExtension(fileName).TrimStart('.').ToLower(),
                FileData = ms.ToArray()
            };

            var reportId = await _medicalReportService.UploadReportAsync(reportDto);

            return Ok(new { Message = "Report uploaded successfully", ReportId = reportId, FileUserId = fileUserId });
        }


        //// ✅ Get report by ID (POST)
        [HttpPost("get-report")]
        public async Task<IActionResult> GetReport([FromBody] int reportId)
        {
            var report = await _medicalReportService.GetReportByIdAsync(reportId);
            if (report == null)
                return NotFound("Report not found.");

            return File(report.FileData!, $"application/{report.FileType}", report.ReportName);
        }

        // ✅ Get all reports for patient (POST)
        [HttpPost("get-reports-by-patient")]
        public async Task<IActionResult> GetReportsByPatient([FromBody] int patientId)
        {
            var reports = await _medicalReportService.GetReportsByPatientAsync(patientId);
            return Ok(reports);
        }
    }
}
