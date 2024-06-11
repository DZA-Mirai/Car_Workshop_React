import './App.css';
import './index.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';
import AddEmployee from './components/AddEmployee';
import Employees from './components/Employees';
import EmployeeDetail from './components/EmployeeDetail';
import EmployeeEdit from './components/EmployeeEdit';
import TicketDetail from './components/TicketDetail';
import CreateTicket from './components/CreateTicket';
import Tickets from './components/Tickets';
import Footer from './Footer';
import Navigation from './Navigation';
import { LOGIN_URL } from './components/constant';

const Forbidden = () => {
  return (
    <h1>Access Denied</h1>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
      fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
        const response = await fetch(LOGIN_URL);
        if (!response.ok){
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setUser(data);
        setLoading(false);
    } catch (error) {
        console.error('Error fetching employee data:', error);
    }
};

  if(loading){
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Navigation id={user} getUser={fetchUser}/>
      <div className='container'>
        <main role="main" className='pb-3'>
          <Routes>
            <Route path="/" element={<Home id={user} getUser={fetchUser}/>} />
            <Route path="/add-employee" element={<AddEmployee id={user}/>} />
            <Route path="/employees" element={<Employees id={user}/>} />
            <Route path="/employee/detail/:id" element={<EmployeeDetail userId={user}/>} />
            <Route path="/employee/edit/:id" element={<EmployeeEdit />} />
            <Route path="/ticket/detail/:id" element={<TicketDetail userId={user}/>} />
            <Route path="/create-ticket" element={<CreateTicket id={user}/>} />
            <Route path="/tickets" element={<Tickets id={user}/>} />
            <Route path="/forbidden" element={<Forbidden />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
