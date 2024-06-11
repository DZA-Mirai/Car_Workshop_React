import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { BASE_URL } from './constant';
import './styles.css';

function Employees(id) {
    const [employees, setEmployees] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showEdit, setShowEdit] = useState(null);
    const [file, setFile] = useState(null);
    const [employee, setEmployee] = useState({
        id: '',
        Name: '',
        Surname: '',
        Login: '',
        Password: '',
        Salary: '' || null,
        BirthDate: '' || null,
        Gender: '',
        WorkingSince: '' || null,
        IsAdmin: false,
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await fetch(BASE_URL);
            if (!response.ok){
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            console.error('Error fetching employee data:', error);
        }
    };

    const handleDelete = async (id) => {
        try{
            const response = await fetch(BASE_URL + '/' + id, {
                method: 'DELETE',
            });

            if(response.ok){
                setShowConfirmation(false);
                fetchEmployees();
            } else{
                console.error("Error deleting employee ");
            }
        } catch (error){
            console.error("Error deleting employee ", error);
        }
    };

    const populateForm = (defaultValue) => {
        const defaultValues = {
            id: defaultValue.Id,
            Name: defaultValue.Name,
            Surname: defaultValue.Surname,
            Login: defaultValue.Login,
            Password: defaultValue.Password,
            Salary: defaultValue.Salary,
            BirthDate: defaultValue.BirthDate,
            Gender: defaultValue.Gender,
            WorkingSince: defaultValue.WorkingSince,
            IsAdmin: defaultValue.IsAdmin,
        }

        setEmployee(defaultValues);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEmployee(() => ({
            ...employee,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(employee)

        const data = new FormData();
        data.append("Id", employee['id']);
        data.append('Gender', employee['Gender']);
        data.append('IsAdmin', employee['IsAdmin']);
        if(employee.WorkingSince != null){
            data.append('WorkingSince', employee['WorkingSince']);
        }
        data.append('Login', employee['Login']);
        if(employee.Salary != null){
            data.append('Salary', employee['Salary']);
        }
        data.append('Name', employee['Name']);
        data.append('Surname', employee['Surname']);
        if(employee.BirthDate != null){
            data.append('BirthDate', employee['BirthDate']);
        }
        data.append('Id', employee['Id']);
        data.append('Password', employee['Password']);

        if (file) {
            data.append('Image', file);
        }

        try {
            console.log(BASE_URL + '/' + showEdit.Id);
            const response = await fetch(BASE_URL + '/' + showEdit.Id, {
                method: 'PUT',
                body: data,
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrors(errorData.errors);
                throw new Error('Network response was not ok');
            }

            // Handle successful submission
            setShowEdit(null);
            fetchEmployees();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    if(id.id.currentUserId === -1 || !id.id.isAdmin ){
        return <Navigate to="/forbidden" />;
    }

    return (
        <div className="album py-5 bg-light">
            <div className="container">
                <div className="row">
                    {employees.map(item => (
                        <div className="col-md-4" key={item.Id}>
                            <div className="card mb-4 box-shadow">
                                <img className="card-img-top" src={item.Image} style={{ width: '80px', height: '65px', margin: '19px 0px 0px 17px' }} alt="Employee" />
                                <div className="card-body">
                                    <p className="card-text">{item.Name} {item.Surname}</p>
                                    <p className="card-text">An hourly salary: {item.Salary} PLN</p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="btn-group">
                                            <Link to={`/employee/detail/${item.Id}`} className="btn btn-sm btn-outline-secondary">View</Link>
                                            <button onClick={() => {setShowEdit(item); populateForm(item)}} className="btn btn-sm btn-outline-secondary">Edit</button>
                                            {showEdit !== null && (
                                                <div className='confirmation-dialog'>
                                                    <h1>Edit Employee</h1>
                                                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                                                        <div className="form-group">
                                                            <label htmlFor="name">Name</label>
                                                            <input
                                                                name="Name"
                                                                className="form-control"
                                                                value={employee.Name}
                                                                onChange={handleChange}
                                                                placeholder="Enter name"
                                                            />
                                                            {errors.Name && <span className="text-danger">{errors.Name}</span>}
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="surname">Surname</label>
                                                            <input
                                                                name="Surname"
                                                                className="form-control"
                                                                value={employee.Surname}
                                                                onChange={handleChange}
                                                                placeholder="Enter surname"
                                                            />
                                                            {errors.Surname && <span className="text-danger">{errors.Surname}</span>}
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="login">Login</label>
                                                            <input
                                                                name="Login"
                                                                className="form-control"
                                                                value={employee.Login}
                                                                onChange={handleChange}
                                                                placeholder="Enter login"
                                                            />
                                                            {errors.Login && <span className="text-danger">{errors.Login}</span>}
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="password">Password</label>
                                                            <input
                                                                name="Password"
                                                                type="password"
                                                                className="form-control"
                                                                value={employee.Password}
                                                                onChange={handleChange}
                                                                placeholder="Enter password"
                                                            />
                                                            {errors.Password && <span className="text-danger">{errors.Password}</span>}
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="salary">Salary</label>
                                                            <input
                                                                name="Salary"
                                                                className="form-control"
                                                                value={employee.Salary}
                                                                onChange={handleChange}
                                                                placeholder="Enter an hourly salary"
                                                            />
                                                            {errors.Salary && <span className="text-danger">{errors.Salary}</span>}
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="birthDate">Birth Date</label>
                                                            <input
                                                                name="BirthDate"
                                                                type="date"
                                                                className="form-control"
                                                                value={employee.BirthDate !== null ? employee.BirthDate.substring(0, 10) : null}
                                                                onChange={handleChange}
                                                            />
                                                            {errors.BirthDate && <span className="text-danger">{errors.BirthDate}</span>}
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="gender">Gender</label>
                                                            <select
                                                                name="Gender"
                                                                className="form-control"
                                                                value={employee.Gender}
                                                                onChange={handleChange}
                                                            >
                                                                <option value="" disabled>Choose...</option>
                                                                <option value="Male">Male</option>
                                                                <option value="Female">Female</option>
                                                                <option value="I prefer not to say">I prefer not to say</option>
                                                            </select>
                                                            {errors.Gender && <span className="text-danger">{errors.Gender}</span>}
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="workingSince">Working Since</label>
                                                            <input
                                                                name="WorkingSince"
                                                                type="date"
                                                                className="form-control"
                                                                value={employee.WorkingSince !== null ? employee.WorkingSince.substring(0, 10) : null}
                                                                onChange={handleChange}
                                                            />
                                                            {errors.WorkingSince && <span className="text-danger">{errors.WorkingSince}</span>}
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="isAdmin">Give Administrator Role</label>
                                                            <input
                                                                name="IsAdmin"
                                                                type="checkbox"
                                                                className="form-check-input"
                                                                checked={employee.IsAdmin}
                                                                onChange={handleChange}
                                                            />
                                                            {errors.IsAdmin && <span className="text-danger">{errors.IsAdmin}</span>}
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="image">Image</label>
                                                            <input
                                                                name="Image"
                                                                type="file"
                                                                className="form-control"
                                                                onChange={handleFileChange}
                                                            />
                                                            {errors.Image && <span className="text-danger">{errors.Image}</span>}
                                                        </div>
                                                        <p></p>
                                                        <button type="submit" className="btn btn-primary">Submit</button>
                                                        <button onClick={() => setShowEdit(null)} className='btn btn-success'>Exit</button>
                                                    </form>
                                                </div>
                                            )}
                                            <button onClick={() => setShowConfirmation(true)} className="btn btn-sm btn-outline-secondary">Delete</button>
                                            {showConfirmation && (
                                                <div className='confirmation-dialog'>
                                                    <h3>Are you sure you want to delete this employee?</h3>
                                                    <p className="card-text">{item.Name} {item.Surname}</p>
                                                    <button onClick={() => handleDelete(item.Id)} className='btn btn-danger'>Yes</button>
                                                    <button onClick={() => setShowConfirmation(false)} className='btn btn-success'>No</button>
                                                </div>
                                            )}
                                        </div>
                                        {item.IsAdmin && (
                                            <small className="text-muted">Administrator</small>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Employees;