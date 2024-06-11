import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LOGIN_URL } from './components/constant';

function Navigation({id, getUser}) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const response = await fetch(LOGIN_URL, {
            method: 'PUT',
        })
        if(response.ok){
            getUser();
            navigate('/')
        }
        else{
            console.error("Logout failed.");
        }
        }

    return (
        <div>
            <header>
                <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
                    <div className="container-fluid">
                        <Link className="navbar-brand" to="/">CarWorkshop</Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target=".navbar-collapse" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="navbar-collapse collapse d-sm-inline-flex justify-content-between">
                            <ul className="navbar-nav flex-grow-1">
                                <li className="nav-item">
                                    {(<Link className="nav-link text-dark" to={`/`}>Home</Link>)}
                                </li>
                                <li className="nav-item">
                                    {(<Link className="nav-link text-dark" to="/add-employee">Add Employee</Link>)}
                                </li>
                                <li className="nav-item">
                                    {(<Link className="nav-link text-dark" to="/employees">Employees</Link>)}
                                </li>
                                <li className="nav-item">
                                    {(<Link className="nav-link text-dark" to="/create-ticket">Create Ticket</Link>)}
                                </li>
                                <li className="nav-item">
                                    {(<Link className="nav-link text-dark" to="/tickets">Tickets</Link>)}
                                </li>
                                <li className="nav-item">
                                    {id.currentUserId !== -1 && (<button className="nav-link text-dark" onClick={handleLogout}>Logout</button>)}
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
        </div>
    );
}

export default Navigation;