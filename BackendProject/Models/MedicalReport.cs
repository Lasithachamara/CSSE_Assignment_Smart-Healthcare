using System;
using System.Collections.Generic;

namespace BackendProject.Models;

public partial class MedicalReport
{
    public int ReportId { get; set; }

    public int PatientId { get; set; }

    public string? ReportName { get; set; }

    public byte[]? FileData { get; set; }

    public string? FileType { get; set; }

    public DateTime? UploadedOn { get; set; }
}
