using System.ComponentModel.DataAnnotations;

namespace BackendProject.DTO
{
    public class UpdateCustomerDto
    {
        [Required(ErrorMessage = "NIC is required")]
        public string Nic { get; set; }

        [Required(ErrorMessage = "Name is required")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Mobile number is required")]
        [Phone(ErrorMessage = "Invalid phone number format")]
        public int MobileNo { get; set; }
    }
}
