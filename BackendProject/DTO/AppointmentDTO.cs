using BackendProject.Models;

namespace BackendProject.DTO
{
    public class DepartmentRequest
    {
        public int DepartmentId { get; set; }
    }

    public class UserAppointmentsRequest
    {
        public int UserId { get; set; }
    }
    public class AppointmentDTO
    {
        public int Id { get; set; }

        public int? UserId { get; set; }

        public int? DoctorId { get; set; }

        public DateTime? PreferredDate { get; set; }

        public string? AvailableTimeSlots { get; set; }

        public string? ReasonforVisit { get; set; }

        public DateTime? CreatedDate { get; set; }

        public string? DoctorName { get; set; }
        public string? DepartmentName { get; set; }
        public virtual Doctor? Doctor { get; set; }  // ✅ needed for Include

        public string? Status { get; set; }


        public bool? CheckIn { get; set; } = false;

        public string? PatientName { get; set; }
    }

    public class Doctor
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int? DepartmentId { get; set; }
        public virtual Department? Department { get; set; }  // ✅ needed for Include


    }
}
