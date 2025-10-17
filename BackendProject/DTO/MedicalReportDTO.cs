namespace BackendProject.DTO
{
    public class MedicalReportDTO
    {
        public int ReportId { get; set; }
        public int PatientId { get; set; }
        public string ReportName { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
        public byte[]? FileData { get; set; }
        public DateTime UploadedOn { get; set; }
    }
}
