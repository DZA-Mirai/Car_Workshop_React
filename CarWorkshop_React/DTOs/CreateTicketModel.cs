using CarWorkshop_React.Models;

namespace CarWorkshop_React.DTOs
{
    public class CreateTicketModel
    {
        public Car Car { get; set; }
        public IFormFile? Image { get; set; }
        public int? EmployeeId { get; set; }
        public string Description { get; set; }
        public DateTimeSlot? DateTimeSlots { get; set; }
    }
}
