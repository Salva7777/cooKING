using System.Security.Claims;
using System.Threading.Tasks;
using API.Dtos;
using API.Services;
using Application.Ingredients;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly TokenService _tokenService;
        private readonly RoleManager<AppRole> _roleManager;
        private readonly DataContext _context;
        public AccountController(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager, SignInManager<AppUser> signInManager, TokenService tokenService, DataContext context)
        {
            _context = context;
            _roleManager = roleManager;
            _tokenService = tokenService;
            _signInManager = signInManager;
            _userManager = userManager;
        }
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> login(LoginDto loginDto)
        {
            var user = await _context.Users.Include(x => x.Ingredients).ThenInclude(x => x.Ingredient).AsNoTracking().Include(x => x.UserRoles).ThenInclude(x => x.Role).AsNoTracking().FirstOrDefaultAsync(x => x.Email == loginDto.Email);

            if (user == null) return Unauthorized("Invalid Email");

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (result.Succeeded)
            {
                return CreateUserObject(user);
            }
            return Unauthorized("Email and Password doesn't match");
        }
        [HttpPost("Register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {

            if (await _userManager.Users.AnyAsync(x => x.Email == registerDto.Email))
                return BadRequest("Email taken");

            if (await _userManager.Users.AnyAsync(x => x.UserName == registerDto.Username))
                return BadRequest("Username taken");

            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Username
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            // ATRIBUIR ROLE AO UTILIZADOR
            var applicationRole = await _roleManager.FindByNameAsync("Admin");
            if (applicationRole != null)
            {
                IdentityResult roleResult = await _userManager.AddToRoleAsync(user, applicationRole.Name);
            }

            if (result.Succeeded)
            {

                return CreateUserObject(user);
            }

            return BadRequest("Problem registering user");
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _context.Users.Include(x => x.Ingredients).Include(x => x.UserRoles).ThenInclude(x => x.Role).FirstOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));

            return CreateUserObject(user);
        }

        private UserDto CreateUserObject(AppUser user)
        {
            var rolesArray = new List<IdentityRole>();
            foreach (var role in user.UserRoles)
            {
                rolesArray.Add(role.Role);
            }
            var IngredientssArray = new List<IngredientDto>();
            foreach (var Ingredient in user.Ingredients)
            {

                IngredientssArray.Add(new IngredientDto
                {
                    CreatedAt = Ingredient.Ingredient.CreatedAt,
                    CreatorId = Ingredient.Ingredient.AppUserId,
                    Id = Ingredient.Ingredient.Id,
                    Name = Ingredient.Ingredient.Name

                }
                );

            }
            return new UserDto
            {
                DisplayName = user.DisplayName,
                Image = null,
                Token = _tokenService.CreateToken(user),
                Username = user.UserName,
                Roles = rolesArray,
                Ingredients = IngredientssArray
            };
        }
    }
}