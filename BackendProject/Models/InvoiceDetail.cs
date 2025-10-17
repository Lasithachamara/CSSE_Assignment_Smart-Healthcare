using System;
using System.Collections.Generic;

namespace BackendProject.Models;

public partial class InvoiceDetail
{
    public string InvoiceId { get; set; } = null!;

    public int ItemId { get; set; }

    public int ItemQty { get; set; }

    public int? ReturnQty { get; set; }

    public decimal Discount { get; set; }

    public decimal Price { get; set; }

    public decimal TotalAmount { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateTime CreatedDate { get; set; }
}
