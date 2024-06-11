using CarWorkshop_React.DTOs;
using CarWorkshop_React.Interfaces;
using CarWorkshop_React.Models;
using CarWorkshop_React.Repository;
using Microsoft.AspNetCore.Mvc;

namespace CarWorkshop_React.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TicketController : ControllerBase
    {
        private readonly ITicketRepository _ticketRepository;
        private readonly IPhotoService _photoService;

        public TicketController(ITicketRepository ticketRepository, IPhotoService photoService)
        {
            _ticketRepository = ticketRepository;
            _photoService = photoService;
        }

        [HttpGet]
        public async Task<IActionResult> Tickets()
        {
            return Ok(await _ticketRepository.GetAllNoTracking());
        }

        [HttpPost]
        public async Task<IActionResult> CreateTicket([FromForm] CreateTicketModel ticketVM)
        {
            if (ticketVM == null)
            {
                return BadRequest();
            }
            string photo = null;
            if (ticketVM.Image != null)
            {
                var result = await _photoService.AddPhotoAsync(ticketVM.Image);
                photo = result.Url.ToString();
            }

            var ticket = new Ticket
            {
                Car = new Car
                {
                    Brand = ticketVM.Car.Brand,
                    Model = ticketVM.Car.Model,
                    RegId = ticketVM.Car.RegId,
                    Image = photo
                },
                EmployeeId = ticketVM.EmployeeId,
                Description = ticketVM.Description
            };

            if (ticketVM.DateTimeSlots != null)
            {
                ticket.DateTimeSlots = new List<DateTimeSlot>
                {
                    new DateTimeSlot
                    {
                        From = ticketVM.DateTimeSlots.From,
                        Till = ticketVM.DateTimeSlots.Till
                    }
                };
            }

            await _ticketRepository.AddAsync(ticket);

            return Ok(ticket);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTicket(int id)
        {
            var Ticket = await _ticketRepository.GetByIdAsync(id);
            if (Ticket == null)
            {
                return NotFound();
            }
            return Ok(Ticket);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTicket(int id, [FromForm] UpdateTicketModel ticketVM)
        {
            if (id != ticketVM.Id)
            {
                return BadRequest();
            }

            var userTicket = await _ticketRepository.GetByIdAsyncNoTracking(id);

            if (userTicket != null)
            {
                if (userTicket.Car.Image != null && ticketVM.Image != null)
                {
                    try
                    {
                        await _photoService.DeletePhotoAsync(userTicket.Car.Image);
                    }
                    catch (Exception ex)
                    {
                        return BadRequest(ex.Message);
                    }
                }
                string photoResult = null;
                if (ticketVM.Image != null)
                {
                    var photo = await _photoService.AddPhotoAsync(ticketVM.Image);
                    photoResult = photo.Url.ToString();
                }
                else
                {
                    photoResult = userTicket.Car.Image;
                }
                ticketVM.Car.Image = photoResult;

                var ticket = new Ticket
                {
                    Id = id,
                    CarId = ticketVM.CarId,
                    Car = ticketVM.Car,
                    EmployeeId = ticketVM.EmployeeId,
                    Description = ticketVM.Description
                };

                _ticketRepository.Update(ticket);

                return NoContent();
            }
            else
            {
                return BadRequest();
            }

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTicket(int id)
        {
            var ticketDetails = await _ticketRepository.GetByIdAsync(id);
            if (ticketDetails == null)
            {
                return NotFound();
            }

            _ticketRepository.Delete(ticketDetails);
            return Ok(ticketDetails);
        }
    }
}
