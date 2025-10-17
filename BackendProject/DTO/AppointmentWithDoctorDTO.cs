namespace BackendProject.DTO
{
    public class AppointmentWithDoctorDTO
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public int? DoctorId { get; set; }
        public string? DoctorName { get; set; }
        public string? DepartmentName { get; set; }
        public DateTime? PreferredDate { get; set; }
        public string? AvailableTimeSlots { get; set; }
        public string? ReasonforVisit { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
