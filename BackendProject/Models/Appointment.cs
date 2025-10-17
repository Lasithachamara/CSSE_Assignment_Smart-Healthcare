using System;
using System.Collections.Generic;

namespace BackendProject.Models;

public partial class Appointment
{
    public int Id { get; set; }

    public int? UserId { get; set; }

    public int? DoctorId { get; set; }

    public DateTime? PreferredDate { get; set; }

    public string? AvailableTimeSlots { get; set; }

    public string? ReasonforVisit { get; set; }

    public DateTime? CreatedDate { get; set; }

    public string? Status { get; set; }

    public bool? CheckIn { get; set; }
}
