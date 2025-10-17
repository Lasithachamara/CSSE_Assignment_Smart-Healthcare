using BackendProject.DTO;
using BackendProject.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackendProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemController : ControllerBase
    {
        private readonly SfaTestDevContext _context;

        public ItemController(SfaTestDevContext context)
        {
            _context = context;
        }


        [HttpPost]
        [Route("list")]
        public async Task<ActionResult<IEnumerable<GetItemDto>>> GetItems()
        {
            var items = await _context.Items
                .Where(i => i.IsActive == true)
                .Select(i => new GetItemDto
                {
                    Id = i.Id,
                    Name = i.Name,
                    Price = (decimal)(i.Price),
                    Quantity = i.Quantity,
                    ReorderLv = i.ReorderLv,
                    IsActive = i.IsActive,
                    CreatedBy = i.CreatedBy,
                    CreatedDate = i.CreatedDate
                })
                .ToListAsync();

            return Ok(items);
        }


        [HttpPost]
        [Route("get")]
        public async Task<ActionResult<GetItemDto>> GetItem([FromBody] GetItemRequestDto dto)
        {
            var item = await _context.Items.FindAsync(dto.Id);

            if (item == null || item.IsActive != true)
                return NotFound();

            var result = new GetItemDto
            {
                Id = item.Id,
                Name = (string)item.Name,
                Price = (decimal)(item.Price),
                Quantity = (int)item.Quantity,
                ReorderLv = (int)item.ReorderLv,
                IsActive = (bool)item.IsActive,
                CreatedBy = (string)item.CreatedBy,
                CreatedDate = (DateTime)item.CreatedDate
            };

            return Ok(result);
        }


        [HttpPost]
        [Route("create")]
        public async Task<ActionResult<GetItemDto>> PostItem([FromBody] CreateItemDto dto)
        {
            
            var item = new Item
            {
                Name = dto.Name.ToUpper(),
                Price = (double)dto.Price,
                Quantity = dto.Quantity,
                ReorderLv = dto.ReorderLv,
                CreatedBy = dto.CreatedBy,
                CreatedDate = DateTime.Now,
                IsActive = true
            };

            _context.Items.Add(item);
            await _context.SaveChangesAsync();

            var result = new GetItemDto
            {
                Id = item.Id,
                Name = (string)item.Name,
                Price = (decimal)(item.Price),
                Quantity = (int)item.Quantity,
                ReorderLv = (int)item.ReorderLv,
                IsActive = (bool)item.IsActive,
                CreatedBy = (string)item.CreatedBy,
                CreatedDate = (DateTime)item.CreatedDate
            };

            return Ok(result);
        }


        [HttpPut]
        [Route("update")]
        public async Task<IActionResult> PutItem(int id, [FromBody] UpdateItemDto dto)
        {
            var item = await _context.Items.FindAsync(id);

            if (item == null || item.IsActive != true)
                return NotFound();

            item.Name = dto.Name.ToUpper();
            item.Price = (double)dto.Price;
            item.Quantity = dto.Quantity;
            item.ReorderLv = dto.ReorderLv;

            await _context.SaveChangesAsync();
            return NoContent();
        }


        [HttpPost]
        [Route("deactivate")]
        public async Task<IActionResult> DeactivateItem([FromBody] GetItemRequestDto dto)
        {
            var item = await _context.Items.FindAsync(dto.Id);

            if (item == null || item.IsActive != true)
                return NotFound();

            item.IsActive = false;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}