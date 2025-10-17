using BackendProject.DTO;

namespace BackendProject.Interfaces
{
    public interface IDepartmentService
    {
        Task<IEnumerable<DepartmentDTO>> GetAllAsync();
        Task<DepartmentDTO> GetByIdAsync(int id);
        Task<DepartmentDTO> CreateAsync(DepartmentDTO dto);
        Task<bool> UpdateAsync(int id, DepartmentDTO dto);
        Task<bool> DeleteAsync(int id);
    }
}
