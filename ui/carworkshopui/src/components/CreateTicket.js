import React, { useState, useEffect } from 'react';
import { TICKET_URL, BASE_URL } from './constant';
import { Navigate, useNavigate } from 'react-router-dom';

function CreateTicket(id) {
    const [file, setFile] = useState(null);
    const [ticket, setTicket] = useState({
        carBrand: '',
        carModel: '',
        carRegId: '',
        description: '',
        employeeId: '' || null,
        from: '' || null,
        till: '' || null,
        image: null,
    });
    const [errors, setErrors] = useState({});
    const [employees, setEmployees] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
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

        fetchEmployees();
    }, []);

    const handleChange = (e) => {
        const { name, value} = e.target;
        setTicket(() => ({
            ...ticket,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('Car.Brand', ticket['carBrand']);
        data.append('Car.Model', ticket['carModel']);
        data.append('Car.RegId', ticket['carRegId']);
        data.append('Description', ticket['description']);
        if(ticket.employeeId != null){
            data.append('EmployeeId', ticket['employeeId']);
        }
        if(ticket.from != null){
            data.append('DateTimeSlots.From', ticket['from']);
        }
        if(ticket.till != null){
            data.append('DateTimeSlots.Till', ticket['till']);
        }
        if (file) {
            data.append('Image', file);
        }

        try {
            const response = await fetch(TICKET_URL, {
                method: 'POST',
                body: data,
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrors(errorData.errors);
                throw new Error('Network response was not ok');
            }

            // Handle successful submission
            navigate('/tickets');
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    if(id.id.currentUserId === -1 || !id.id.isAdmin ){
        return <Navigate to="/forbidden" />;
    }

    return (
        <div>
            <h1>Create New Ticket</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="form-group">
                    <label>Car Brand</label>
                    <input
                        id="carBrand"
                        name="carBrand"
                        className="form-control"
                        onChange={handleChange}
                        placeholder="Enter Car Brand"
                    />
                    {errors.carBrand && <span className="text-danger">{errors.carBrand}</span>}
                </div>
                <div className="form-group">
                    <label>Car Model</label>
                    <input
                        id="carModel"
                        name="carModel"
                        className="form-control"
                        onChange={handleChange}
                        placeholder="Enter car model"
                    />
                    {errors.carModel && <span className="text-danger">{errors.carModel}</span>}
                </div>
                <div className="form-group">
                    <label>Car Registration ID</label>
                    <input
                        id="carRegId"
                        name="carRegId"
                        className="form-control"
                        onChange={handleChange}
                        placeholder="Enter Registration ID"
                    />
                    {errors.carRegId && <span className="text-danger">{errors.carRegId}</span>}
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <input
                        id="description"
                        name="description"
                        className="form-control"
                        onChange={handleChange}
                        placeholder="Enter password"
                    />
                    {errors.description && <span className="text-danger">{errors.description}</span>}
                </div>
                <div className="form-group">
                    <label>Employee</label>
                    <select
                        id="employeeId"
                        name="employeeId"
                        className="form-control"
                        onChange={handleChange}
                    >
                        <option value="">-- Select Employee --</option>
                        {employees.map(employee => (
                            <option key={employee.Id} value={employee.Id}>
                                {employee.Name + ' ' + employee.Surname}
                            </option>
                        ))}
                    </select>
                    {errors.employeeId && <span className="text-danger">{errors.employeeId}</span>}
                </div>
                <div className="form-group">
                    <label>From</label>
                    <input
                        id="from"
                        name="from"
                        type="datetime-local"
                        className="form-control"
                        onChange={handleChange}
                    />
                    {errors.from && <span className="text-danger">{errors.from}</span>}
                </div>
                <div className="form-group">
                    <label>Till</label>
                    <input
                        id="till"
                        name="till"
                        type="datetime-local"
                        className="form-control"
                        onChange={handleChange}
                    />
                    {errors.till && <span className="text-danger">{errors.till}</span>}
                </div>
                <div className="form-group">
                    <label>Car Image</label>
                    <input
                        id="image"
                        name="image"
                        type="file"
                        className="form-control"
                        onChange={handleFileChange}
                    />
                    {errors.image && <span className="text-danger">{errors.image}</span>}
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
}

export default CreateTicket;
