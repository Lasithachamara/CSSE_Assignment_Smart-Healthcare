using System.ComponentModel.DataAnnotations;

namespace BackendProject.DTO
{

    public class UserDto
    {
        public int Id { get; set; }

        [Required]
        public string? Nic { get; set; }

        [Required]
        public string? FirstName { get; set; }

        [Required]
        public string? UserName { get; set; }

        [Required]
        [EmailAddress]
        public string? Email { get; set; }

        [Required]
        public string? Password { get; set; }

        [Required]
        public int? AccessLevel { get; set; }

        [Required]
        public bool? ActiveStatus { get; set; }

        [Required]
        public string? Mobile { get; set; }

        [Required]
        public string? CreatedBy { get; set; }

        [Required]
        public DateTime? CreatedDate { get; set; }

        [Required]
        public string? LastName { get; set; }

        [Required]
        public DateTime? DateOfBirth { get; set; }

        [Required]
        public string? Gender { get; set; }

        [Required]
        public string? ContactNumber { get; set; }

        [Required]
        public string? EmergencyContactNo { get; set; }

        public string? Address { get; set; }

     
        public string? BloodType { get; set; }

        public string? Qrcode { get; set; }


    }
}