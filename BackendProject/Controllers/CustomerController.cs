using BackendProject.DTO;
using BackendProject.Models;
using BackendProject.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace BackendProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly SfaTestDevContext _context;

        public CustomersController(SfaTestDevContext context)
        {
            _context = context;
        }


        [HttpPost]
        [Route("Get_All_Customer_Details")]
        public async Task<ActionResult<IEnumerable<Customer>>> GetCustomers()
        {
            var customers = await _context.Customers
                .Where(c => c.IsActive == true)
                .ToListAsync();

            return Ok(customers);
        }


        [HttpPost]
        [Route("Get_Customer_By_Id")]
        public async Task<ActionResult<Customer>> GetCustomer([FromBody] GetCustomerRequestDto dto)
        {
            var customer = await _context.Customers.FindAsync(dto.Id);
            if (customer == null || customer.IsActive != true)
                return NotFound();

            return Ok(customer);
        }


        [HttpPost]
        [Route("Post_Customer")]
        public async Task<ActionResult<Customer>> PostCustomer([FromBody] Customer customer)
        {
            //customer.CreatedBy = "1";
            customer.CreatedDate = DateTime.Now;
            customer.IsActive = true;

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCustomer), new { id = customer.Id }, customer);
        }


        [HttpPut]
        [Route("Update_Customer_Details")]
        public async Task<IActionResult> PutCustomer(int id, [FromBody] Customer customer)
        {
            if (id != customer.Id)
                return BadRequest();

            _context.Entry(customer).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Customers.Any(e => e.Id == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }


        [HttpPost]
        [Route("Delete_Customer_Details")]
        public async Task<IActionResult> DeactivateCustomer([FromBody] GetCustomerRequestDto dto)
        {
            var customer = await _context.Customers.FindAsync(dto.Id);
            if (customer == null || customer.IsActive != true)
                return NotFound();

            customer.IsActive = false;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
