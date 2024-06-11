import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { TICKET_URL, BASE_URL } from './constant';
import './styles.css';

function Tickets(id) {
    console.log(id);
    const [tickets, setTickets] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showEdit, setShowEdit] = useState(null);
    const [file, setFile] = useState(null);
    const [ticket, setTicket] = useState({
        id: '',
        carId: '',
        carBrand: '',
        carModel: '',
        carRegId: '',
        description: '',
        employeeId: '' || null,
        image: null,
    });
    const [errors, setErrors] = useState({});
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        fetchTickets();
    }, []);

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

    const fetchTickets = async () => {
        try {
            const response = await fetch(TICKET_URL);
            if (!response.ok){
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setTickets(data);
        } catch (error) {
            console.error('Error fetching employee data:', error);
        }
    };

    const handleDelete = async (id) => {
        try{
            const response = await fetch(TICKET_URL + '/' + id, {
                method: 'DELETE',
            });

            if(response.ok){
                setShowConfirmation(false);
                fetchTickets();
            } else{
                console.error("Error deleting employee ");
            }
        } catch (error){
            console.error("Error deleting employee ", error);
        }
    };

    const TicketStatus = ({emp, done, closed}) => {
        //console.log({emp, done, closed})
        if( emp == null){
            return (<small style={{color:'blue'}}>Created</small>);
        }
        else if(emp != null && !done && !closed){
            return (<small style={{color:"orange"}}>In Progress</small>);
        }
        else if(emp != null && done){
            return (<small style={{color:"green"}}>Done</small>);
        }
        else if(closed){
            return (<small style={{color:"gray"}}>Closed</small>);
        }
    };
    
    if(id.id.currentUserId === -1){
        return <Navigate to="/forbidden" />;
    }

    const TimeSlots = ({slots}) => {
        //console.log(slots)
        if(slots.length === 0 || !slots[0].From){
            return (
                <div>
                    <p class="card-text">Start: Not specified yet</p>
                    <p class="card-text">End: Not specified yet</p>
                </div>
            );
        }
        else{
            return (
                <div>
                    <p class="card-text">Start: {slots[0].From.substring(0, 10)}</p>
                    <p class="card-text">End: {slots[0].Till.substring(0, 10)}</p>
                </div>
            )
        }
    };

    const populateForm = (ticket) => {
        const defaultValues = {
            id: ticket.Id,
            carId: ticket.Car.Id,
            carBrand: ticket.Car.Brand,
            carModel: ticket.Car.Model,
            carRegId: ticket.Car.RegId,
            description: ticket.Description,
            employeeId: ticket.Employee !== null ? ticket.Employee.Id : null,
        }

        setTicket(defaultValues);
    };

    const handleChange = (e) => {
        console.log(e.target);
        const { name, value } = e.target;
        console.log(name, value);
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
        console.log(ticket)
        const data = new FormData();
        data.append('Id', ticket["id"]);
        data.append('Car.Id', ticket['carId']);
        data.append('Car.Brand', ticket['carBrand']);
        data.append('Car.Model', ticket['carModel']);
        data.append('Car.RegId', ticket['carRegId']);
        data.append('Description', ticket['description']);
        if(ticket.employeeId != null){
            data.append('EmployeeId', ticket['employeeId']);
        }
        if (file) {
            data.append('Image', file);
        }

        try {
            console.log(TICKET_URL + '/' + showEdit.Id)
            const response = await fetch(TICKET_URL + '/' + showEdit.Id, {
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
            fetchTickets();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div className="album py-5 bg-light">
            <div className="container">
                <div className="row">
                    {tickets.map(item => (
                        <div className="col-md-4" key={item.Id}>
                            <div className="card mb-4 box-shadow">
                                <div className="card-body">
                                    <p className="card-text">{item.Car.Brand} {item.Car.Model}</p>
                                    <p className="card-text">Description: {item.Description}</p>
                                    <p class="card-text">Employee: {item.Employee ? item.Employee.Name + ' ' + item.Employee.Surname : 'not specified yet'}</p>
                                    <TimeSlots slots={item.DateTimeSlots} />
                                    <p></p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="btn-group">
                                            <Link to={`/ticket/detail/${item.Id}`} className="btn btn-sm btn-outline-secondary">View</Link>
                                            <button onClick={() => {setShowEdit(item); populateForm(item)}} className="btn btn-sm btn-outline-secondary">Edit</button>
                                            {showEdit !== null && (
                                                <div className='confirmation-dialog'>
                                                    <div>
                                                        <h1>Edit Ticket</h1>
                                                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                                                            <div className="form-group">
                                                                <label htmlFor='carBrand'>Car Brand</label>
                                                                <input
                                                                    id="carBrand"
                                                                    name="carBrand"
                                                                    defaultValue={showEdit.Car.Brand}
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
                                                                    defaultValue={showEdit.Car.Model}
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
                                                                    defaultValue={showEdit.Car.RegId}
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
                                                                    defaultValue={showEdit.Description}
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
                                                                    value={ticket.employeeId !== null ? ticket.employeeId : "-- Select Employee --"}
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
                                                            <p></p>
                                                            <button type="submit" className="btn btn-primary">Submit</button>
                                                            <button onClick={() => setShowEdit(null)} className='btn btn-success'>Exit</button>
                                                        </form>
                                                    </div>
                                                </div>
                                            )}
                                            {id.id.isAdmin && (<button onClick={() => setShowConfirmation(true)} className="btn btn-sm btn-outline-secondary">Delete</button>)}
                                            {showConfirmation && (
                                                <div className='confirmation-dialog'>
                                                    <h3>Are you sure you want to delete this ticket?</h3>
                                                    <p className="card-text">{item.Car.Brand} {item.Car.Model}</p>
                                                    <button onClick={() => handleDelete(item.Id)} className='btn btn-danger'>Yes</button>
                                                    <button onClick={() => setShowConfirmation(false)} className='btn btn-success'>No</button>
                                                </div>
                                            )}
                                        </div>
                                        <TicketStatus emp={item.Employee} done={item.IsDone} closed={item.IsClosed} />
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

export default Tickets;