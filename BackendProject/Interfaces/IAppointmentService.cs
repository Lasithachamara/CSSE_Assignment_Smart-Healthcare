using BackendProject.Models;
using BackendProject.DTO;

namespace BackendProject.Interfaces
{
    public interface IAppointmentService
    {
        Task<IEnumerable<AppointmentDTO>> GetAllAsync();
        Task<AppointmentDTO> GetByIdAsync(int id);
        Task<AppointmentDTO> CreateAsync(AppointmentDTO dto);
        Task<bool> UpdateAsync(int id, AppointmentDTO dto);
        Task<bool> DeleteAsync(int id);
        Task<List<DocterDTO>> GetDoctorsByDepartmentAsync(int departmentId);
        Task<IEnumerable<AppointmentDTO>> GetAppointmentsByUserAsync(int userId);
        Task<bool> CheckInAsync(int id);
        Task<IEnumerable<AppointmentDTO>> GetAllAppointmentsWithDetailsAsync();
    }
}