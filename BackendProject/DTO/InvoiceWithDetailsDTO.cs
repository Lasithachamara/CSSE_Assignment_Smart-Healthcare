namespace BackendProject.DTO
{
    public class InvoiceWithDetailsDTO
    {
        public InvoiceHeaderDTO Header { get; set; }
        public List<InvoiceDetailDTO> Details { get; set; }
    }
}
