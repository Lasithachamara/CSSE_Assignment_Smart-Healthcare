namespace BackendProject.DTO
{
    public class MedicalHistoryDTO
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public string? Title { get; set; }

        public string? Description { get; set; }

        public string? Prescription { get; set; }

        public string? CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }
    }
}
