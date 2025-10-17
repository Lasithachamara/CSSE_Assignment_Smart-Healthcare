using BackendProject.Models;
using BackendProject.DTO;

namespace BackendProject.Interfaces
{
    public interface IMedicalHistoryService
    {
        Task<IEnumerable<MedicalHistoryDTO>> GetAllAsync();
        Task<MedicalHistoryDTO> GetByIdAsync(int id);

        Task<IEnumerable<MedicalHistoryDTO>> GetByUserIdAsync(int userId);
        Task<MedicalHistoryDTO> CreateAsync(MedicalHistoryDTO dto);
        Task<bool> UpdateAsync(int id, MedicalHistoryDTO dto);
        Task<bool> DeleteAsync(int id);

    }
}
