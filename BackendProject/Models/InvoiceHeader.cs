using System;
using System.Collections.Generic;

namespace BackendProject.Models;

public partial class InvoiceHeader
{
    public string InvoiceNo { get; set; } = null!;

    public int CustomerId { get; set; }

    public DateTime InvoiceDate { get; set; }

    public decimal TotalAmount { get; set; }

    public int TotalQty { get; set; }

    public bool IsActive { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateTime CreatedDate { get; set; }
}
