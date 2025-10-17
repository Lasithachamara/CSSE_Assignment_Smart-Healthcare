using System;
using System.Collections.Generic;

namespace BackendProject.Models;

public partial class Employee
{
    public int Id { get; set; }

    public string? Code { get; set; }

    public string? Name { get; set; }

    public int? DeptId { get; set; }

    public decimal? Salary { get; set; }
}
