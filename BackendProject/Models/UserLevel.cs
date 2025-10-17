using System;
using System.Collections.Generic;

namespace BackendProject.Models;

public partial class UserLevel
{
    public int Id { get; set; }

    public string UserType { get; set; } = null!;
}
