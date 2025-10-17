using BackendProject.Models;
using BackendProject.DTO;
using Microsoft.EntityFrameworkCore;
using BackendProject.Interfaces;

namespace BackendProject.Services
{
    public class InvoiceService : IInvoiceService
    {
        private readonly SfaTestDevContext _context;

        public InvoiceService(SfaTestDevContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<InvoiceHeaderDTO>> GetAllInvoicesAsync()
        {
            try
            {
                return await (from invoice in _context.InvoiceHeaders
                          join customer in _context.Customers on invoice.CustomerId equals customer.Id
                          select new InvoiceHeaderDTO
                          {
                              InvoiceNo = invoice.InvoiceNo,
                              InvoiceDate = invoice.InvoiceDate.Date,
                              CustomerId = invoice.CustomerId,
                              CusName = customer.Name,
                              TotalAmount = invoice.TotalAmount,
                              TotalQty = invoice.TotalQty,
                              IsActive = invoice.IsActive,
                              CreatedBy = invoice.CreatedBy,
                              CreatedDate = invoice.CreatedDate
                          }).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while retrieving invoices.", ex);
            }
        }

        public async Task<InvoiceHeaderDTO> GetInvoiceByIdAsync(int id)
        {
            try
            {
                var invoice = await _context.InvoiceHeaders.FindAsync(id);
                if (invoice == null) return null;

                return new InvoiceHeaderDTO
                {
                    InvoiceNo = invoice.InvoiceNo,
                    CustomerId = invoice.CustomerId,
                    TotalAmount = invoice.TotalAmount,
                    TotalQty = invoice.TotalQty,
                    IsActive = invoice.IsActive,
                    CreatedBy = invoice.CreatedBy,
                    CreatedDate = invoice.CreatedDate
                };
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"An error occurred while retrieving invoice with ID {id}.", ex);
            }
        }

        public async Task<List<InvoiceDetailDTO>> GetInvoiceItemsByInvoiceNoAsync(string invoiceNo)
        {
            try
            {
                var invoiceItems = await (
                from invoiceDetails in _context.InvoiceDetails
                join item in _context.Items on invoiceDetails.ItemId equals item.Id
                join invoiceHeader in _context.InvoiceHeaders on invoiceDetails.InvoiceId equals invoiceHeader.InvoiceNo
                where invoiceHeader.InvoiceNo == invoiceNo
                select new InvoiceDetailDTO
                {
                    InvoiceId = invoiceDetails.InvoiceId,
                    ItemName = item.Name,
                    quantity = invoiceDetails.ItemQty,
                    Price = invoiceDetails.Price
                })
                .ToListAsync();

                return invoiceItems;
            }
            catch (Exception ex)
            {

                throw new ApplicationException($"An error occurred while retrieving invoice items for InvoiceNo: {invoiceNo}.", ex);
            }
        }

        public async Task<InvoiceHeaderDTO> CreateInvoiceAsync(InvoiceHeaderDTO invoiceDTO)
        {
            try
            {
                var minSqlDate = new DateTime(1753, 1, 1);

                if (invoiceDTO.CreatedDate < minSqlDate)
                    invoiceDTO.CreatedDate = DateTime.Now;

                if (invoiceDTO.InvoiceDate < minSqlDate)
                    invoiceDTO.InvoiceDate = DateTime.Now;

                var invoice = new InvoiceHeader
                {
                    InvoiceNo = invoiceDTO.InvoiceNo,
                    CustomerId = invoiceDTO.CustomerId,
                    InvoiceDate = invoiceDTO.InvoiceDate,
                    TotalAmount = invoiceDTO.TotalAmount,
                    TotalQty = invoiceDTO.TotalQty,
                    IsActive = invoiceDTO.IsActive,
                    CreatedBy = invoiceDTO.CreatedBy,
                    CreatedDate = invoiceDTO.CreatedDate
                };

                _context.InvoiceHeaders.Add(invoice);
                await _context.SaveChangesAsync();

                invoiceDTO.InvoiceId = invoice.InvoiceNo;  
                invoiceDTO.InvoiceNo = invoice.InvoiceNo;

                return invoiceDTO;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while creating the invoice.", ex);
            }
        }





