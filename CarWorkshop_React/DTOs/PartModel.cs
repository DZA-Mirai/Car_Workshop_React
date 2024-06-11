using CarWorkshop_React.Models;

namespace CarWorkshop_React.DTOs
{
    public class PartModel
    {
        public int TicketId { get; set; }
        public Part NewPart { get; set; } = new Part();
    }
}
