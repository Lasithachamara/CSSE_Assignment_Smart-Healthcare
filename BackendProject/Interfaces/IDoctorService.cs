using BackendProject.Models;
using BackendProject.DTO;

namespace BackendProject.Interfaces
{
    public interface IDoctorService
    {
        Task<IEnumerable<DocterDTO>> GetAllAsync();
        Task<DocterDTO> GetByIdAsync(int id);
        Task<DocterDTO> CreateAsync(DocterDTO dto);
        Task<bool> UpdateAsync(int id, DocterDTO dto);
        Task<bool> DeleteAsync(int id);

    }
}
