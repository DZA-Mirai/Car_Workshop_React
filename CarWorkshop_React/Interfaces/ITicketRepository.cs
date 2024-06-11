using CarWorkshop_React.Models;

namespace CarWorkshop_React.Interfaces
{
    public interface ITicketRepository
    {
        Task<IEnumerable<Ticket>> GetAll();
        Task<IEnumerable<Ticket>> GetAllNoTracking();
        Task<Part> GetPartByIdAsync(int id);
        Task<DateTimeSlot> GetSlotByIdAsync(int id);
        Task<Ticket> GetByIdAsync(int id);
        Task<Ticket> GetByIdAsyncNoTracking(int id);
        Task<bool> AddAsync(Ticket ticket);
        bool Add(Ticket ticket);
        bool Update(Ticket ticket);
        bool Delete(Ticket ticket);
        bool Save();
        Task<bool> SaveAsync();
        bool DeleteDates(DateTimeSlot slot);
        bool DeletePart(Part part);
    }
}