        public async Task<bool> UpdateInvoiceAsync(int id, InvoiceHeaderDTO invoiceDTO)
        {
            //if (id != invoiceDTO.Id) return false;

            //var invoice = await _context.InvoiceHeaders.FindAsync(id);
            //if (invoice == null) return false;

            //invoice.CustomerId = invoiceDTO.CustomerId;
            //invoice.TotalAmount = invoiceDTO.TotalAmount;
            //invoice.TotalQty = invoiceDTO.TotalQty;

            //_context.InvoiceHeaders.Update(invoice);
            //await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> SoftDeleteInvoiceAsync(string id)
        {
            try
            {
                var invoice = await _context.InvoiceHeaders.FindAsync(id);
                if (invoice == null) return false;

                invoice.IsActive = false;

                var invoiceDetails = await _context.InvoiceDetails
                    .Where(d => d.InvoiceId == id)
                    .ToListAsync();

                foreach (var detail in invoiceDetails)
                {
                    detail.ReturnQty = detail.ItemQty;

                    var item = await _context.Items.FindAsync(detail.ItemId);
                    if (item != null)
                    {
                        item.Quantity += detail.ItemQty;
                    }
                }

                await _context.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"An error occurred while soft-deleting invoice with ID: {id}.", ex);
            }
        }


        public async Task<List<InvoiceDetailDTO>> GetInvoiceItemsAsync()
        {
            try
            {
                return await (from invoiceItem in _context.InvoiceDetails
                          join invoice in _context.InvoiceHeaders
                              on invoiceItem.InvoiceId equals invoice.InvoiceNo
                          join item in _context.Items
                              on invoiceItem.ItemId equals item.Id
                          select new InvoiceDetailDTO
                          {
                              InvoiceId = invoiceItem.InvoiceId,
                              ItemId = invoiceItem.ItemId,
                              ItemQty = invoiceItem.ItemQty,
                              RQty = invoiceItem.ReturnQty,
                              ItemName = item.Name,
                              Discount = invoiceItem.Discount,
                              Price = invoiceItem.Price,
                              TotalAmount = invoiceItem.TotalAmount,

                          }).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while retrieving all invoice items.", ex);
            }
        }

        public async Task<InvoiceDetailDTO> AddInvoiceItemAsync(InvoiceDetailDTO dto)
        {
            try
            {
                if (dto.ItemId == null)
                    throw new ArgumentException("ItemId cannot be null.");

                if (dto.ItemQty <= 0)
                    throw new ArgumentException("ItemQty must be greater than zero.");

                if (dto.Price <= 0)
                    throw new ArgumentException("Price must be greater than zero.");

                var minSqlDate = new DateTime(1753, 1, 1);

                if (dto.CreatedDate < minSqlDate)
                    dto.CreatedDate = DateTime.Now;

                dto.TotalAmount = (dto.ItemQty * dto.Price) - dto.Discount;

                var entity = new InvoiceDetail
                {
                    InvoiceId = dto.InvoiceId,
                    ItemId = dto.ItemId.Value,
                    ItemQty = dto.ItemQty,
                    ReturnQty = dto.RQty,
                    Discount = dto.Discount,
                    Price = dto.Price,
                    TotalAmount = dto.TotalAmount,
                    CreatedBy = dto.CreatedBy,
                    CreatedDate = dto.CreatedDate
                };

                _context.InvoiceDetails.Add(entity);
                await _context.SaveChangesAsync();

                var item = await _context.Items.FindAsync(dto.ItemId);
                if (item != null)
                {
                    item.Quantity -= dto.ItemQty;
                    await _context.SaveChangesAsync();
                }

                return dto;
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"An error occurred while adding invoice item for InvoiceId: {dto.InvoiceId}.", ex);
            }
        }



