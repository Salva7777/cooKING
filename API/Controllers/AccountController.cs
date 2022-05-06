using System.Security.Claims;
using System.Threading.Tasks;
using API.Dtos;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        private readonly RoleManager<IdentityRole> _roleManager;
        public AccountController(UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager, SignInManager<AppUser> signInManager, TokenService tokenService)
        {
            _roleManager = roleManager;
            _tokenService = tokenService;
            _signInManager = signInManager;
            _userManager = userManager;
        }
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> login(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null) return Unauthorized("Invalid Email");

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            foreach (var role in await _userManager.GetRolesAsync(user))
            {
                var roleDto = new IdentityRole
                {
                    Id = _roleManager.FindByNameAsync(role).Result.Id,
                    Name = _roleManager.FindByNameAsync(role).Result.Name,
                    NormalizedName = _roleManager.FindByNameAsync(role).Result.NormalizedName,
                    ConcurrencyStamp = _roleManager.FindByNameAsync(role).Result.ConcurrencyStamp
                };
                user.Roles.Add(roleDto);
            };

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
            var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));
            return CreateUserObject(user);
        }

        private UserDto CreateUserObject(AppUser user)
        {
            return new UserDto
            {
                DisplayName = user.DisplayName,
                Image = null,
                Token = _tokenService.CreateToken(user),
                Username = user.UserName,
                Roles = user.Roles,
            };
        }
    }
}