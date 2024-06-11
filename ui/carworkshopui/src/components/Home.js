import React from 'react';
import './styles.css';
import { LOGIN_URL } from './constant';
import { Navigate } from 'react-router-dom';

function Home({id, getUser}) {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    console.log(id);
    console.log(getUser);
    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            const response = await fetch(LOGIN_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json-patch+json',
                },
                body: JSON.stringify({username, password}),
            });

            if (response.ok) {
                // window.location.reload();
                getUser();
            } else {
                console.error('Login failed');
            }
        }
        catch (error){
            console.log(error);
        }
    };

    if(id.currentUserId !== -1){
        return <Navigate to={`/employee/detail/${id.currentUserId}`} />;
    }

    return (
        <div class="text-center">
            <div class="text-center">
                <img class="mb-4" src="https://getbootstrap.com/docs/4.0/assets/brand/bootstrap-solid.svg" alt="" width="72" height="72" />
                <h1 class="h3 mb-3 font-weight-normal">You must sign in to get access</h1>
                <form className='form-signin' onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="form-control"
                        placeholder="Username"
                        required
                        autoFocus
                    />
                    <p></p>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control"
                        placeholder="Password"
                        required
                    />
                    <p></p>
                    <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
                </form>
            </div>
        </div>
    );
}

export default Home;