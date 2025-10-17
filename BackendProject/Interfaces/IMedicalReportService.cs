using BackendProject.Models;
using BackendProject.DTO;

namespace BackendProject.Interfaces
{
    public interface IMedicalReportService
    {
        Task<int> UploadReportAsync(MedicalReportDTO reportDto);
        Task<MedicalReportDTO?> GetReportByIdAsync(int reportId);
        Task<IEnumerable<MedicalReportDTO>> GetReportsByPatientAsync(int patientId);

    }
}
