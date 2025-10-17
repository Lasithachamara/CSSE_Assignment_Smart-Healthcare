using BackendProject.DTO;
using BackendProject.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendProject.Service
{
    public class CustomerService
    {
        private readonly SfaTestDevContext _context;

        public CustomerService(SfaTestDevContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CustomerDto>> GetAllCustomersAsync()
        {
            return await _context.Customers
                .Where(c => c.IsActive == true)
                .Select(c => new CustomerDto
                {
                    Id = c.Id,
                    Nic = c.Nic,
                    Name = c.Name,
                    MobileNo = c.MobileNo
                }).ToListAsync();
        }

        public async Task<CustomerDto?> GetCustomerByIdAsync(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null || customer.IsActive != true)
                return null;

            return new CustomerDto
            {
                Id = customer.Id,
                Nic = customer.Nic,
                Name = customer.Name,
                MobileNo = customer.MobileNo
            };
        }

        public async Task<CustomerDto> CreateCustomerAsync(CreateCustomerDto dto, string createdBy)
        {
            var customer = new Customer
            {
                Nic = dto.Nic,
                Name = dto.Name,
                MobileNo = dto.MobileNo,
                CreatedBy = createdBy,
                CreatedDate = DateTime.Now,
                IsActive = true
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            return new CustomerDto
            {
                Id = customer.Id,
                Nic = customer.Nic,
                Name = customer.Name,
                MobileNo = customer.MobileNo
            };
        }

        public async Task<bool> UpdateCustomerAsync(int id, UpdateCustomerDto dto)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null || customer.IsActive != true)
                return false;

            customer.Nic = dto.Nic;
            customer.Name = dto.Name;
            customer.MobileNo = dto.MobileNo;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeactivateCustomerAsync(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null || customer.IsActive != true)
                return false;

            customer.IsActive = false;
            await _context.SaveChangesAsync();
            return true;
        }

    }
}
