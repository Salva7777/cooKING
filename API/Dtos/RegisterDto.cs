using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class RegisterDto
    {
        [Required]
        public string DisplayName { get; set; }
        
        [Required]
        public string Email { get; set; }

        [Required]
        [RegularExpression("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$", ErrorMessage = "The password given doesn't respect the requirements")]
        public string Password { get; set; }

        [Required]
        [RegularExpression("(?!.*\\W)(?!.*[A-Z]).{4,32}$", ErrorMessage = "Username mustn't have any spaces and symbols")]
        public string Username { get; set; }
    }
}