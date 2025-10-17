using BackendProject.Models;
using BackendProject.DTO;
using Microsoft.EntityFrameworkCore;
using BackendProject.Interfaces;

namespace BackendProject.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly SfaTestDevContext _context;
        public AppointmentService(SfaTestDevContext context) => _context = context;

        public async Task<IEnumerable<AppointmentDTO>> GetAllAsync()
        {
            return await _context.Appointments
                .Select(a => new AppointmentDTO
                {
                    Id = a.Id,
                    UserId = a.UserId,
                    DoctorId = a.DoctorId,
                    PreferredDate = a.PreferredDate,
                    AvailableTimeSlots = a.AvailableTimeSlots,
                    ReasonforVisit = a.ReasonforVisit,
                    CreatedDate = a.CreatedDate,
                    Status = a.Status,
                    CheckIn = a.CheckIn
                }).ToListAsync();
        }

        public async Task<IEnumerable<AppointmentDTO>> GetAllAppointmentsWithDetailsAsync()
        {
            var appointments = await (
                from a in _context.Appointments
                join d in _context.Docters on a.DoctorId equals d.Id into doctors
                from doc in doctors.DefaultIfEmpty()
                join dep in _context.Departments on doc.DepartmentId equals dep.Id into deps
                from department in deps.DefaultIfEmpty()
                join u in _context.UserMasters on a.UserId equals u.Id into users
                from user in users.DefaultIfEmpty()
                select new AppointmentDTO
                {
                    Id = a.Id,
                    UserId = a.UserId,
                    DoctorId = a.DoctorId,
                    PreferredDate = a.PreferredDate,
                    AvailableTimeSlots = a.AvailableTimeSlots,
                    ReasonforVisit = a.ReasonforVisit,
                    CreatedDate = a.CreatedDate,
                    DoctorName = doc != null ? doc.Name : null,
                    DepartmentName = department != null ? department.Name : null,
                    PatientName = user != null ? user.FirstName : null,
                    Status = a.Status,
                    CheckIn = a.CheckIn
                }
            ).ToListAsync();

            return appointments;
        }

        public async Task<AppointmentDTO> GetByIdAsync(int id)
        {
            var a = await _context.Appointments.FindAsync(id);
            if (a == null) return null;

            return new AppointmentDTO
            {
                Id = a.Id,
                UserId = a.UserId,
                DoctorId = a.DoctorId,
                PreferredDate = a.PreferredDate,
                AvailableTimeSlots = a.AvailableTimeSlots,
                ReasonforVisit = a.ReasonforVisit,
                CreatedDate = a.CreatedDate,
                Status = a.Status,
                CheckIn = a.CheckIn
            };
        }

        public async Task<AppointmentDTO> CreateAsync(AppointmentDTO dto)
        {
            var entity = new Appointment
            {
                UserId = dto.UserId,
                DoctorId = dto.DoctorId,
                PreferredDate = dto.PreferredDate,
                AvailableTimeSlots = dto.AvailableTimeSlots,
                ReasonforVisit = dto.ReasonforVisit,
                Status = "Pending",
                CheckIn = false,
                CreatedDate = DateTime.Now
            };
            _context.Appointments.Add(entity);
            await _context.SaveChangesAsync();
            dto.Id = entity.Id;
            return dto;
        }

        public async Task<bool> UpdateAsync(int id, AppointmentDTO dto)
        {
            var entity = await _context.Appointments.FindAsync(id);
            if (entity == null) return false;

            entity.DoctorId = dto.DoctorId;
            entity.PreferredDate = dto.PreferredDate;
            entity.AvailableTimeSlots = dto.AvailableTimeSlots ?? entity.AvailableTimeSlots;
            entity.ReasonforVisit = dto.ReasonforVisit ?? entity.ReasonforVisit;

            // Update status and checkIn if provided
            if (!string.IsNullOrEmpty(dto.Status))
                entity.Status = dto.Status;

            entity.CheckIn = dto.CheckIn;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CheckInAsync(int id)
        {
            var entity = await _context.Appointments.FindAsync(id);
            if (entity == null) return false;

            // Only allow check-in if status is Confirmed
            if (entity.Status != "Confirmed")
                return false;

            entity.Status = "Completed";
            entity.CheckIn = true;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.Appointments.FindAsync(id);
            if (entity == null) return false;

            _context.Appointments.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<DocterDTO>> GetDoctorsByDepartmentAsync(int departmentId)
        {
            return await _context.Docters
                .Where(d => d.DepartmentId == departmentId)
                .Select(d => new DocterDTO
                {
                    Id = d.Id,
                    Name = d.Name,
                    DepartmentId = d.DepartmentId
                }).ToListAsync();
        }

        public async Task<IEnumerable<AppointmentDTO>> GetAppointmentsByUserAsync(int userId)
        {
            var appointments = await (
                from a in _context.Appointments
                join d in _context.Docters on a.DoctorId equals d.Id into doctors
                from doc in doctors.DefaultIfEmpty()
                join dep in _context.Departments on doc.DepartmentId equals dep.Id into deps
                from department in deps.DefaultIfEmpty()
                where a.UserId == userId
                select new AppointmentDTO
                {
                    Id = a.Id,
                    UserId = a.UserId,
                    DoctorId = a.DoctorId,
                    PreferredDate = a.PreferredDate,
                    AvailableTimeSlots = a.AvailableTimeSlots,
                    ReasonforVisit = a.ReasonforVisit,
                    CreatedDate = a.CreatedDate,
                    DoctorName = doc != null ? doc.Name : null,
                    DepartmentName = department != null ? department.Name : null,
                    Status = a.Status,
                    CheckIn = a.CheckIn
                }
            ).ToListAsync();

            return appointments;
        }
    }
}