        public async Task<InvoiceDetailDTO> AddReturnInvoiceItemAsync(InvoiceDetailDTO dto)
        {
            try
            {
                if (dto.ItemId == null)
                    throw new ArgumentException("ItemId cannot be null.");

                var entity = new InvoiceDetail
                {
                    InvoiceId = dto.InvoiceId,
                    ItemId = dto.ItemId.Value,
                    ItemQty = dto.ItemQty,
                    ReturnQty = dto.RQty,
                    Discount = dto.Discount,
                    Price = dto.Price,
                    TotalAmount = (dto.ItemQty * dto.Price) - dto.Discount 
                };

                _context.InvoiceDetails.Add(entity);
                await _context.SaveChangesAsync();

                var item = await _context.Items.FindAsync(dto.ItemId);
                if (item != null)
                {
                    item.Quantity += dto.ItemQty;
                    await _context.SaveChangesAsync();
                }

                var invoiceItem = await _context.InvoiceDetails
                    .FirstOrDefaultAsync(x => x.InvoiceId == dto.InvoiceId && x.ItemId == dto.old_Id);

                if (invoiceItem != null)
                {
                    invoiceItem.ReturnQty += dto.ItemQty;
                    await _context.SaveChangesAsync();
                }

                dto.TotalAmount = entity.TotalAmount;
                return dto;
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"An error occurred while adding return invoice item for InvoiceId: {dto.InvoiceId}.", ex);
            }
        }

        public async Task<int> GetLastInvoiceNoAsync()
        {
            try
            {
                var lastInvoiceNo = await _context.InvoiceHeaders
                .OrderByDescending(i => i.InvoiceNo)
                .Select(i => i.InvoiceNo)
                .FirstOrDefaultAsync();

                if (string.IsNullOrEmpty(lastInvoiceNo))
                    return 0;

                if (lastInvoiceNo.StartsWith("INV-") && int.TryParse(lastInvoiceNo.Substring(4), out int numberPart))
                    return numberPart;

                return 0;
            }
            catch (Exception ex)
            {

                throw new ApplicationException("An error occurred while retrieving the last invoice number.", ex);
            }
        }

        public async Task<List<InvoiceDetailDTO>> CreateInvoiceWithDetailsAsync(InvoiceWithDetailsDTO invoiceWithDetailsDTO)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var minSqlDate = new DateTime(1753, 1, 1);

                // --- Save invoice header ---
                var headerDto = invoiceWithDetailsDTO.Header;
                if (headerDto.CreatedDate < minSqlDate) headerDto.CreatedDate = DateTime.Now;
                if (headerDto.InvoiceDate < minSqlDate) headerDto.InvoiceDate = DateTime.Now;

                var invoiceHeader = new InvoiceHeader
                {
                    InvoiceNo = headerDto.InvoiceNo,
                    CustomerId = headerDto.CustomerId,
                    InvoiceDate = headerDto.InvoiceDate,
                    TotalAmount = headerDto.TotalAmount,
                    TotalQty = headerDto.TotalQty,
                    IsActive = headerDto.IsActive,
                    CreatedBy = headerDto.CreatedBy,
                    CreatedDate = headerDto.CreatedDate
                };

                _context.InvoiceHeaders.Add(invoiceHeader);
                await _context.SaveChangesAsync();

                // --- Save invoice details ---
                var savedDetails = new List<InvoiceDetailDTO>();

                foreach (var dto in invoiceWithDetailsDTO.Details)
                {
                    if (dto.ItemId == null || dto.ItemQty <= 0 || dto.Price <= 0)
                        throw new ArgumentException("Invalid item data.");

                    if (dto.CreatedDate < minSqlDate) dto.CreatedDate = DateTime.Now;

                    dto.TotalAmount = (dto.ItemQty * dto.Price) - dto.Discount;
                    dto.InvoiceId = invoiceHeader.InvoiceNo;

                    var detail = new InvoiceDetail
                    {
                        InvoiceId = invoiceHeader.InvoiceNo,
                        ItemId = dto.ItemId.Value,
                        ItemQty = dto.ItemQty,
                        ReturnQty = dto.RQty,
                        Price = dto.Price,
                        Discount = dto.Discount,
                        TotalAmount = dto.TotalAmount,
                        CreatedBy = dto.CreatedBy,
                        CreatedDate = dto.CreatedDate
                    };

                    _context.InvoiceDetails.Add(detail);

                    // Update item stock
                    var item = await _context.Items.FindAsync(dto.ItemId);
                    if (item != null)
                    {
                        item.Quantity -= dto.ItemQty;
                    }

                    savedDetails.Add(dto);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return savedDetails;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw; 
            }
        }
    }
}
