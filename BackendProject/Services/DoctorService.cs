using BackendProject.DTO;
using BackendProject.Interfaces;
using BackendProject.Models;
using Microsoft.EntityFrameworkCore;
using System.Numerics;

namespace BackendProject.Services
{
    public class DoctorService : IDoctorService
    {
        private readonly SfaTestDevContext _context;
        public DoctorService(SfaTestDevContext context) => _context = context;

        public async Task<IEnumerable<DocterDTO>> GetAllAsync()
        {
            return await _context.Docters
                .Select(d => new DocterDTO
                {
                    Id = d.Id,
                    Name = d.Name,
                    DepartmentId = d.DepartmentId
                }).ToListAsync();
        }

        public async Task<DocterDTO> GetByIdAsync(int id)
        {
            var doctor = await _context.Docters.FindAsync(id);
            if (doctor == null) return null;

            return new DocterDTO
            {
                Id = doctor.Id,
                Name = doctor.Name,
                DepartmentId = doctor.DepartmentId
            };
        }

        public async Task<DocterDTO> CreateAsync(DocterDTO dto)
        {
            var entity = new Docter
            {
                Name = dto.Name,
                DepartmentId = dto.DepartmentId
            };
            _context.Docters.Add(entity);
            await _context.SaveChangesAsync();
            dto.Id = entity.Id;
            return dto;
        }

        public async Task<bool> UpdateAsync(int id, DocterDTO dto)
        {
            var entity = await _context.Docters.FindAsync(id);
            if (entity == null) return false;

            entity.Name = dto.Name ?? entity.Name;
            entity.DepartmentId = dto.DepartmentId;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.Docters.FindAsync(id);
            if (entity == null) return false;

            _context.Docters.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
