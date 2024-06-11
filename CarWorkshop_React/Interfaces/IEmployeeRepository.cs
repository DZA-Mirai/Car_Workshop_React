using CarWorkshop_React.Models;

namespace CarWorkshop_React.Interfaces
{
    public interface IEmployeeRepository
    {
        Task<IEnumerable<Employee>> GetAll();
        Task<IEnumerable<Employee>> GetAllNoTracking();
        Task<Employee> GetByLoginPassAsync(string login, string pass);
        Task<Employee> GetByIdAsync(int id);
        Task<Employee> GetByIdAsyncNoTracking(int id);
        bool Add(Employee employee);
        Task<bool> AddAsync(Employee employee);
        bool Update(Employee employee);
        bool Delete(Employee employee);
        bool Save();
        Task<bool> SaveAsync();
    }
}
