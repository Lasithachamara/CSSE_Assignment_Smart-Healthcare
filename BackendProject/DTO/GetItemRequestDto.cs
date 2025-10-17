using System.ComponentModel.DataAnnotations;

namespace BackendProject.DTO
{
    public class GetItemRequestDto
    {
        [Required]
        public int Id { get; set; }
    }
}
