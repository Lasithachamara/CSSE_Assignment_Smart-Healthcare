using System;
using System.Collections.Generic;

namespace BackendProject.Models;

public partial class Docter
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public int? DepartmentId { get; set; }
}
