import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TICKET_URL } from './constant';
import './styles.css';

function TicketDetail(userId) {
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [from, setFrom] = useState('');
    const [till, setTill] = useState('');
    const [showAdd, setShowAdd] = useState(false);
    const [part, setPart] = useState({
        ticketId: '',
        partName: '',
        amount: '',
        unitPrice: '',
    });

    useEffect(() => {
        fetchTicket(id);
    }, [id]);

    const fetchTicket = async (id) => {
        try {
            const response = await fetch(TICKET_URL + '/' + id);
            if (!response.ok){
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setTicket(data);
        } catch (error) {
            console.error('Error fetching employee data:', error);
        }
    };

    if (!ticket) {
        return <div>Loading...</div>;
    }

    const handleAccept = async (ticketId) => {
        const params = new URLSearchParams({id: ticketId, employeeId: userId.userId.currentUserId});
        console.log(`https://localhost:7221/api/TicketDetail?${params}`);
        const response = await fetch(`https://localhost:7221/api/TicketDetail?${params}`, {
            method: 'PUT',
        });
        if (response.ok){
            fetchTicket(ticketId);
        }
        else{
            console.log("Accept failed.")
        }
    };

    const handleDeny = async (ticketId) => {
        const params = new URLSearchParams({id: ticketId});
        const response = await fetch(`https://localhost:7221/api/TicketDetail?${params}`);
        if(response.ok){
            fetchTicket(ticketId);
        }
        else{
            console.log("Accept failed.")
        }
    };

    const AssignedEmployee = () => {
        if(ticket.Employee != null){
            if(userId.userId.currentUserId !== ticket.Employee.Id){
                return (
                    <div>
                        <p>Employee: {ticket.Employee.Name} {ticket.Employee.Surname}</p>
                        <button className="btn btn-sm btn-outline-secondary" disabled>Not your ticket</button>
                    </div>);
            }
            else{
                return (
                    <div>
                        <p>Employee: {ticket.Employee.Name} {ticket.Employee.Surname}</p>
                        <button onClick={() => handleDeny(ticket.Id)} className="btn btn-sm btn-outline-secondary">Reject</button>
                    </div>);
            }
        }
        else{
            return (
            <div>
                <p>Employee: Not specified yet</p>
                <button onClick={() => handleAccept(ticket.Id)} class="btn btn-primary">Accept Ticket</button>
            </div>);
        }
    };

    const AdditionalInfo = () => {
        if(ticket.AdditionalTicketInfo == null){
            return (<p>Expected Cost: Not specified yet</p>);
        }
        else{
            return (<p>Expected Cost: {ticket.AdditionalTicketInfo.ExpectedCost} PLN</p>);
        }
    };

    const handleDone = async () => {
        console.log(`https://localhost:7221/api/TicketDetail/${ticket.Id}`);
        const response = await fetch(`https://localhost:7221/api/TicketDetail/${ticket.Id}`);
        if(response.ok){
            fetchTicket(ticket.Id);
        }
        else{
            console.log("Accept failed.");
        }
    };

    const TicketStatus = () => {
        if(ticket.IsClosed){
            return (
            <div>
                <p>Status: Archived!</p>
                <button type="submit" class="btn btn-primary" disabled>Ticket is Archived</button>
            </div>);
        }
        else{
            if(ticket.IsDone){
                return (
                <div>
                    <p>Status: Ready to pick up by the client!</p>
                    {(ticket.Employee !== null && ticket.Employee.Id === userId.userId.currentUserId) &&(<button onClick={handleDone} class="btn btn-primary">Not ready yet?</button>)}
                </div>);
            }
            else{
                return (
                <div>
                    <p>Status: not done yet</p>
                    {(ticket.Employee !== null && ticket.Employee.Id === userId.userId.currentUserId) && (<button onClick={handleDone} class="btn btn-primary">Ready to pick up?</button>)}
                </div>);
            }
        }
    };

    const handleAddDates = async (e) => {
        e.preventDefault();
        console.log(JSON.stringify({from, till}));
        const params = new URLSearchParams({id: ticket.Id});
        console.log(`https://localhost:7221/api/TicketDetail?${params}`);
        const response = await fetch(`https://localhost:7221/api/TicketDetail?${params}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json-patch+json'
            },
            body: JSON.stringify({from, till}),
        });
        if(response.ok){
            fetchTicket(ticket.Id);
        }
        else{
            const error = await response.json();
            console.log(error);
            console.log("Adding Dates failed.")
        }
    };

    const handleRemoveDate = async (dateId) => {
        const params = new URLSearchParams({id: ticket.Id, slotId: dateId});
        const response = await fetch(`https://localhost:7221/api/TicketDetail?${params}`, {
            method: 'DELETE',
        });
        if(response.ok){
            fetchTicket(ticket.Id);
        }
        else{
            const error = await response.json();
            console.log(error);
            console.log("Adding Dates failed.")
        }
    };

    const handleRemovePart = async (partId) => {
        const params = new URLSearchParams({id: ticket.Id, slotId: partId});
        const response = await fetch(`https://localhost:7221/api/AdditionalInfo?${params}`, {
            method: 'DELETE',
        });
        if(response.ok){
            fetchTicket(ticket.Id);
        }
        else{
            const error = await response.json();
            console.log(error);
            console.log("Adding Dates failed.")
        }
    };

    const handleChange = (e) => {
        const { name, value} = e.target;
        setPart(() => ({
            ...part,
            [name]: value,
        }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        part.ticketId = ticket.Id
        const requestBody = {
            ticketId: ticket.Id,
            newPart: {
                partName: part.partName,
                amount: parseInt(part.amount),
                unitPrice: parseInt(part.unitPrice)
            }
        }
        console.log(JSON.stringify(requestBody));
        const params = new URLSearchParams({id: ticket.Id});
        const response = await fetch(`https://localhost:7221/api/AdditionalInfo?${params}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json-patch+json'
            },
            body: JSON.stringify(requestBody),
        });
        if(response.ok){
            setShowAdd(false);
            setPart({
                ticketId: ticket.Id,
                partName: '',
                amount: '',
                unitPrice: ''
            })
            fetchTicket(ticket.Id);
        }
        else{
            const error = await response.json();
            console.log(error);
            console.log("Adding Part failed.")
        }
    };

    const handleArchive = async () => {
        console.log(`https://localhost:7221/api/AdditionalInfo/${ticket.Id}`);
        const response = await fetch(`https://localhost:7221/api/AdditionalInfo/${ticket.Id}`);
        if(response.ok){
            fetchTicket(ticket.Id);
        }
        else{
            const error = await response.json();
            console.log(error);
            console.log("Adding Dates failed.")
        }
    } 

    return (
        <div className="container">
            <h1 className="my-4">
                Ticket #{ticket.Id}
            </h1>
            <div className="row">
                <div class="col-md-4">
                    <div class="p-4 mb-4 bg-light border rounded">
                        <h4 class="my-3">Main Information</h4>
                        <p>Car: {ticket.Car.Brand} {ticket.Car.Model}</p>
                        <p>Registration ID: {ticket.Car.RegId}</p>
                        <p>Description:</p>
                        <p>{ticket.Description}</p>
                    </div>  
                </div>
                <div class="col-md-4">
                    <div class="p-4 mb-4 bg-light border rounded">
                        <h4 class="my-3">Additional information</h4>
                        <AssignedEmployee />
                        <AdditionalInfo />
                        <TicketStatus />
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="p-4 mb-4 bg-light border rounded">
                        <h4 class="my-3">Car Image</h4>
                        {ticket.Car.Image == null && (<p>Not specified yet</p>)}
                        {ticket.Car.Image != null && (<img class="img-fluid" src={ticket.Car.Image} style={{width:'300px',height:'300px'}} alt=""></img>)}
                    </div>
                </div>
            </div>
            <div class="container">
                <div class="row">
                    <div class="col-md-6">
                        <h3 class="my-4">Purched parts and total cost</h3>
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Amount</th>
                                    <th>Unit Price</th>
                                    <th>Total Cost</th>
                                    <th></th>
                                </tr>
                            </thead>
                                {ticket.AdditionalTicketInfo != null &&  (
                                    <tbody>
                                        {ticket.AdditionalTicketInfo.Parts.map(item => (
                                            <tr key={item.Id}>
                                                <td>{item.PartName}</td>
                                                <td>{item.Amount}</td>
                                                <td>{item.UnitPrice} PLN</td>
                                                <td>{item.Amount * item.UnitPrice} PLN</td>
                                                <td><button onClick={() => handleRemovePart(item.Id)} class="btn btn-sm btn-outline-secondary">Remove</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                )}
                        </table>
                        {(ticket.IsDone || ticket.IsClosed) && (<button type="btn btn-success" class="btn btn-primary" disabled>Ticket is Done or Archived</button>)}
                        {(!ticket.IsDone && !ticket.IsClosed && ticket.Employee !== null && ticket.Employee.Id === userId.userId.currentUserId) && (
                            <button onClick={() => setShowAdd(true)} class="btn btn-primary">Add Parts</button>
                            )}
                        {showAdd && (
                            <div className='confirmation-dialog'>
                                <form onSubmit={handleSubmit}>
                                    <h1>Add Part</h1>
                                    <div className="form-group">
                                        <label>Name: </label>
                                        <input
                                            id="partName"
                                            name="partName"
                                            className="form-control"
                                            onChange={handleChange}
                                            placeholder="Enter Part Name"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Amount: </label>
                                        <input
                                            id="amount"
                                            name="amount"
                                            value={part.amount}
                                            className="form-control"
                                            onChange={handleChange}
                                            placeholder="Enter Amount"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Unit Price: </label>
                                        <input
                                            id="unitPrice"
                                            name="unitPrice"
                                            value={part.unitPrice}
                                            className="form-control"
                                            onChange={handleChange}
                                            placeholder="Enter Unit Price"
                                        />
                                    </div>
                                    <p></p>
                                    <button type="submit" className="btn btn-primary">Submit</button>
                                    <button onClick={() => setShowAdd(null)} className='btn btn-success'>Exit</button>
                                </form>
                            </div>
                        )}
                    </div>
                    <div class="col-md-6">
                        <h3 class="my-4">Time Slots</h3>
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>From</th>
                                    <th>Till</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {(ticket.DateTimeSlots.length !== 0 && ticket.DateTimeSlots[0].From) && (ticket.DateTimeSlots.map(item => (
                                    <tr key={item.Id}>
                                        <td>{item.From.split('T')[0]} {item.From.split('T')[1]}</td>
                                        <td>{item.Till.split('T')[0]} {item.Till.split('T')[1]}</td>
                                        <td><button onClick={() => handleRemoveDate(item.Id)} class="btn btn-sm btn-outline-secondary">Remove</button></td>
                                    </tr>
                                )))}
                            </tbody>
                        </table>
                        {(ticket.Employee !== null && ticket.Employee.Id === userId.userId.currentUserId) && (<form onSubmit={handleAddDates}>
                            <div className="form-group">
                                <label>From</label>
                                <input
                                    id="from"
                                    name="from"
                                    type="datetime-local"
                                    className="form-control"
                                    onChange={(e) => setFrom(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Till</label>
                                <input
                                    id="till"
                                    name="till"
                                    type="datetime-local"
                                    className="form-control"
                                    onChange={(e) => setTill(e.target.value)}
                                />
                            </div>
                            <p></p>
                            {(ticket.IsDone || ticket.IsClosed) ?
                            (<button type="btn btn-success" class="btn btn-primary" disabled>Ticket is Done or Archived</button>):
                            (<button type="submit" class="btn btn-primary">Add new time slot</button>)
                            }
                        </form>)}
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-10"></div>
                <div class="col-md-2">
                    {((ticket.IsClosed && userId.userId.isAdmin) || (ticket.IsClosed && ticket.Employee !== null && ticket.Employee.Id === userId.userId.currentUserId)) ? (
                        <button onClick={handleArchive} class="btn btn-primary">Return from Archived</button>
                    ) : (<button onClick={handleArchive} class="btn btn-primary">Close and Archive</button>)}
                </div>
            </div>
        </div>
    );
}

export default TicketDetail;
