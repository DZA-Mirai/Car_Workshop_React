import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { BASE_URL } from './constant';

function EmployeeDetail(userId) {
    const { id } = useParams();
    const [employee, setEmployee] = useState(null);
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

    if (!employee) {
        return <div>Loading...</div>;
    }

    const calculateAge = (birthDate) => {
        if (!birthDate) return 'Not specified yet';
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };
    
    if(userId.userId.currentUserId === -1){
        return <Navigate to="/" />
    }

    return (
        <div className="container">
            <h1 className="my-4">
                {employee.Name} {employee.Surname}
            </h1>
            <div className="row">
                <div className="col-md-8" style={{ width: '30%' }}>
                    <img
                        className="img-fluid"
                        src={employee.Image}
                        style={{ width: '300px', height: '300px' }}
                        alt={`${employee.Name} ${employee.Surname}`}
                    />
                </div>
                <div className="col-md-4">
                    <h4 className="my-3">Profile</h4>
                    <p>ID: {employee.Id}</p>
                    <p>An hourly salary: {employee.Salary} PLN</p>
                    <h4 className="my-3">Additional information</h4>
                    <ul>
                        <li>Gender: {employee.Gender}</li>
                        <li>Age: {calculateAge(employee.BirthDate)}</li>
                        <li>Working since: {employee.WorkingSince ? new Date(employee.WorkingSince).toDateString() : 'Not specified yet'}</li>
                        <li>Role: {employee.IsAdmin ? 'Admin' : 'Employee'}</li>
                    </ul>
                </div>
            </div>
            <h3 className="my-4">Tickets</h3>
            <div className="container">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Car</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employee.Tickets.map(ticket => (
                            <tr key={ticket.Id}>
                                <td>{ticket.Id}</td>
                                <td>{ticket.Car.Brand} {ticket.Car.Model}</td>
                                <td>{ticket.Description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default EmployeeDetail;
