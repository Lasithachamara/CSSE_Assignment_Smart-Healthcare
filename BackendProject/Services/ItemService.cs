using BackendProject.DTO;
using BackendProject.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendProject.Service
{
    public class ItemService
    {
        private readonly SfaTestDevContext _context;

        public ItemService(SfaTestDevContext context)
        {
            _context = context;
        }


        public async Task<IEnumerable<GetItemDto>> GetAllItemsAsync()
        {
            return await _context.Items
                .Where(i => i.IsActive == true)
                .Select(i => new GetItemDto
                {
                    Id = i.Id,
                    Name = i.Name,
                    Price = (decimal)i.Price,
                    Quantity = (int)i.Quantity,
                    ReorderLv = (int)i.ReorderLv,
                    IsActive = (bool)i.IsActive,
                    CreatedBy = (string)i.CreatedBy,
                    CreatedDate = (DateTime)i.CreatedDate
                })
                .ToListAsync();
        }


        public async Task<GetItemDto?> GetItemByIdAsync(int id)
        {
            var item = await _context.Items.FindAsync(id);
            if (item == null || item.IsActive != true)
                return null;

            return new GetItemDto
            {
                Id = item.Id,
                Name = item.Name,
                Price = (decimal)item.Price,
                Quantity = (int)item.Quantity,
                ReorderLv = (int)item.ReorderLv,
                IsActive = (bool)item.IsActive,
                CreatedBy = (string)item.CreatedBy,
                CreatedDate = (DateTime)item.CreatedDate
            };
        }


        public async Task<GetItemDto> CreateItemAsync(CreateItemDto dto, string createdBy)
        {
            var item = new Item
            {
                Name = dto.Name.ToUpper(),
                Price = (double)dto.Price,
                Quantity = dto.Quantity,
                ReorderLv = dto.ReorderLv,
                CreatedBy = createdBy,
                CreatedDate = DateTime.Now,
                IsActive = true
            };

            _context.Items.Add(item);
            await _context.SaveChangesAsync();

            return new GetItemDto
            {
                Id = item.Id,
                Name = item.Name,
                Price = (decimal)item.Price,
                Quantity = (int)item.Quantity,
                ReorderLv = (int)item.ReorderLv,
                IsActive = (bool)item.IsActive,
                CreatedBy = (string)item.CreatedBy,
                CreatedDate = (DateTime)item.CreatedDate
            };
        }


        public async Task<bool> UpdateItemAsync(int id, UpdateItemDto dto)
        {
            var item = await _context.Items.FindAsync(id);
            if (item == null || item.IsActive != true)
                return false;

            item.Name = dto.Name.ToUpper();
            item.Price = (double)dto.Price;
            item.Quantity = dto.Quantity;
            item.ReorderLv = dto.ReorderLv;

            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<bool> DeactivateItemAsync(int id)
        {
            var item = await _context.Items.FindAsync(id);
            if (item == null || item.IsActive != true)
                return false;

            item.IsActive = false;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
