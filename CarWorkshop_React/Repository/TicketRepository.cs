using CarWorkshop_React.Data;
using CarWorkshop_React.Interfaces;
using CarWorkshop_React.Models;
using Microsoft.EntityFrameworkCore;

namespace CarWorkshop_React.Repository
{
    public class TicketRepository : ITicketRepository
    {
        private readonly ApplicationDBContext _context;

        public TicketRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public bool Add(Ticket ticket)
        {
            _context.Add(ticket);
            return Save();
        }

        public bool Delete(Ticket ticket)
        {
            _context.Remove(ticket);
            return Save();
        }

        public async Task<IEnumerable<Ticket>> GetAll()
        {
            return await _context.Tickets.Include(a => a.DateTimeSlots).Include(a => a.Car).Include(a => a.Employee).ToListAsync();
        }
        public async Task<IEnumerable<Ticket>> GetAllNoTracking()
        {
            return await _context.Tickets.Include(a => a.DateTimeSlots).Include(a => a.Car).Include(a => a.Employee).AsNoTracking().ToListAsync();
        }
        public async Task<Part> GetPartByIdAsync(int id)
        {
            return await _context.Parts.FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<DateTimeSlot> GetSlotByIdAsync(int id)
        {
            return await _context.DateTimeSlots.FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<Ticket> GetByIdAsync(int id)
        {
            return await _context.Tickets.Include(a => a.DateTimeSlots).Include(a => a.Car).Include(a => a.Employee).Include(a => a.AdditionalTicketInfo).ThenInclude(b => b.Parts).FirstOrDefaultAsync(i => i.Id == id);
        }

        public async Task<Ticket> GetByIdAsyncNoTracking(int id)
        {
            return await _context.Tickets.Include(a => a.DateTimeSlots).Include(a => a.Car).Include(a => a.Employee).Include(a => a.AdditionalTicketInfo).ThenInclude(b => b.Parts).AsNoTracking().FirstOrDefaultAsync(i => i.Id == id);
        }

        public async Task<bool> AddAsync(Ticket ticket)
        {
            await _context.AddAsync(ticket);
            return await SaveAsync();
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }

        public async Task<bool> SaveAsync()
        {
            var saved = await _context.SaveChangesAsync();
            return saved > 0 ? true : false;
        }

        public bool Update(Ticket ticket)
        {
            _context.Update(ticket);
            return Save();
        }

        public bool DeleteDates(DateTimeSlot slot)
        {
            _context.Remove(slot);
            return Save();
        }
        public bool DeletePart(Part part)
        {
            _context.Remove(part);
            return Save();
        }
    }
}
