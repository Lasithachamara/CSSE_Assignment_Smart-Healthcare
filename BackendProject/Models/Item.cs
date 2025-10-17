using System;
using System.Collections.Generic;

namespace BackendProject.Models;

public partial class Item
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public double Price { get; set; }

    public int Quantity { get; set; }

    public int ReorderLv { get; set; }

    public bool IsActive { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateTime CreatedDate { get; set; }
}
