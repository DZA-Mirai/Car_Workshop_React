using CarWorkshop_React.DTOs;
using CarWorkshop_React.Interfaces;
using CarWorkshop_React.Models;
using Microsoft.AspNetCore.Mvc;

namespace CarWorkshop_React.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdditionalInfoController : ControllerBase
    {
        private readonly ITicketRepository _ticketRepository;

        public AdditionalInfoController(ITicketRepository ticketRepository)
        {
            _ticketRepository = ticketRepository;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Archive(int id)
        {
            var ticket = await _ticketRepository.GetByIdAsync(id);
            if(ticket == null) { return NotFound(); }
            if(ticket.IsClosed)
            {
                ticket.IsClosed = false;
            }
            else
            {
                ticket.IsClosed = true;
                ticket.IsDone = false;
            }
            _ticketRepository.Update(ticket);
            return Ok(ticket);
        }

        [HttpPost]
        public async Task<IActionResult> AddParts(int id, PartModel part)
        {
            var ticket = await _ticketRepository.GetByIdAsync(id);
            if(ticket == null) { return NotFound(); }
            if(ticket.AdditionalTicketInfo == null)
            {
                ticket.AdditionalTicketInfo = new AdditionalTicketInfo();
            }
            if(ticket.AdditionalTicketInfo.Parts == null)
            {
                ticket.AdditionalTicketInfo.Parts = new List<Part>();
            }
            ticket.AdditionalTicketInfo.Parts.Add(part.NewPart);
            _ticketRepository.Update(ticket);
            part.NewPart = new Part();
            return Ok(ticket);
        }

        [HttpDelete]
        public async Task<IActionResult> RemovePart(int id, int slotId)
        {
            var ticket = await _ticketRepository.GetByIdAsync(id);
            if(ticket == null) { return NotFound(); }
            var partToRemove = await _ticketRepository.GetPartByIdAsync(slotId);
            if(partToRemove != null)
            {
                _ticketRepository.DeletePart(partToRemove);
            }
            return Ok(ticket);
        }
    }
}
