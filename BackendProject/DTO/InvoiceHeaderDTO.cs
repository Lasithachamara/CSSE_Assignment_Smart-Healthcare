using System.ComponentModel.DataAnnotations;

namespace BackendProject.DTO
{
    public class InvoiceHeaderDTO
    {

        [Required]
        public string InvoiceNo { get; set; }

        [Required]
        public string InvoiceId { get; set; }

        [Required]
        public int CustomerId { get; set; }

        [Required]
        public DateTime InvoiceDate { get; set; }

        [Required]
        public decimal TotalAmount { get; set; }

        [Required]
        public int TotalQty { get; set; }

        [Required]
        public bool IsActive { get; set; }

        [Required]
        public string CreatedBy { get; set; }

        [Required]
        public DateTime CreatedDate { get; set; }

        public string? CusName { get; set; }
    }
}


