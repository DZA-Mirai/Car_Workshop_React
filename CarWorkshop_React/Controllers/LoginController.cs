using CarWorkshop_React.DTOs;
using CarWorkshop_React.Helpers;
using CarWorkshop_React.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CarWorkshop_React.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly IEmployeeRepository _employeeRepository;

        public LoginController(IEmployeeRepository employeeRepository)
        {
            _employeeRepository = employeeRepository;
        }
        [HttpPost]
        public async Task<IActionResult> ValidateEmployee(LoginModel loginVM)
        {
            var employee = await _employeeRepository.GetByLoginPassAsync(loginVM.Username, loginVM.Password);
            if(employee != null)
            {
                AuthorizationManager.SetCurrentUser(employee.Id, employee.IsAdmin);
                return Ok(new { AuthorizationManager.currentUserId, AuthorizationManager.isAdmin });
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpGet]
        public async Task<IActionResult> currentUser()
        {
            return Ok(new { AuthorizationManager.currentUserId, AuthorizationManager.isAdmin });
        }

        [HttpPut]
        public async Task<IActionResult> Logout()
        {
            AuthorizationManager.SetCurrentUser(-1, false);
            return Ok(new { AuthorizationManager.currentUserId, AuthorizationManager.isAdmin });
        }
    }
}
