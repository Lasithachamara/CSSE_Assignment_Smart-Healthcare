using System;
using System.Collections.Generic;

namespace BackendProject.Models;

public partial class Customer
{
    public int Id { get; set; }

    public string Nic { get; set; } = null!;

    public string Name { get; set; } = null!;

    public int MobileNo { get; set; }

    public bool IsActive { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateTime CreatedDate { get; set; }
}
