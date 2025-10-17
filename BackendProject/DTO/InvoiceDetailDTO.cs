namespace BackendProject.DTO
{
    public class InvoiceDetailDTO
    {
        public int old_Id { get; set; }

        public string? InvoiceId { get; set; }

        public int? ItemId { get; set; }

        public string? ItemName { get; set; }

        public int ItemQty { get; set; }

        public int? RQty { get; set; }

        public decimal Discount { get; set; }

        public decimal Price { get; set; }

        public decimal TotalAmount { get; set; }

        public int quantity { get; set; }

        public string CreatedBy { get; set; } = null!;

        public DateTime CreatedDate { get; set; }
    }
}

