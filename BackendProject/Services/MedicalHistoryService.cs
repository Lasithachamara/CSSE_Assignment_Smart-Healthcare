using BackendProject.Models;
using BackendProject.DTO;
using Microsoft.EntityFrameworkCore;
using BackendProject.Interfaces;

namespace BackendProject.Services
{
    public class MedicalHistoryService : IMedicalHistoryService
    {
        private readonly SfaTestDevContext _context;
        public MedicalHistoryService(SfaTestDevContext context) => _context = context;

        public async Task<IEnumerable<MedicalHistoryDTO>> GetAllAsync()
        {
            return await _context.MedicalHistories
                .Select(m => new MedicalHistoryDTO
                {
                    Id = m.Id,
                    UserId = m.UserId,
                    Title = m.Title,
                    Description = m.Description,
                    Prescription = m.Prescription,
                    CreatedBy = m.CreatedBy,
                    CreatedDate = m.CreatedDate
                }).ToListAsync();
        }

        public async Task<IEnumerable<MedicalHistoryDTO>> GetByUserIdAsync(int userId)
        {
            return await _context.MedicalHistories
                .Where(m => m.UserId == userId)
                .Select(m => new MedicalHistoryDTO
                {
                    Id = m.Id,
                    UserId = m.UserId,
                    Title = m.Title,
                    Description = m.Description,
                    Prescription = m.Prescription,
                    CreatedBy = m.CreatedBy,
                    CreatedDate = m.CreatedDate
                })
                .OrderByDescending(m => m.CreatedDate)
                .ToListAsync();
        }


        public async Task<MedicalHistoryDTO> GetByIdAsync(int id)
        {
            var m = await _context.MedicalHistories.FindAsync(id);
            if (m == null) return null;
            return new MedicalHistoryDTO
            {
                Id = m.Id,
                UserId = m.UserId,
                Title = m.Title,
                Description = m.Description,
                Prescription = m.Prescription,
                CreatedBy = m.CreatedBy,
                CreatedDate = m.CreatedDate
            };
        }

        public async Task<MedicalHistoryDTO> CreateAsync(MedicalHistoryDTO dto)
        {
            var entity = new MedicalHistory
            {
                UserId = dto.UserId,
                Title = dto.Title,
                Description = dto.Description,
                Prescription = dto.Prescription,
                CreatedBy = dto.CreatedBy,
                CreatedDate = DateTime.Now
            };
            _context.MedicalHistories.Add(entity);
            await _context.SaveChangesAsync();
            dto.Id = entity.Id;
            return dto;
        }

        public async Task<bool> UpdateAsync(int id, MedicalHistoryDTO dto)
        {
            var entity = await _context.MedicalHistories.FindAsync(id);
            if (entity == null) return false;

            entity.Title = dto.Title ?? entity.Title;
            entity.Description = dto.Description ?? entity.Description;
            entity.Prescription = dto.Prescription ?? entity.Prescription;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.MedicalHistories.FindAsync(id);
            if (entity == null) return false;

            _context.MedicalHistories.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
