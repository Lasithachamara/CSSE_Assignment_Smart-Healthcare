using BackendProject.Models;
using BackendProject.DTO;
using Microsoft.EntityFrameworkCore;
using BackendProject.Interfaces;

namespace BackendProject.Services
{
    public class DepartmentService : IDepartmentService
    {
        private readonly SfaTestDevContext _context;

        public DepartmentService(SfaTestDevContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<DepartmentDTO>> GetAllAsync()
        {
            return await _context.Departments
                .Select(d => new DepartmentDTO { Id = d.Id, Name = d.Name })
                .ToListAsync();
        }

        public async Task<DepartmentDTO> GetByIdAsync(int id)
        {
            var dept = await _context.Departments.FindAsync(id);
            if (dept == null) return null;
            return new DepartmentDTO { Id = dept.Id, Name = dept.Name };
        }

        public async Task<DepartmentDTO> CreateAsync(DepartmentDTO dto)
        {
            var entity = new Department { Name = dto.Name };
            _context.Departments.Add(entity);
            await _context.SaveChangesAsync();
            dto.Id = entity.Id;
            return dto;
        }

        public async Task<bool> UpdateAsync(int id, DepartmentDTO dto)
        {
            var dept = await _context.Departments.FindAsync(id);
            if (dept == null) return false;

            dept.Name = dto.Name;
            _context.Departments.Update(dept);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var dept = await _context.Departments.FindAsync(id);
            if (dept == null) return false;

            _context.Departments.Remove(dept);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
