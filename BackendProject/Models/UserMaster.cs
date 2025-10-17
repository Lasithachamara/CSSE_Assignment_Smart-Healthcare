using System;
using System.Collections.Generic;

namespace BackendProject.Models;

public partial class UserMaster
{
    public int Id { get; set; }

    public string FirstName { get; set; } = null!;

    public string? LastName { get; set; }

    public string UserName { get; set; } = null!;

    public string? Nic { get; set; }

    public DateTime? DateOfBirth { get; set; }

    public string? Gender { get; set; }

    public string? ContactNumber { get; set; }

    public string? EmergencyContactNo { get; set; }

    public string Email { get; set; } = null!;

    public string? Address { get; set; }

    public string Password { get; set; } = null!;

    public string? BloodType { get; set; }

    public int AccessLevel { get; set; }

    public bool ActiveStatus { get; set; }

    public string Mobile { get; set; } = null!;

    public string? Qrcode { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateTime CreatedDate { get; set; }
}
