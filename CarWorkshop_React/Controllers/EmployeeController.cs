using CarWorkshop_React.DTOs;
using CarWorkshop_React.Interfaces;
using CarWorkshop_React.Models;
using Microsoft.AspNetCore.Mvc;

namespace CarWorkshop_React.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IPhotoService _photoService;

        public EmployeeController(IEmployeeRepository employeeRepository, IPhotoService photoService)
        {
            _employeeRepository = employeeRepository;
            _photoService = photoService;
        }

        [HttpGet]
        public async Task<IActionResult> Employees()
        {
            return Ok(await _employeeRepository.GetAllNoTracking());
        }

        [HttpPost]
        public async Task<IActionResult> CreateEmployee([FromForm] CreateEmployeeModel employeeVM)
        {
            if (employeeVM == null)
            {
                return BadRequest();
            }
            string photo = null;
            if(employeeVM.Image != null)
            {
                var result = await _photoService.AddPhotoAsync(employeeVM.Image);
                photo = result.Url.ToString();
            }
            var employee = new Employee
            {
                Name = employeeVM.Name,
                Surname = employeeVM.Surname,
                Image = photo,
                Login = employeeVM.Login,
                Password = employeeVM.Password,
                Salary = employeeVM.Salary,
                BirthDate = employeeVM.BirthDate,
                Gender = employeeVM.Gender,
                WorkingSince = employeeVM.WorkingSince,
                IsAdmin = employeeVM.IsAdmin
            };


            await _employeeRepository.AddAsync(employee);

            return Ok(employeeVM);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetEmployee(int id)
        {
            var Employee = await _employeeRepository.GetByIdAsync(id);
            if(Employee == null)
            {
                return NotFound();
            }
            return Ok(Employee);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, [FromForm] UpdateEmployeeModel employeeVM)
        {
            if(id != employeeVM.Id)
            {
                return BadRequest();
            }

            var userEmployee = await _employeeRepository.GetByIdAsyncNoTracking(id);

            if(userEmployee != null)
            {
                if(userEmployee.Image != null && employeeVM.Image != null)
                {
                    try
                    {
                        await _photoService.DeletePhotoAsync(userEmployee.Image);
                    }
                    catch (Exception ex)
                    {
                        return BadRequest(ex.Message);
                    }
                }
                string photoResult = null;
                if(employeeVM.Image != null)
                {
                    var photo = await _photoService.AddPhotoAsync(employeeVM.Image);
                    photoResult = photo.Url.ToString();
                }
                else
                {
                    photoResult = userEmployee.Image;
                }

                var employee = new Employee
                {
                    Id = id,
                    Image = photoResult,
                    Name = employeeVM.Name,
                    Surname = employeeVM.Surname,
                    Login = employeeVM.Login,
                    Password = employeeVM.Password,
                    Salary = employeeVM.Salary,
                    BirthDate = employeeVM.BirthDate,
                    Gender = employeeVM.Gender,
                    WorkingSince = employeeVM.WorkingSince,
                    IsAdmin = employeeVM.IsAdmin
                };

                _employeeRepository.Update(employee);

                return NoContent();
            }
            else
            {
                return BadRequest();
            }
            
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var employeeDetails = await _employeeRepository.GetByIdAsync(id);
            if(employeeDetails == null)
            {
                return NotFound();
            }

            _employeeRepository.Delete(employeeDetails);
            return Ok(employeeDetails);
        }
    }
}
