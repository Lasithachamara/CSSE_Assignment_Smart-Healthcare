using BackendProject.Models;
using BackendProject.DTO;
using Microsoft.AspNetCore.Mvc;
using BackendProject.Interfaces;

namespace BackendProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoiceController : ControllerBase
    {
        private readonly IInvoiceService _invoiceService;

        public InvoiceController(IInvoiceService invoiceService)
        {
            _invoiceService = invoiceService;
        }

        [HttpPost]
        [Route("invoice_list")]
        public async Task<ActionResult<IEnumerable<InvoiceHeaderDTO>>> GetAllInvoices()
        {
            var invoices = await _invoiceService.GetAllInvoicesAsync();
            return Ok(invoices);
        }

        [HttpPost]
        [Route("Post_Invoice")]
        public async Task<ActionResult<InvoiceHeaderDTO>> PostInvoice(InvoiceHeaderDTO invoiceDTO)
        {
            var createdInvoice = await _invoiceService.CreateInvoiceAsync(invoiceDTO);
            return CreatedAtAction(nameof(PostInvoice), new { id = createdInvoice.InvoiceNo }, createdInvoice);
        }

        [HttpPost("Update_Invoice/{id}")]
        public async Task<IActionResult> UpdateInvoice(int id, InvoiceHeaderDTO invoiceDTO)
        {
            var result = await _invoiceService.UpdateInvoiceAsync(id, invoiceDTO);
            if (!result) return NotFound();
            return NoContent();
        }

        [HttpPost("Delete_Invoice/{id}")]
        public async Task<IActionResult> DeleteInvoice(string id)
        {
            var result = await _invoiceService.SoftDeleteInvoiceAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }

        [HttpPost]
        [Route("invoice_Details_list")]
        public async Task<ActionResult<IEnumerable<InvoiceDetailDTO>>> GetInvoiceItem()
        {
            var items = await _invoiceService.GetInvoiceItemsAsync();
            return Ok(items);
        }

        [HttpPost]
        [Route("Add_Invoice_Details")]
        public async Task<ActionResult<InvoiceDetailDTO>> PostInvoiceItem(InvoiceDetailDTO dto)
        {
            var result = await _invoiceService.AddInvoiceItemAsync(dto);
            return CreatedAtAction(nameof(PostInvoiceItem), new { id = result.InvoiceId }, result);
        }

        [HttpPost]
        [Route("Add_Return_Invoice_Details")]
        public async Task<ActionResult<InvoiceDetailDTO>> PostReturnInvoiceItem(InvoiceDetailDTO dto)
        {
            var result = await _invoiceService.AddReturnInvoiceItemAsync(dto);
            return CreatedAtAction(nameof(PostReturnInvoiceItem), new { id = result.InvoiceId }, result);
        }

        [HttpPost]
        [Route("GetLastInvoiceNo")]
        public async Task<IActionResult> GetLastInvoiceNo()
        {
            var lastNo = await _invoiceService.GetLastInvoiceNoAsync();
            return Ok(lastNo);
        }

        [HttpPost]  // GET is more RESTful for retrieving data
        [Route("Invoice_Details")]
        public async Task<ActionResult<IEnumerable<InvoiceDetailDTO>>> GetInvoiceItemsByInvoiceNoAsync([FromQuery] string invoiceNo)
        {
            if (string.IsNullOrEmpty(invoiceNo))
                return BadRequest("Invoice number is required.");

            var invoiceItems = await _invoiceService.GetInvoiceItemsByInvoiceNoAsync(invoiceNo);

            if (invoiceItems == null || !invoiceItems.Any())
                return NotFound("No invoice items found for the given invoice number.");

            return Ok(invoiceItems);
        }

        [HttpPost]
        [Route("CreateInvoiceWithDetails")]
        public async Task<IActionResult> CreateInvoiceWithDetails([FromBody] InvoiceWithDetailsDTO dto)
        {
            try
            {
                var savedDetails = await _invoiceService.CreateInvoiceWithDetailsAsync(dto);
                return Ok(new { success = true, details = savedDetails });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }





    }
}

