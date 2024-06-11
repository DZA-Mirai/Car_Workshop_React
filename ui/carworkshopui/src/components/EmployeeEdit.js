import React, { useState, useEffect } from 'react';
import { BASE_URL } from './constant';
import { useParams, useNavigate } from 'react-router-dom';

function EditEmployee() {
    const { id } = useParams();
    const [file, setFile] = useState(null);
    const [employee, setEmployee] = useState({
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
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await fetch(BASE_URL + '/' + id);
                if (!response.ok){
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setEmployee(data);
            } catch (error) {
                console.error('Error fetching employee data:', error);
            }
        };

        fetchEmployee();
    }, [id]);

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
        else{
            data.append('Image', employee['Image']);
        }
        console.log(data);

        try {
            console.log(BASE_URL + '/' + id);
            const response = await fetch(BASE_URL + '/' + id, {
                method: 'PUT',
                body: data,
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrors(errorData.errors);
                throw new Error('Network response was not ok');
            }

            // Handle successful submission
            navigate('/employees');
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div>
            <h1>Edit Employee</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        id="Name"
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
                        id="Surname"
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
                        id="Login"
                        name="Login"
                        className="form-control"
                        defaultValue={employee.Login}
                        onChange={handleChange}
                        placeholder="Enter login"
                    />
                    {errors.Login && <span className="text-danger">{errors.Login}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        id="Password"
                        name="Password"
                        type="password"
                        className="form-control"
                        defaultValue={employee.Password}
                        onChange={handleChange}
                        placeholder="Enter password"
                    />
                    {errors.Password && <span className="text-danger">{errors.Password}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="salary">Salary</label>
                    <input
                        id="Salary"
                        name="Salary"
                        className="form-control"
                        defaultValue={employee.Salary}
                        onChange={handleChange}
                        placeholder="Enter an hourly salary"
                    />
                    {errors.Salary && <span className="text-danger">{errors.Salary}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="birthDate">Birth Date</label>
                    <input
                        id="BirthDate"
                        name="BirthDate"
                        type="date"
                        className="form-control"
                        defaultValue={employee.BirthDate?.substring(0, 10)}
                        onChange={handleChange}
                    />
                    {errors.BirthDate && <span className="text-danger">{errors.BirthDate}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <select
                        id="Gender"
                        name="Gender"
                        className="form-control"
                        defaultValue={employee.Gender}
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
                        id="WorkingSince"
                        name="WorkingSince"
                        type="date"
                        className="form-control"
                        defaultValue={employee.WorkingSince?.substring(0, 10)}
                        onChange={handleChange}
                    />
                    {errors.WorkingSince && <span className="text-danger">{errors.WorkingSince}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="isAdmin">Give Administrator Role</label>
                    <input
                        id="IsAdmin"
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
                        id="Image"
                        name="Image"
                        type="file"
                        className="form-control"
                        onChange={handleFileChange}
                    />
                    {errors.Image && <span className="text-danger">{errors.Image}</span>}
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
}

export default EditEmployee;
