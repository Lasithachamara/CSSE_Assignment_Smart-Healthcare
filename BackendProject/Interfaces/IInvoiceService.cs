using BackendProject.Models;
using BackendProject.DTO;

namespace BackendProject.Interfaces
{
    public interface IInvoiceService
    {
        Task<IEnumerable<InvoiceHeaderDTO>> GetAllInvoicesAsync();
        Task<InvoiceHeaderDTO> GetInvoiceByIdAsync(int id);
        Task<InvoiceHeaderDTO> CreateInvoiceAsync(InvoiceHeaderDTO invoiceDTO);
        Task<bool> UpdateInvoiceAsync(int id, InvoiceHeaderDTO invoiceDTO);
        Task<bool> SoftDeleteInvoiceAsync(string id);
        Task<int> GetLastInvoiceNoAsync();

        Task<List<InvoiceDetailDTO>> GetInvoiceItemsAsync();
        Task<InvoiceDetailDTO> AddInvoiceItemAsync(InvoiceDetailDTO invoiceItemDTO);
        Task<InvoiceDetailDTO> AddReturnInvoiceItemAsync(InvoiceDetailDTO invoiceItemDTO);
        Task<List<InvoiceDetailDTO>> GetInvoiceItemsByInvoiceNoAsync(string idinvoiceNo);

        Task<List<InvoiceDetailDTO>> CreateInvoiceWithDetailsAsync(InvoiceWithDetailsDTO invoiceWithDetailsDTO);

    }
}
