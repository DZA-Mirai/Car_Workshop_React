using CarWorkshop_React.DTOs;
using CarWorkshop_React.Interfaces;
using CarWorkshop_React.Models;
using Microsoft.AspNetCore.Mvc;

namespace CarWorkshop_React.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TicketDetailController : ControllerBase
    {
        private readonly ITicketRepository _ticketRepository;

        public TicketDetailController(ITicketRepository ticketRepository)
        {
            _ticketRepository = ticketRepository;
        }

        [HttpPut]
        public async Task<IActionResult> AcceptTicket(int id, int employeeId)
        {
            var ticket = await _ticketRepository.GetByIdAsync(id);
            if (ticket == null) { return NotFound(); }
            ticket.EmployeeId = employeeId;
            _ticketRepository.Update(ticket);
            return Ok(ticket);
        }

        [HttpPost]
        public async Task<IActionResult> AddDate(int id, TimeSlots timeSlot)
        {
            var ticket = await _ticketRepository.GetByIdAsync(id);
            if (ticket == null) { return NotFound();}
            var date = new DateTimeSlot
            {
                From = timeSlot.From,
                Till = timeSlot.Till,
            };

            if (ticket.DateTimeSlots == null)
            {
                ticket.DateTimeSlots = new List<DateTimeSlot>();
            }

            ticket.DateTimeSlots.Add(date);
            _ticketRepository.Update(ticket);
            return Ok(ticket);
        }

        [HttpGet]
        public async Task<IActionResult> DenyTicket(int id)
        {
            var ticket = await _ticketRepository.GetByIdAsync(id);
            if (ticket == null) { return NotFound();}
            ticket.EmployeeId = null;
            _ticketRepository.Update(ticket);
            return Ok(ticket);
        }

        [HttpDelete]
        public async Task<IActionResult> RemoveDate(int id, int slotId)
        {
            var ticket = await _ticketRepository.GetByIdAsync(id);
            if (ticket == null) { return NotFound();}
            var slotToRemove = await _ticketRepository.GetSlotByIdAsync(slotId);
            if (slotToRemove != null)
            {
                _ticketRepository.DeleteDates(slotToRemove);
            }
            return Ok(ticket);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Done(int id)
        {
            var ticket = await _ticketRepository.GetByIdAsync(id);
            if (ticket == null) { return NotFound();}
            if (ticket.IsDone)
            {
                ticket.IsDone = false;
            }
            else
            {
                ticket.IsDone = true;
            }
            _ticketRepository.Update(ticket);
            return Ok(ticket);
        }
    }
}
