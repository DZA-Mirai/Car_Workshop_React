import React, { useState } from 'react';
import { BASE_URL } from './constant';
import { Navigate, useNavigate } from 'react-router-dom';

function AddEmployee(id) {
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
        Image: null,
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

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

        const data = new FormData();
        if(employee.Gender != null){
            data.append('Gender', employee['Gender']);
        }
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
        data.append('Password', employee['Password']);

        if (file) {
            data.append('Image', file);
        }

        try {
            const response = await fetch(BASE_URL, {
                method: 'POST',
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
    
    if(id.id.currentUserId === -1 || !id.id.isAdmin ){
        return <Navigate to="/forbidden" />;
    }

    return (
        <div>
            <h1>Add New Employee</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        id="Name"
                        name="Name"
                        className="form-control"
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
                        onChange={handleChange}
                    >
                        <option value="" selected disabled>Choose...</option>
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

export default AddEmployee;
