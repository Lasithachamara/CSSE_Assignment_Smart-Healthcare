using System.ComponentModel.DataAnnotations;

namespace BackendProject.DTO
{
    public class UpdateItemDto
    {
        [Required(ErrorMessage = "Item name is required")]
        [StringLength(200, ErrorMessage = "Item name can't be longer than 200 characters")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Price is required")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "Quantity is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
        public int Quantity { get; set; }

        [Required(ErrorMessage = "Reorder level is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Reorder level must be at least 1")]
        public int ReorderLv { get; set; }
    }
}
