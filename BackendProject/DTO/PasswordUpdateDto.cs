namespace BackendProject.DTO
{
    public class PasswordUpdateDto
    {
        public int UserId { get; set; }
        public string Password { get; set; } = string.Empty;
    }
}

